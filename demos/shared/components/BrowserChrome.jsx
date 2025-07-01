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
  showControls = true,
  onNavigate
}) => {
  const [history, setHistory] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  
  // Listen for navigation events from child components
  React.useEffect(() => {
    const handleNavigationEvent = (event) => {
      if (event.detail && event.detail.action === 'navigate') {
        const newHistory = [...history.slice(0, currentIndex + 1), event.detail.view];
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
      }
    };
    
    window.addEventListener('demo-navigation', handleNavigationEvent);
    return () => window.removeEventListener('demo-navigation', handleNavigationEvent);
  }, [history, currentIndex]);
  
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;
  
  const handleBack = () => {
    if (canGoBack && onNavigate) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onNavigate('back', history[newIndex]);
    }
  };
  
  const handleForward = () => {
    if (canGoForward && onNavigate) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onNavigate('forward', history[newIndex]);
    }
  };
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
          <>
            <div className="browser-navigation">
              <button 
                className="browser-nav-btn" 
                aria-label="Back" 
                disabled={!canGoBack}
                onClick={handleBack}
              >
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className="browser-nav-btn" 
                aria-label="Forward" 
                disabled={!canGoForward}
                onClick={handleForward}
              >
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
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
          </>
        )}
      </div>
      
      <div className="browser-content">
        {children}
      </div>
    </div>
  );
};

export default BrowserChrome;