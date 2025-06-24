import React from 'react';
import { Lock } from 'lucide-react';

const BrowserChrome = ({ children }) => {
  return (
    <div className="browser-chrome">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-control close"></div>
          <div className="browser-control minimize"></div>
          <div className="browser-control maximize"></div>
        </div>
        <div className="browser-address-bar">
          <Lock className="w-3 h-3 text-green-600" />
          <span>manage.autodesk.com/products/custom-install</span>
        </div>
      </div>
      <div className="browser-content">
        {children}
      </div>
    </div>
  );
};

export default BrowserChrome;