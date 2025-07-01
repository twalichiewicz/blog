import React from 'react';
import BrowserChrome from './BrowserChrome';
import { getCursorStyle } from '../utils/cursor-utils';
import { isInIframe } from './utils/iframe-detection';
import './demo-wrapper.css';

/**
 * DemoWrapper - Reusable wrapper for all portfolio demos
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Demo content
 * @param {string} props.url - URL to display in browser chrome (optional)
 * @param {string} props.browserTheme - Browser chrome theme: 'mac' (default), 'windows', 'minimal'
 * @param {boolean} props.showBackground - Show makers marks background (default: true)
 * @param {Object} props.backgroundStyle - Custom background style overrides
 * @param {string} props.className - Additional CSS classes for wrapper
 * @param {string} props.customCursor - Custom cursor style: 'pointer', 'crosshair', 'help', 'move', 'text', 'wait', 'grab', 'zoom-in', 'enterprise', 'design-system', 'consumer', 'interactive' or custom URL
 */
const DemoWrapper = ({ 
  children, 
  url,
  browserTheme = 'mac',
  showBackground = true,
  backgroundStyle = {},
  className = '',
  customCursor = 'default',
  onNavigate
}) => {
  const cursorStyle = getCursorStyle(customCursor);
  const [zoom, setZoom] = React.useState(1);
  
  // Listen for zoom messages from parent window
  React.useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'setDemoZoom') {
        setZoom(event.data.zoom);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  // Don't show background when in iframe (inline demo)
  const shouldShowBackground = showBackground && !isInIframe();
  
  return (
    <>
      {shouldShowBackground && (
        <div 
          className="demo-background" 
          style={backgroundStyle}
        />
      )}
      <div className={`demo-wrapper ${className}`}>
        <div 
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease'
          }}
        >
          <BrowserChrome url={url} theme={browserTheme} onNavigate={onNavigate}>
            <div 
              className="demo-content-area" 
              style={{ cursor: cursorStyle }}
            >
              {children}
            </div>
          </BrowserChrome>
        </div>
      </div>
    </>
  );
};

export default DemoWrapper;