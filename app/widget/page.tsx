import AbundanceWidget from '@/components/AbundanceWidget'

export default function WidgetPage() {
  // This page will be used for iframe embedding with CSS-in-JS
  return (
    <AbundanceWidget 
      config={{
        theme: 'light',
        maxHeight: 'none',
        showFilters: true,
        compactMode: false
      }}
    />
  )
}
