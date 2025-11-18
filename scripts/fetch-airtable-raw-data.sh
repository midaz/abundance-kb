# Load AIRTABLE_API_KEY from .env file at project root
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep AIRTABLE_API_KEY | xargs)
fi

if [ -z "$AIRTABLE_API_KEY" ]; then
  echo "Error: AIRTABLE_API_KEY not found in .env file"
  exit 1
fi
export BASE='appp4QinpvtEldbq2'
export TABLE='tblQq8U7LQSQcN9YE'   # or tblAjzeCLFX6GPHYy
export VIEW='viwzabB3G62D0L57K'    # or viwNonOW9rcrQ0FT1
OUT='airtable_dump.csv'
API="https://api.airtable.com/v0/$BASE/$TABLE?view=$VIEW&pageSize=100"

# Header (matches your CSV importer)
echo 'Resource Name,Org,Date,URL,Summary,Tool Type,Policy Area,Region,Accessibility Score,Abundance Alignment,Strengths' > "$OUT"

URL="$API"
while :; do
  RESP=$(curl -sS --fail-with-body \
    -H "Authorization: Bearer $AIRTABLE_API_KEY" \
    -H "Accept-Encoding: identity" \
    "$URL") || { echo "Request failed"; break; }

  echo "$RESP" | jq -r '
    def clean: tostring | gsub("[\r\n]"; " ") | gsub("\\s+"; " ") | gsub("^\\s+|\\s+$"; "");
    def gg($k):
      (.fields[$k] // empty)
      | if type=="array" then (map(tostring) | join("; ")) else tostring end
      | clean;

    select(type=="object" and has("records"))
    | .records[]
    | [
        gg("Resource Name"),
        gg("Org"),
        gg("Date"),
        gg("URL"),
        gg("Summary"),
        gg("Tool Type"),
        gg("Policy Area"),
        gg("Region"),
        (gg("Accessibility Score") // gg("Accessible?")),
        (gg("Abundance Alignment") // gg("Abundance Tag")),
        (gg("Strengths") // gg("Abundance Note"))
      ]
    | @csv
  ' >> "$OUT"

  OFF=$(echo "$RESP" | jq -r '.offset // empty')
  [ -z "$OFF" ] && break
  URL="$API&offset=$OFF"
done

echo "Wrote $(wc -l < "$OUT") lines to $OUT"