import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * ChromePortal - Renders children inside the browser chrome container
 * This allows positioning elements relative to the browser chrome
 */
export function ChromePortal({ children }) {
  const [mounted, setMounted] = useState(false);
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    // Find the browser-chrome element
    const findBrowserChrome = () => {
      // First try to find it in the current document
      let chrome = document.querySelector('.browser-chrome');
      
      // If not found and we're in an iframe, try the parent document
      if (!chrome && window.parent && window.parent !== window) {
        try {
          chrome = window.parent.document.querySelector('.browser-chrome');
        } catch (e) {
          // Cross-origin access denied
        }
      }
      
      return chrome;
    };

    const chrome = findBrowserChrome();
    if (chrome) {
      // Create a container for our portal content
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.right = '0';
      container.style.bottom = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '1000';
      
      chrome.appendChild(container);
      setPortalElement(container);
      setMounted(true);
      
      return () => {
        chrome.removeChild(container);
      };
    }
  }, []);

  if (!mounted || !portalElement) {
    return null;
  }

  return createPortal(
    <div style={{ pointerEvents: 'auto' }}>
      {children}
    </div>,
    portalElement
  );
}