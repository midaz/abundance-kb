// Abundance Knowledge Base Widget
// Embeddable script for WordPress integration

(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.AbundanceWidget) {
    return;
  }

  // Widget configuration
  const DEFAULT_CONFIG = {
    theme: 'light',
    maxHeight: 'none',
    showFilters: true,
    compactMode: false
  };

  // Widget API
  window.AbundanceWidget = {
    init: function(targetId, config = {}) {
      const container = document.getElementById(targetId);
      if (!container) {
        console.error('AbundanceWidget: Target element not found:', targetId);
        return;
      }

      // Merge config with defaults
      const finalConfig = Object.assign({}, DEFAULT_CONFIG, config);

      // Create React root container
      const reactContainer = document.createElement('div');
      reactContainer.id = targetId + '-react-root';
      container.appendChild(reactContainer);

      // Initialize React app when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          initializeReactApp(reactContainer, finalConfig);
        });
      } else {
        initializeReactApp(reactContainer, finalConfig);
      }
    },

    // Multiple widget support
    initMultiple: function(selector, config = {}) {
      const containers = document.querySelectorAll(selector);
      containers.forEach(function(container, index) {
        const uniqueId = container.id || ('abundance-widget-' + index);
        container.id = uniqueId;
        this.init(uniqueId, config);
      }.bind(this));
    }
  };

  function initializeReactApp(container, config) {
    // This will be replaced with the actual React app initialization
    // For now, we'll load the Next.js app in an iframe as fallback
    const currentScript = document.currentScript || 
                         document.querySelector('script[src*="embed.js"]');
    
    if (!currentScript) {
      console.error('AbundanceWidget: Could not determine script source');
      return;
    }

    const scriptSrc = currentScript.src;
    const baseUrl = scriptSrc.replace('/embed.js', '');
    
    // For Phase 1, we'll use iframe embedding
    // In Phase 3, this will be replaced with proper React hydration
    const iframe = document.createElement('iframe');
    
    // Construct widget URL with styles parameter
    const widgetUrl = new URL(baseUrl + '/widget');
    iframe.src = widgetUrl.toString();
    
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.minHeight = config.maxHeight !== 'none' ? config.maxHeight : '1200px';
    iframe.style.height = config.maxHeight !== 'none' ? config.maxHeight : '1200px';
    iframe.setAttribute('allow', 'fullscreen');
    iframe.setAttribute('allowfullscreen', 'true');
    
    // Make iframe responsive
    iframe.style.display = 'block';
    iframe.style.overflow = 'hidden';
    
    // Enhanced iframe loading
    iframe.onload = function() {
      console.log('AbundanceWidget: Widget loaded successfully');
      
      // Auto-adjust height if possible (same-origin)
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          // Initial height adjustment
          setTimeout(() => {
            const contentHeight = Math.max(
              iframeDoc.body.scrollHeight,
              iframeDoc.body.offsetHeight,
              iframeDoc.documentElement.clientHeight,
              iframeDoc.documentElement.scrollHeight,
              iframeDoc.documentElement.offsetHeight
            );
            
            if (config.maxHeight === 'none' && contentHeight > 200) {
              iframe.style.height = (contentHeight + 50) + 'px'; // Add some padding
            }
          }, 1000);
          
          // Observe content changes
          const resizeObserver = new ResizeObserver(function() {
            if (config.maxHeight === 'none') {
              const contentHeight = Math.max(
                iframeDoc.body.scrollHeight,
                iframeDoc.documentElement.scrollHeight
              );
              if (contentHeight > 200) {
                iframe.style.height = (contentHeight + 50) + 'px';
              }
            }
          });
          
          resizeObserver.observe(iframeDoc.body);
          resizeObserver.observe(iframeDoc.documentElement);
        }
      } catch (e) {
        // Cross-origin restrictions - keep default height
        console.log('AbundanceWidget: Auto-height adjustment not available due to CORS');
      }
    };
    
    iframe.onerror = function() {
      console.error('AbundanceWidget: Failed to load widget');
      container.innerHTML = '<div class="abundance-widget-error">Failed to load widget. Please check the URL and try again.</div>';
    };

    container.appendChild(iframe);

    // Add widget-specific styles
    addWidgetStyles();
  }

  function addWidgetStyles() {
    if (document.getElementById('abundance-widget-styles')) {
      return; // Styles already added
    }

    const style = document.createElement('style');
    style.id = 'abundance-widget-styles';
    style.textContent = `
      .abundance-widget-container {
        font-family: "TT Hoves Pro", "Inter", system-ui, -apple-system, sans-serif;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      .abundance-widget-container * {
        box-sizing: border-box;
      }
      
      .abundance-widget-container iframe {
        transition: height 0.3s ease;
      }
      
      /* WordPress theme conflict prevention */
      .abundance-widget-container * {
        font-family: inherit !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Auto-initialize if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    // Look for elements with data-abundance-widget attribute
    const autoInitElements = document.querySelectorAll('[data-abundance-widget]');
    autoInitElements.forEach(function(element) {
      const config = {};
      
      // Parse config from data attributes
      if (element.dataset.abundanceTheme) {
        config.theme = element.dataset.abundanceTheme;
      }
      if (element.dataset.abundanceMaxHeight) {
        config.maxHeight = element.dataset.abundanceMaxHeight;
      }
      if (element.dataset.abundanceShowFilters) {
        config.showFilters = element.dataset.abundanceShowFilters === 'true';
      }
      if (element.dataset.abundanceCompactMode) {
        config.compactMode = element.dataset.abundanceCompactMode === 'true';
      }

      const targetId = element.id || ('auto-abundance-' + Math.random().toString(36).substr(2, 9));
      element.id = targetId;
      
      window.AbundanceWidget.init(targetId, config);
    });

    // Default initialization for #abundance-kb
    if (document.getElementById('abundance-kb') && !document.querySelector('[data-abundance-widget]')) {
      window.AbundanceWidget.init('abundance-kb');
    }
  });

})();
