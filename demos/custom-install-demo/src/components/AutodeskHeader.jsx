import React from 'react';
import { HelpCircle, Bell, User } from 'lucide-react';

const AutodeskHeader = () => {
  return (
    <header className="bg-black text-white h-12 flex items-center px-4">
      <div className="flex items-center gap-4">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 12L12 2L22 12L12 22L2 12Z" />
        </svg>
        <span className="text-sm font-medium">AUTODESK ACCOUNT</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Bell className="w-5 h-5 cursor-pointer hover:opacity-80" />
        <HelpCircle className="w-5 h-5 cursor-pointer hover:opacity-80" />
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
};

export default AutodeskHeader;