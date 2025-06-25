import React from 'react';

/**
 * BrowserChrome - Reusable browser window chrome
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display in browser
 * @param {string} props.url - URL to display in address bar
 * @param {string} props.theme - Chrome theme: 'mac' (default), 'windows', 'minimal'
 * @param {boolean} props.showAddressBar - Show address bar (default: true)
 * @param {boolean} props.showControls - Show window controls (default: true)
 */
const BrowserChrome = ({ 
  children, 
  url = 'example.com',
  theme = 'mac',
  showAddressBar = true,
  showControls = true
}) => {
  // Extract domain from URL for display
  const displayUrl = url.startsWith('http') ? url : `https://${url}`;
  const urlObject = new URL(displayUrl);
  const isSecure = urlObject.protocol === 'https:';

  return (
    <div className={`browser-chrome browser-chrome--${theme}`}>
      <div className="browser-header">
        {showControls && (
          <div className="browser-controls">
            {theme === 'mac' && (
              <>
                <div className="browser-control close" aria-label="Close"></div>
                <div className="browser-control minimize" aria-label="Minimize"></div>
                <div className="browser-control maximize" aria-label="Maximize"></div>
              </>
            )}
            {theme === 'windows' && (
              <>
                <div className="browser-control minimize" aria-label="Minimize">
                  <span>—</span>
                </div>
                <div className="browser-control maximize" aria-label="Maximize">
                  <span>□</span>
                </div>
                <div className="browser-control close" aria-label="Close">
                  <span>×</span>
                </div>
              </>
            )}
          </div>
        )}
        
        {showAddressBar && (
          <div className="browser-address-bar">
            {isSecure && (
              <svg 
                className="browser-secure-icon" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5 7V5a3 3 0 0 1 6 0v2m-7 0h8a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <span className="browser-url">{url}</span>
          </div>
        )}
      </div>
      
      <div className="browser-content">
        {children}
      </div>
    </div>
  );
};

export default BrowserChrome;