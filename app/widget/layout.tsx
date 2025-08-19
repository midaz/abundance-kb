import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Abundance Knowledge Base Widget",
  description: "Policy knowledge base and resource library",
  robots: "noindex", // Don't index the widget page
}

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="abundance-widget-page">
      {children}
    </div>
  )
}
