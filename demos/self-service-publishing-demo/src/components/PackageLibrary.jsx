import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit3,
  Package,
  Clock,
  Tag,
  Users,
  User
} from 'lucide-react';
import clsx from 'clsx';

const PackageLibrary = () => {
  const [activeTab, setActiveTab] = useState('my-library');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingName, setEditingName] = useState(null);
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'AutoCAD 2024 Command Set',
      type: 'Commands',
      lastSaved: '37 minutes ago',
      productCount: 23,
      owner: 'me'
    },
    {
      id: 2,
      name: 'Revit Collaboration Tools',
      type: 'Workflows',
      lastSaved: '2 hours ago',
      productCount: 14,
      owner: 'me'
    },
    {
      id: 3,
      name: 'Maya Animation Essentials',
      type: 'Tutorials',
      lastSaved: '1 day ago',
      productCount: 41,
      owner: 'me'
    },
    {
      id: 4,
      name: 'Fusion 360 Manufacturing',
      type: 'Best Practices',
      lastSaved: '3 days ago',
      productCount: 7,
      owner: 'me'
    },
    {
      id: 5,
      name: 'Civil 3D Infrastructure',
      type: 'Templates',
      lastSaved: '1 week ago',
      productCount: 18,
      owner: 'me'
    },
    {
      id: 6,
      name: 'Inventor Assembly Guides',
      type: 'Procedures',
      lastSaved: '2 weeks ago',
      productCount: 12,
      owner: 'me'
    },
    {
      id: 7,
      name: '3ds Max Rendering Pack',
      type: 'Assets',
      lastSaved: '3 weeks ago',
      productCount: 56,
      owner: 'me'
    },
    // Team packages
    {
      id: 8,
      name: 'Design Standards Library',
      type: 'Standards',
      lastSaved: '1 hour ago',
      productCount: 89,
      owner: 'team'
    },
    {
      id: 9,
      name: 'Project Templates Collection',
      type: 'Templates',
      lastSaved: '4 hours ago',
      productCount: 34,
      owner: 'team'
    },
    {
      id: 10,
      name: 'Quality Assurance Checklist',
      type: 'Workflows',
      lastSaved: '2 days ago',
      productCount: 16,
      owner: 'team'
    },
    {
      id: 11,
      name: 'Brand Guidelines Package',
      type: 'Standards',
      lastSaved: '5 days ago',
      productCount: 22,
      owner: 'team'
    },
    {
      id: 12,
      name: 'Training Module Library',
      type: 'Tutorials',
      lastSaved: '1 week ago',
      productCount: 67,
      owner: 'team'
    }
  ]);

  const filteredPackages = packages.filter(pkg => {
    const matchesTab = activeTab === 'my-library' ? pkg.owner === 'me' : pkg.owner === 'team';
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleNameEdit = (id, newName) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === id ? { ...pkg, name: newName } : pkg
    ));
    setEditingName(null);
  };

  const getTypeColor = (type) => {
    const colors = {
      'Commands': '#0696d7',
      'Workflows': '#28a745',
      'Tutorials': '#6f42c1',
      'Best Practices': '#fd7e14',
      'Templates': '#dc3545',
      'Standards': '#20c997',
      'Procedures': '#17a2b8',
      'Assets': '#e83e8c'
    };
    return colors[type] || '#6c757d';
  };

  return (
    <div className="package-library">
      {/* Tab Bar */}
      <div className="library-tabs">
        <button 
          className={clsx('tab-button', { active: activeTab === 'my-library' })}
          onClick={() => setActiveTab('my-library')}
        >
          <User size={16} />
          My Library
        </button>
        <button 
          className={clsx('tab-button', { active: activeTab === 'team-library' })}
          onClick={() => setActiveTab('team-library')}
        >
          <Users size={16} />
          Team Library
        </button>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button className="create-package-btn">
          <Plus size={16} />
          Create package
        </button>
        
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search packages"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Package Grid */}
      <div className="package-grid">
        {filteredPackages.map((pkg) => (
          <motion.div
            key={pkg.id}
            className="package-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="package-header">
              <Package size={20} style={{ color: getTypeColor(pkg.type) }} />
              <span 
                className="package-type"
                style={{ color: getTypeColor(pkg.type) }}
              >
                {pkg.type}
              </span>
            </div>

            <div className="package-name">
              {editingName === pkg.id ? (
                <input
                  type="text"
                  defaultValue={pkg.name}
                  autoFocus
                  onBlur={(e) => handleNameEdit(pkg.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNameEdit(pkg.id, e.target.value);
                    }
                    if (e.key === 'Escape') {
                      setEditingName(null);
                    }
                  }}
                  className="name-input"
                />
              ) : (
                <h3 
                  onClick={() => setEditingName(pkg.id)}
                  className="package-title"
                >
                  {pkg.name}
                  <Edit3 size={14} className="edit-icon" />
                </h3>
              )}
            </div>

            <div className="package-meta">
              <div className="meta-item">
                <Clock size={14} />
                <span>{pkg.lastSaved}</span>
              </div>
              <div className="meta-item">
                <Tag size={14} />
                <span>{pkg.productCount} products</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No packages found</h3>
          <p>
            {searchTerm 
              ? `No packages match "${searchTerm}"`
              : `No packages in ${activeTab === 'my-library' ? 'your library' : 'team library'} yet`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default PackageLibrary;