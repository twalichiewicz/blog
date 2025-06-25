import React from 'react';
import BrowserChrome from './BrowserChrome';
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
 */
const DemoWrapper = ({ 
  children, 
  url,
  browserTheme = 'mac',
  showBackground = true,
  backgroundStyle = {},
  className = ''
}) => {
  return (
    <>
      {showBackground && (
        <div 
          className="demo-background" 
          style={backgroundStyle}
        />
      )}
      <div className={`demo-wrapper ${className}`}>
        <BrowserChrome url={url} theme={browserTheme}>
          {children}
        </BrowserChrome>
      </div>
    </>
  );
};

export default DemoWrapper;