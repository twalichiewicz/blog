import React from 'react';
import { Home, Package, ChevronDown, Users, FileText, BarChart } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Home', active: false },
    { 
      icon: Package, 
      label: 'Products & Services', 
      active: true,
      submenu: [
        { label: 'All Products & Services', active: false },
        { label: 'Updates', active: false },
        { label: 'Custom Install', active: true },
        { label: 'Trials', active: false }
      ]
    },
    { 
      icon: Users, 
      label: 'User Management', 
      active: false,
      submenu: [
        { label: 'By User', active: false },
        { label: 'By Product', active: false },
        { label: 'Classic User Management', active: false }
      ]
    },
    { 
      icon: FileText, 
      label: 'Billing & Orders', 
      active: false,
      submenu: [
        { label: 'Subscriptions', active: false },
        { label: 'Upcoming Payments', active: false },
        { label: 'Order History', active: false }
      ]
    },
    { 
      icon: BarChart, 
      label: 'Reporting', 
      active: false,
      submenu: [
        { label: 'Cloud Services Usage', active: false },
        { label: 'Cloud Services Usage by User', active: false }
      ]
    }
  ];

  return (
    <aside className="w-56 bg-[#21252b] text-gray-300 flex flex-col">
      <nav className="flex-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index}>
              <div 
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer ${
                  item.active ? 'bg-gray-800 text-white' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm flex-1">{item.label}</span>
                {item.submenu && <ChevronDown className="w-4 h-4" />}
              </div>
              {item.submenu && item.active && (
                <div className="bg-gray-900">
                  {item.submenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className={`pl-12 pr-4 py-2 text-sm hover:bg-gray-800 cursor-pointer ${
                        subItem.active ? 'bg-[#0092e0] text-white' : ''
                      }`}
                    >
                      {subItem.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500">Privacy/Cookies</div>
        <div className="text-xs text-gray-500 mt-1">Terms of Use</div>
      </div>
    </aside>
  );
};

export default Sidebar;