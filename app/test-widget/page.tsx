"use client"

export default function TestWidgetPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Abundance Widget Test Page
          </h1>
          <p className="text-gray-600 mb-6">
            This page demonstrates how the widget will appear when embedded in WordPress. 
            Use this for testing before integrating with the WordPress site.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">WordPress Integration Code:</h2>
            <div className="bg-white rounded border p-3 font-mono text-sm">
              <div className="mb-2">&lt;div id=&quot;abundance-kb&quot;&gt;&lt;/div&gt;</div>
              <div>&lt;script src=&quot;https://your-app.vercel.app/embed.js&quot;&gt;&lt;/script&gt;</div>
            </div>
          </div>
        </div>

        {/* Simulated WordPress navbar */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">WordPress Site Navigation</div>
            <div className="space-x-4 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Resources</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>

        {/* Test different widget configurations */}
        <div className="space-y-8">
          {/* Full Widget */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Full Widget (Default Configuration)</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div id="abundance-kb-full"></div>
            </div>
          </section>

          {/* Compact Widget */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Compact Widget (No Filters)</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div 
                id="abundance-kb-compact"
                data-abundance-widget="true"
                data-abundance-show-filters="false"
                data-abundance-compact-mode="true"
                data-abundance-max-height="600px"
              ></div>
            </div>
          </section>

          {/* Dark Theme Widget */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Dark Theme Widget</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-900">
              <div 
                id="abundance-kb-dark"
                data-abundance-widget="true"
                data-abundance-theme="dark"
              ></div>
            </div>
          </section>
        </div>

        {/* Test script loading */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Simulate the embed script loading
              if (typeof window !== 'undefined') {
                // Initialize the main widget manually for demo
                setTimeout(() => {
                  if (window.AbundanceWidget) {
                    window.AbundanceWidget.init('abundance-kb-full');
                  }
                }, 100);
              }
            `
          }}
        />
      </div>
    </div>
  )
}
