import React, { useState, useRef, useEffect } from 'react';
import DemoWrapper from '../../shared/components/DemoWrapper.jsx';
import '../../shared/components/demo-wrapper.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Checkbox } from './components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
import { AccordionNoChevron, AccordionContentNoChevron, AccordionItemNoChevron, AccordionTriggerNoChevron } from './components/ui/accordion-no-chevron';
import { Search, Plus, MoreHorizontal, ChevronDown, ChevronRight, X, Package, Settings, Download, Save, Check, Trash2, Copy, Edit3 } from 'lucide-react';
import { ToastProvider } from './components/ui/toast';
import { useToast } from './components/use-toast';
import { Toaster } from './components/Toaster';

function App() {
  const [currentView, setCurrentView] = useState('library'); // 'library' or 'creator'
  const [currentStep, setCurrentStep] = useState(1);
  const [zoom, setZoom] = useState(() => {
    // Check if parent window has a stored zoom level
    if (window.parent && window.parent.demoZoomManager) {
      const storedZoom = window.parent.demoZoomManager.getZoom('custom-install-demo');
      return storedZoom ? storedZoom / 100 : 1;
    }
    return 1;
  });
  const demoRef = useRef(null);
  
  // Generate more realistic random data
  const generateRandomPackages = () => {
    const packageNames = [
      'Engineering Suite 2024 - Standard',
      'AEC Collection - Enterprise',
      'Manufacturing Bundle - Premium',
      'Media & Entertainment Pack',
      'Civil Infrastructure Tools',
      'Product Design Collection',
      'Architecture Essentials',
      'Construction Cloud Suite'
    ];
    
    const deploymentNames = [
      'Q1 2024 Global Rollout',
      'Engineering Dept Update',
      'Remote Worker Package',
      'New Hire Onboarding Kit',
      'Field Office Deployment',
      'Design Team Refresh',
      'Contractor Portal Access',
      'Student Lab Installation'
    ];
    
    return Array(5).fill(null).map((_, i) => {
      const isDeployment = Math.random() > 0.5;
      const name = isDeployment 
        ? deploymentNames[i % deploymentNames.length]
        : packageNames[i % packageNames.length];
      
      return {
        id: `pkg-${i + 1}`,
        name: name,
        installs: Math.floor(Math.random() * 10000) + 100,
        type: isDeployment ? 'deployment' : 'package',
        created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        modified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        status: Math.random() > 0.8 ? 'active' : 'inactive',
        isNew: false
      };
    });
  };
  
  const [packages, setPackages] = useState(() => {
    const pkgs = generateRandomPackages();
    // Assign stable product counts (A)
    return pkgs.map(pkg => ({
      ...pkg,
      productCount: Math.floor(Math.random() * 8) + 1
    }));
  });
  const [editingPackage, setEditingPackage] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState(new Set());
  const [selectedApps, setSelectedApps] = useState([]);
  const [selectedAppForDetails, setSelectedAppForDetails] = useState(null);
  const [appVersionSettings, setAppVersionSettings] = useState({});
  const [customizations, setCustomizations] = useState({});
  const [deploymentSettings, setDeploymentSettings] = useState({
    type: 'install',
    createShortcuts: true,
    addToStartMenu: true,
    createRestorePoint: false,
    logLocation: '%TEMP%\\Autodesk\\Install.log',
    networkPath: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sortField, setSortField] = useState('modified');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showDetailsModal, setShowDetailsModal] = useState(null);

  const handleCreateNew = () => {
    setEditingPackage(null);
    setCurrentStep(1);
    setSelectedApps([]);
    setCustomizations({});
    setCurrentView('creator');
  };

  const handleEditPackage = (pkg) => {
    // Reset state first
    setSelectedApps([]);
    setAppVersionSettings({});
    setCustomizations({});
    setDeploymentSettings({
      type: 'install',
      createShortcuts: true,
      addToStartMenu: true,
      createRestorePoint: false,
      logLocation: '%TEMP%\\Autodesk\\Install.log',
      networkPath: ''
    });
    
    setEditingPackage(pkg);
    setCurrentStep(1);
    setCurrentView('creator');
    
    // Load saved configuration or generate default
    if (pkg.configuration) {
      // Load saved configuration
      setSelectedApps(pkg.configuration.selectedApps || []);
      setAppVersionSettings(pkg.configuration.versionSettings || {});
      setCustomizations(pkg.configuration.customizations || {});
      setDeploymentSettings(pkg.configuration.deploymentSettings || {
        type: pkg.type === 'deployment' ? 'deploy' : 'install',
        createShortcuts: true,
        installPath: 'C:\\Program Files\\Autodesk',
        logLocation: 'C:\\ProgramData\\Autodesk\\Logs',
        networkPath: ''
      });
    } else {
      // Generate default configuration
      // Use the first few products from the static list
      const productList = ['autocad', 'revit', 'civil3d', 'maya', '3dsmax', 'inventor', 'fusion360', 'navisworks'];
      const productIds = productList.slice(0, pkg.productCount || 2);
      setSelectedApps(productIds);
      
      // Set random configurations for loaded products
      const settings = {};
      const customizationsData = {};
      productIds.forEach(id => {
        settings[id] = { type: 'latest', specificVersion: null };
        customizationsData[id] = {
          customLicensing: Math.random() > 0.7,
          serialNumber: Math.random() > 0.7 ? 'XXX-XXXXXXXX' : '',
          productKey: Math.random() > 0.7 ? 'XXXXX' : ''
        };
      });
      setAppVersionSettings(settings);
      setCustomizations(customizationsData);
      
      // Set deployment type based on package type
      setDeploymentSettings(prev => ({
        ...prev,
        type: pkg.type === 'deployment' ? 'deploy' : 'install'
      }));
    }
    
    setCurrentView('creator');
  };

  const handleSavePackage = (newPackage) => {
    if (editingPackage) {
      setPackages(packages.map(p => p.id === editingPackage.id ? { ...p, ...newPackage } : p));
    } else {
      setPackages([...packages, { ...newPackage, id: Date.now().toString(), isNew: true }]);
    }
    setCurrentView('library');
    setCurrentStep(1);
  };

  const handleBackToLibrary = () => {
    // Preserve scroll position
    const scrollY = window.scrollY;
    setCurrentView('library');
    setCurrentStep(1);
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  const handleDuplicatePackage = (pkg) => {
    const newPackage = {
      ...pkg,
      id: Date.now().toString(),
      isNew: true,
      name: `${pkg.name} (Copy)`,
      modified: new Date().toLocaleDateString(),
      productCount: pkg.productCount
    };
    setPackages([...packages, newPackage]);
  };

  const handleDeletePackage = (id) => {
    setPackages(packages.filter(p => p.id !== id));
    // Clear from selection if it was selected
    if (selectedPackages.has(id)) {
      const newSelection = new Set(selectedPackages);
      newSelection.delete(id);
      setSelectedPackages(newSelection);
    }
  };

  const handleRenamePackage = (id, newName) => {
    setPackages(packages.map(p => p.id === id ? { ...p, name: newName, isNew: false } : p));
  };

  // Library View Component
  const LibraryView = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('my-library');
    const [editingName, setEditingName] = useState(null);
    const [tempName, setTempName] = useState('');
    const [hoveredRow, setHoveredRow] = useState(null);
    
    const handleSort = (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };
    
    const filteredPackages = packages
      .filter(pkg => pkg.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        // Convert dates for proper sorting
        if (sortField === 'modified') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }
        
        if (sortField === 'productCount') {
          aVal = a.productCount || 0;
          bVal = b.productCount || 0;
        }
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

    const handleStartEdit = (pkg, e) => {
      e.stopPropagation();
      setEditingName(pkg.id);
      setTempName(pkg.name);
    };
    
    const handleSaveEdit = (id) => {
      if (tempName.trim()) {
        handleRenamePackage(id, tempName);
      }
      setEditingName(null);
    };
    
    const handleKeyDown = (e, id) => {
      if (e.key === 'Enter') {
        handleSaveEdit(id);
      } else if (e.key === 'Escape') {
        setEditingName(null);
      }
    };

    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-light">Custom Install</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b mb-6 -mx-6 px-6">
            <div className="flex -mb-px -ml-4">
              <button
                onClick={() => setActiveTab('my-library')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === 'my-library'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                My Library
              </button>
              <button
                onClick={() => setActiveTab('team-library')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === 'team-library'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Team Library
              </button>
            </div>
          </div>

          <TabsContent value="my-library" className="mt-0">
            <div className="flex justify-between items-center mb-6">
              <Button 
                onClick={handleCreateNew}
                className="bg-black hover:bg-gray-800 text-white pl-2 pr-3 h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Create Package
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <Input
                  type="text"
                  placeholder="Search packages"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 pr-3 h-8 text-xs"
                />
              </div>
            </div>
            
            <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">

              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2 w-10">
                      <Checkbox 
                        checked={selectedPackages.size === packages.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPackages(new Set(packages.map(p => p.id)));
                          } else {
                            setSelectedPackages(new Set());
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-2 pl-0 font-medium text-[11px] text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                      <span className="flex items-center gap-1">
                        Package Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </span>
                    </th>
                    <th className="text-left p-2 font-medium text-[11px] text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('type')}>
                      <span className="flex items-center gap-1">
                        Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </span>
                    </th>
                    <th className="text-right p-2 pr-3 font-medium text-[11px] text-gray-700 cursor-pointer hover:bg-gray-100 w-auto" onClick={() => handleSort('modified')}>
                      <span className="flex items-center justify-end gap-1 whitespace-nowrap">
                        Last Saved {sortField === 'modified' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </span>
                    </th>
                    <th className="text-right p-2 pr-3 font-medium text-[11px] text-gray-700 cursor-pointer hover:bg-gray-100 w-auto" onClick={() => handleSort('productCount')}>
                      <span className="flex items-center justify-end gap-1 whitespace-nowrap">
                        Products {sortField === 'productCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </span>
                    </th>
                    <th className="w-10 p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr 
                      key={pkg.id} 
                      className={`border-b hover:bg-gray-50 cursor-pointer relative group ${pkg.isNew ? 'animate-pulse bg-green-50' : ''}`}
                      onMouseEnter={() => {
                        setHoveredRow(pkg.id);
                      }}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => {
                        handleEditPackage(pkg);
                        if (pkg.isNew) {
                          setPackages(packages.map(p => p.id === pkg.id ? { ...p, isNew: false } : p));
                        }
                      }}
                      style={{
                        animation: pkg.isNew ? 'fadeIn 0.6s ease-out, pulse 2s ease-in-out' : undefined,
                        transition: 'background-color 0.3s ease-out'
                      }}
                    >
                      <td className="p-2">
                        <Checkbox 
                          checked={selectedPackages.has(pkg.id)}
                          onCheckedChange={(checked) => {
                            const newSelected = new Set(selectedPackages);
                            if (checked) {
                              newSelected.add(pkg.id);
                            } else {
                              newSelected.delete(pkg.id);
                            }
                            setSelectedPackages(newSelected);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="p-2 pl-0 relative">
                        {editingName === pkg.id ? (
                          <Input
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onBlur={() => handleSaveEdit(pkg.id)}
                            onKeyDown={(e) => handleKeyDown(e, pkg.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 px-2 text-[11px]"
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="hover:bg-gray-100 px-2 py-1 rounded cursor-text inline-block text-xs"
                            onClick={(e) => handleStartEdit(pkg, e)}
                            title="Click to edit"
                          >
                            {pkg.name}
                          </span>
                        )}
                        {pkg.isNew && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] bg-black text-white rounded-full">New</span>
                        )}
                      </td>
                      <td className="p-2 text-[11px] text-gray-600 capitalize">{pkg.type === 'deployment' ? 'Deploy' : 'Install'}</td>
                      <td className="p-2 pr-3 text-[11px] text-gray-600 text-right whitespace-nowrap">{pkg.modified}</td>
                      <td className="p-2 pr-3 text-[11px] text-gray-600 text-right">{pkg.productCount || 2}</td>
                      <td className="p-2 relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                        
                        {/* Hover menu overlapping kebab */}
                        <div className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-gray-200 rounded-md shadow-lg p-1 transition-all duration-200 z-50 ${
                          hoveredRow === pkg.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
                        }`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPackage(pkg);
                            }}
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicatePackage(pkg);
                            }}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Duplicate
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast({
                                title: "Deploy Package",
                                description: `Deploying ${pkg.name}...`,
                              });
                            }}
                          >
                            <Package className="w-3 h-3 mr-1" />
                            Deploy
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 px-2 text-xs bg-red-600 hover:bg-red-700 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePackage(pkg.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Multi-select action bar - moved outside table container to be positioned relative to browser chrome */}
          </TabsContent>

          <TabsContent value="team-library" className="mt-0">
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No packages in team library</p>
              <p className="text-sm mt-2">Share packages with your team to see them here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Creator View Component
  const CreatorView = () => {
    const { toast } = useToast();
    // Generate a comprehensive list of Autodesk products
    const generateProducts = () => {
      const productList = [
        { id: 'autocad', name: 'AutoCAD', initials: 'AC', category: 'Design' },
        { id: 'revit', name: 'Revit', initials: 'RV', category: 'Architecture' },
        { id: 'civil3d', name: 'Civil 3D', initials: 'C3D', category: 'Infrastructure' },
        { id: 'inventor', name: 'Inventor', initials: 'IV', category: 'Manufacturing' },
        { id: 'navisworks', name: 'Navisworks', initials: 'NW', category: 'Construction' },
        { id: 'fusion360', name: 'Fusion 360', initials: 'F360', category: 'Manufacturing' },
        { id: '3dsmax', name: '3ds Max', initials: '3DS', category: 'Media' },
        { id: 'maya', name: 'Maya', initials: 'MY', category: 'Media' },
        { id: 'autocadlt', name: 'AutoCAD LT', initials: 'ALT', category: 'Design' },
        { id: 'advance-steel', name: 'Advance Steel', initials: 'AS', category: 'Manufacturing' },
        { id: 'alias', name: 'Alias', initials: 'AL', category: 'Design' },
        { id: 'arnold', name: 'Arnold', initials: 'AR', category: 'Media' },
        { id: 'bim-collaborate', name: 'BIM Collaborate', initials: 'BC', category: 'Construction' },
        { id: 'cfd', name: 'CFD', initials: 'CFD', category: 'Simulation' },
        { id: 'flame', name: 'Flame', initials: 'FL', category: 'Media' },
        { id: 'formit', name: 'FormIt', initials: 'FI', category: 'Architecture' },
        { id: 'helius', name: 'Helius PFA', initials: 'HP', category: 'Simulation' },
        { id: 'infraworks', name: 'InfraWorks', initials: 'IW', category: 'Infrastructure' },
        { id: 'motionbuilder', name: 'MotionBuilder', initials: 'MB', category: 'Media' },
        { id: 'mudbox', name: 'Mudbox', initials: 'MX', category: 'Media' },
        { id: 'netfabb', name: 'Netfabb', initials: 'NF', category: 'Manufacturing' },
        { id: 'powerinspect', name: 'PowerInspect', initials: 'PI', category: 'Manufacturing' },
        { id: 'powermill', name: 'PowerMill', initials: 'PM', category: 'Manufacturing' },
        { id: 'powershape', name: 'PowerShape', initials: 'PS', category: 'Manufacturing' },
        { id: 'recap', name: 'ReCap', initials: 'RC', category: 'Reality Capture' },
        { id: 'robot', name: 'Robot Structural', initials: 'RS', category: 'Infrastructure' },
        { id: 'showcase', name: 'Showcase', initials: 'SC', category: 'Design' },
        { id: 'shotgrid', name: 'ShotGrid', initials: 'SG', category: 'Media' },
        { id: 'sketchbook', name: 'SketchBook', initials: 'SB', category: 'Design' },
        { id: 'stingray', name: 'Stingray', initials: 'SR', category: 'Media' },
        { id: 'structural-bridge', name: 'Structural Bridge', initials: 'SBD', category: 'Infrastructure' },
        { id: 'vault', name: 'Vault', initials: 'VT', category: 'Data Management' },
        { id: 'vred', name: 'VRED', initials: 'VR', category: 'Manufacturing' },
      ];
      
      return productList.map(p => ({
        ...p,
        versions: ['2024.3', '2024.2', '2024.1', '2023.3', '2023.2', '2023.1', '2022.3']
      }));
    };
    
    const products = generateProducts();

    const toggleApp = (appId) => {
      setSelectedApps(prev => {
        const newSelection = prev.includes(appId)
          ? prev.filter(id => id !== appId)
          : [...prev, appId];
        
        // Auto-select the app in the right pane when checked
        if (!prev.includes(appId)) {
          setSelectedAppForDetails(appId);
        }
        
        return newSelection;
      });
    };
    
    const handleAppClick = (appId) => {
      setSelectedAppForDetails(appId);
      // Initialize version settings if not exists
      if (!appVersionSettings[appId]) {
        setAppVersionSettings(prev => ({
          ...prev,
          [appId]: { type: 'latest', specificVersion: null }
        }));
      }
    };
    
    const handleSaveDownload = async (isDownload) => {
      if (isDownload) {
        setIsDownloading(true);
      } else {
        setIsSaving(true);
      }
      
      const buttonText = isDownload ? 'Downloading...' : 'Saving...';
      
      // Create package name
      const packageName = editingPackage ? editingPackage.name : `Custom Package ${new Date().toLocaleDateString()}`;
      
      if (isDownload) {
        toast({
          title: "Preparing Download",
          description: "Download ready",
          showSpinner: true,
        });
      }
      
      // Simulate save/download
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new package entry with configuration
      const newPackage = {
        id: `pkg-${Date.now()}`,
        name: packageName,
        installs: 0,
        type: deploymentSettings.type === 'deploy' ? 'deployment' : 'package',
        created: new Date().toLocaleDateString(),
        modified: new Date().toLocaleDateString(),
        status: 'active',
        isNew: true,
        productCount: selectedApps.length,
        configuration: {
          selectedApps: selectedApps,
          versionSettings: appVersionSettings,
          customizations: customizations,
          deploymentSettings: deploymentSettings
        }
      };
      
      // Add to packages if not editing
      if (!editingPackage) {
        // Return to library first
        handleBackToLibrary();
        
        // Add package with slight delay for animation
        setTimeout(() => {
          setPackages(prev => {
            const updated = [newPackage, ...prev];
            // Trigger re-render to show animation
            return updated;
          });
        }, 100);
      } else {
        // Update existing package
        setPackages(prev => prev.map(p => p.id === editingPackage.id ? { 
          ...p, 
          ...newPackage, 
          productCount: selectedApps.length, 
          modified: new Date().toLocaleDateString(),
          configuration: {
            selectedApps: selectedApps,
            versionSettings: appVersionSettings,
            customizations: customizations,
            deploymentSettings: deploymentSettings
          }
        } : p));
        handleBackToLibrary();
      }
      
      if (isDownload) {
        // Show download ready toast
        toast({
          title: "Download Ready",
          description: "Your deployment package has been compiled and downloaded.",
        });
        setIsDownloading(false);
      } else {
        setIsSaving(false);
      }
    };

    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-4">
            <span className="text-black hover:underline cursor-pointer" onClick={handleBackToLibrary}>Custom Install</span>
            <span className="mx-1 text-gray-400">/</span>
            <span className="text-gray-700">{editingPackage ? editingPackage.name : 'New Package'}</span>
          </div>
          <h1 className="text-2xl font-medium mb-1">{editingPackage ? editingPackage.name : 'New Package'}</h1>
        </div>

        <div className="grid grid-cols-2 gap-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Left Column - Steps */}
          <div className="space-y-4">
            <Accordion 
              type="single" 
              value={`step-${currentStep}`}
              onValueChange={(value) => {
                const step = parseInt(value.replace('step-', ''));
                if (!isNaN(step)) setCurrentStep(step);
              }}
              className="space-y-4"
            >
              {/* Step 1 - Select Applications */}
              <AccordionItem value="step-1" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                      </div>
                      <div>
                        <h3 className="font-medium">Select Applications</h3>
                        <p className="text-xs text-gray-600">Choose products and customize settings</p>
                      </div>
                    </div>
                    {currentStep === 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs -mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentStep(1);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="mt-2">
                    <div className="mb-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          placeholder="Search applications..."
                          className="pl-10 h-8 text-sm"
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        {products
                          .filter(app => !searchTerm || app.name.toLowerCase().includes(searchTerm.toLowerCase()))
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((app) => (
                          <div 
                            key={app.id}
                            className={`flex items-center gap-2 p-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                              selectedAppForDetails === app.id ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => handleAppClick(app.id)}
                          >
                            <Checkbox 
                              checked={selectedApps.includes(app.id)}
                              onCheckedChange={() => toggleApp(app.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-semibold ${
                              ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 
                               'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'][app.id.charCodeAt(0) % 5]
                            }`}>
                              {app.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs truncate">{app.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button 
                      className="bg-black hover:bg-gray-800 text-white h-8 px-3 text-sm"
                      onClick={() => setCurrentStep(2)}
                      disabled={selectedApps.length === 0}
                    >
                      <span className="font-medium">Configure package</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Step 2 - Deployment Settings */}
              <AccordionItem value="step-2" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                      </div>
                      <div>
                        <h3 className="font-medium">Deployment Settings</h3>
                        <p className="text-xs text-gray-600">Configure installation options</p>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Deployment Type</h4>
                      <div className="mb-4">
                        <div className="flex rounded-md shadow-sm w-full" role="group">
                          <button
                            type="button"
                            onClick={() => setDeploymentSettings({...deploymentSettings, type: 'install'})}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-l-md border ${
                              deploymentSettings.type === 'install'
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            Install
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeploymentSettings({...deploymentSettings, type: 'deploy'})}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-r-md border-t border-r border-b ${
                              deploymentSettings.type === 'deploy'
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            Deploy
                          </button>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-gray-50">
                        {deploymentSettings.type === 'install' ? (
                          <div className="border border-gray-300 rounded-md p-3 bg-white">
                            <p className="text-sm text-gray-600 mb-2">Users can run installer with customizations</p>
                            <ul className="text-xs text-gray-500 space-y-1 ml-4">
                              <li>• Interactive installation wizard</li>
                              <li>• User-selected components</li>
                              <li>• Local machine installation</li>
                            </ul>
                          </div>
                        ) : (
                          <div className="border border-gray-300 rounded-md p-3 bg-white">
                            <p className="text-sm text-gray-600 mb-2">Silent installation via SCCM/network</p>
                            <ul className="text-xs text-gray-500 space-y-1 ml-4">
                              <li>• Automated deployment</li>
                              <li>• No user interaction required</li>
                              <li>• Enterprise-wide rollout</li>
                            </ul>
                          </div>
                        )}
                        
                        {/* Conditional options based on deployment type */}
                        <div className="mt-4 space-y-4">
                        {deploymentSettings.type === 'install' ? (
                          <div>
                            <h5 className="font-medium text-sm mb-2">Installation Options</h5>
                            <div className="space-y-2">
                              <label className="flex items-center gap-3">
                                <Checkbox 
                                  checked={deploymentSettings.createShortcuts}
                                  onCheckedChange={(checked) => setDeploymentSettings({...deploymentSettings, createShortcuts: checked})}
                                />
                                <span className="text-xs">Create desktop shortcuts</span>
                              </label>
                              <label className="flex items-center gap-3">
                                <Checkbox 
                                  checked={deploymentSettings.addToStartMenu}
                                  onCheckedChange={(checked) => setDeploymentSettings({...deploymentSettings, addToStartMenu: checked})}
                                />
                                <span className="text-xs">Add to Start menu</span>
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h5 className="font-medium text-sm mb-2">Deployment Configuration</h5>
                            <div className="space-y-2">
                              <label className="flex items-center gap-3">
                                <Checkbox 
                                  checked={deploymentSettings.silentInstall || false}
                                  onCheckedChange={(checked) => setDeploymentSettings({...deploymentSettings, silentInstall: checked})}
                                />
                                <span className="text-xs">Silent installation</span>
                              </label>
                              <label className="flex items-center gap-3">
                                <Checkbox 
                                  checked={deploymentSettings.forceReboot || false}
                                  onCheckedChange={(checked) => setDeploymentSettings({...deploymentSettings, forceReboot: checked})}
                                />
                                <span className="text-xs">Force reboot after installation</span>
                              </label>
                            </div>
                          </div>
                        )}
                        
                        {deploymentSettings.type === 'install' ? (
                          <div>
                            <h5 className="font-medium text-sm mb-2">Default Install Location</h5>
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs text-gray-600">Install directory</label>
                                <Input 
                                  value={deploymentSettings.installLocation || 'C:\\Program Files\\Autodesk'}
                                  onChange={(e) => setDeploymentSettings({...deploymentSettings, installLocation: e.target.value})}
                                  className="mt-1 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h5 className="font-medium text-sm mb-2">Log Settings</h5>
                            <div className="space-y-3">
                              <div>
                              <label className="text-xs text-gray-600">Log file location</label>
                              <Input 
                                value={deploymentSettings.logLocation}
                                onChange={(e) => setDeploymentSettings({...deploymentSettings, logLocation: e.target.value})}
                                className="mt-1 h-8 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">Network share path</label>
                              <Input 
                                value={deploymentSettings.networkPath}
                                onChange={(e) => setDeploymentSettings({...deploymentSettings, networkPath: e.target.value})}
                                placeholder="\\\\server\\deployments"
                                className="mt-1 h-8 text-xs"
                              />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6 justify-end">
                    <Button 
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSaveDownload(false);
                      }}
                      disabled={isDownloading || isSaving}
                      className="h-8 px-3 text-sm"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-3 h-3 mr-1.5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>Save</>
                      )}
                    </Button>
                    <Button 
                      className="bg-black hover:bg-gray-800 text-white h-8 px-3 text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSaveDownload(true);
                      }}
                      disabled={isDownloading || isSaving}
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-3 h-3 mr-1.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>Download</>
                      )}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Right Column - Details/Summary */}
          <div className="sticky top-4 h-fit">
            {currentStep === 1 ? (
              /* Product Details */
              <div className={`${selectedAppForDetails === null ? 'bg-gray-50' : 'bg-white'} border border-gray-200 rounded-xl shadow-sm p-4`}>
                {selectedAppForDetails === null ? (
                  <div className="text-center py-8">
                    <Package className="w-6 h-6 text-gray-300 mx-auto mb-3" />
                    <p className="text-xs text-gray-400">Click on an application to view details</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center text-xs font-semibold ${
                          ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 
                           'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'][selectedAppForDetails?.charCodeAt(0) % 5]
                        }`}>
                          {products.find(p => p.id === selectedAppForDetails)?.initials}
                        </div>
                        <h3 className="font-medium text-base">{products.find(p => p.id === selectedAppForDetails)?.name}</h3>
                      </div>
                      <Select defaultValue="en">
                        <SelectTrigger className="w-24 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="py-2 border-b">
                        <span className="text-xs text-gray-600 block mb-2">Version to install:</span>
                        <div className="space-y-2">
                          <label className={`flex items-center gap-2 p-2 rounded ${appVersionSettings[selectedAppForDetails]?.type === 'latest' ? 'bg-blue-50 border border-blue-200' : ''}`}>
                            <input
                              type="radio"
                              name={`version-${selectedAppForDetails}`}
                              checked={appVersionSettings[selectedAppForDetails]?.type === 'latest'}
                              onChange={() => {
                                setAppVersionSettings(prev => ({
                                  ...prev,
                                  [selectedAppForDetails]: { type: 'latest', specificVersion: null }
                                }));
                                // Auto-add if not already selected
                                if (!selectedApps.includes(selectedAppForDetails)) {
                                  setSelectedApps(prev => [...prev, selectedAppForDetails]);
                                }
                              }}
                            />
                            <span className="text-xs">Latest version</span>
                            <span className="text-xs text-gray-500 ml-auto">2024.3</span>
                          </label>
                          <label className={`flex items-center gap-2 p-2 rounded ${appVersionSettings[selectedAppForDetails]?.type === 'specific' ? 'bg-blue-50 border border-blue-200' : ''}`}>
                            <input
                              type="radio"
                              name={`version-${selectedAppForDetails}`}
                              checked={appVersionSettings[selectedAppForDetails]?.type === 'specific'}
                              onChange={() => {
                                setAppVersionSettings(prev => ({
                                  ...prev,
                                  [selectedAppForDetails]: { type: 'specific', specificVersion: products.find(p => p.id === selectedAppForDetails)?.versions[0] }
                                }));
                                // Auto-add if not already selected
                                if (!selectedApps.includes(selectedAppForDetails)) {
                                  setSelectedApps(prev => [...prev, selectedAppForDetails]);
                                }
                              }}
                            />
                            <div className="flex items-center justify-between flex-1">
                              <span className="text-xs">Specific version...</span>
                              {appVersionSettings[selectedAppForDetails]?.type === 'specific' && (
                                <Select
                                  value={appVersionSettings[selectedAppForDetails]?.specificVersion}
                                  onValueChange={(value) => setAppVersionSettings(prev => ({
                                    ...prev,
                                    [selectedAppForDetails]: { ...prev[selectedAppForDetails], specificVersion: value }
                                  }))}
                                >
                                  <SelectTrigger className="w-auto min-w-[100px] h-7 text-xs">
                                    <SelectValue placeholder="Select version" />
                                  </SelectTrigger>
                                <SelectContent>
                                <div className="px-2 py-1 text-xs text-gray-500 font-medium">2024 Releases</div>
                                <SelectItem value="2024.3">2024.3</SelectItem>
                                <SelectItem value="2024.2">2024.2</SelectItem>
                                <SelectItem value="2024.1">2024.1</SelectItem>
                                <div className="px-2 py-1 text-xs text-gray-500 font-medium">2023 Releases</div>
                                <SelectItem value="2023.3">2023.3</SelectItem>
                                <SelectItem value="2023.2">2023.2</SelectItem>
                                <SelectItem value="2023.1">2023.1</SelectItem>
                                <div className="px-2 py-1 text-xs text-gray-500 font-medium">2022 Releases</div>
                                <SelectItem value="2022.3">2022.3</SelectItem>
                              </SelectContent>
                                  </Select>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        License managed by Autodesk ID. Users must sign in to access this product.
                      </div>
                      
                      {/* Licensing customization */}
                      <div className="mt-3">
                        <label className="flex items-center gap-2">
                          <Checkbox 
                            checked={customizations[selectedAppForDetails]?.customLicensing || false}
                            onCheckedChange={(checked) => setCustomizations(prev => ({
                              ...prev,
                              [selectedAppForDetails]: { ...prev[selectedAppForDetails], customLicensing: checked }
                            }))}
                          />
                          <span className="text-xs font-medium">Customize licensing</span>
                        </label>
                        {customizations[selectedAppForDetails]?.customLicensing && (
                          <div className="mt-3 flex gap-3">
                            <div className="flex-1">
                              <label className="text-xs text-gray-600 block mb-1">Serial Number</label>
                              <Input 
                                className="h-7 text-xs"
                                placeholder="XXX-XXXXXXXX"
                                value={customizations[selectedAppForDetails]?.serialNumber || ''}
                                onChange={(e) => setCustomizations(prev => ({
                                  ...prev,
                                  [selectedAppForDetails]: { ...prev[selectedAppForDetails], serialNumber: e.target.value }
                                }))}
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-gray-600 block mb-1">Product Key</label>
                              <Input 
                                className="h-7 text-xs"
                                placeholder="XXXXX"
                                value={customizations[selectedAppForDetails]?.productKey || ''}
                                onChange={(e) => setCustomizations(prev => ({
                                  ...prev,
                                  [selectedAppForDetails]: { ...prev[selectedAppForDetails], productKey: e.target.value }
                                }))}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {(() => {
                      // Generate random accordions for each product
                      const allAccordions = [
                        {
                          id: 'customizations',
                          title: 'Customizations',
                          content: (
                            <div className="space-y-3">
                              <label className="flex items-center gap-2 text-sm">
                                <Checkbox defaultChecked />
                                <span>Install {products.find(p => p.id === selectedAppForDetails)?.name} Microsoft Office/Outlook Add-ins</span>
                              </label>
                              <div className="ml-6 space-y-2">
                                <div className="text-xs text-gray-600 mb-2">Create Desktop Shortcuts</div>
                                <label className="flex items-center gap-2 text-sm">
                                  <Checkbox defaultChecked />
                                  <span>{products.find(p => p.id === selectedAppForDetails)?.name} Basic Client</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <Checkbox />
                                  <span>{products.find(p => p.id === selectedAppForDetails)?.name} Project Manager</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <Checkbox />
                                  <span>{products.find(p => p.id === selectedAppForDetails)?.name} Content Browser</span>
                                </label>
                              </div>
                              <hr className="my-3" />
                              <div className="space-y-2">
                                <div className="text-xs text-gray-600 mb-2">Installation Preferences</div>
                                <label className="flex items-center gap-2 text-sm">
                                  <Checkbox />
                                  <span>Create file associations</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <Checkbox defaultChecked />
                                  <span>Install templates and samples</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <Checkbox />
                                  <span>Enable automatic updates</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <Checkbox />
                                  <span>Install offline help documentation</span>
                                </label>
                              </div>
                              <hr className="my-3" />
                              <div className="space-y-2">
                                <div className="text-xs text-gray-600 mb-2">Performance Settings</div>
                                <label className="flex items-center gap-2 text-sm">
                                  <Checkbox />
                                  <span>Enable hardware acceleration</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <Checkbox defaultChecked />
                                  <span>Use multi-threaded processing</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <Checkbox />
                                  <span>Cache cloud content locally</span>
                                </label>
                              </div>
                            </div>
                          )
                        },
                        {
                          id: 'plugins',
                          title: 'Plug-ins',
                          content: (
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <Checkbox />
                                <div>
                                  <div className="text-sm">Autodesk FBX Plug-in</div>
                                  <div className="text-xs text-gray-500 leading-relaxed max-w-sm">Enables import and export of FBX files for 3D animation and modeling workflows with industry-standard compatibility</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox />
                                <div>
                                  <div className="text-sm">Autodesk Material Library</div>
                                  <div className="text-xs text-gray-500 leading-relaxed max-w-sm">Access to thousands of physically accurate materials for realistic rendering and visualization projects</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox />
                                <div>
                                  <div className="text-sm">Advanced Rendering Engine</div>
                                  <div className="text-xs text-gray-500 leading-relaxed max-w-sm">High-performance ray tracing renderer with global illumination and photorealistic output capabilities</div>
                                </div>
                              </div>
                            </div>
                          )
                        },
                        {
                          id: 'extensions',
                          title: 'Extensions',
                          content: (
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <Checkbox />
                                <div>
                                  <div className="text-sm">Substance Extension</div>
                                  <div className="text-xs text-gray-500 leading-relaxed max-w-sm">Advanced material creation and texturing tools with procedural generation capabilities</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox />
                                <div>
                                  <div className="text-sm">Civil View Extension</div>
                                  <div className="text-xs text-gray-500 leading-relaxed max-w-sm">Specialized tools for civil engineering visualization and infrastructure project planning</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox />
                                <div>
                                  <div className="text-sm">BIM 360 Connector</div>
                                  <div className="text-xs text-gray-500 leading-relaxed max-w-sm">Cloud-based collaboration platform integration for construction document management</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox />
                                <div>
                                  <div className="text-sm">Structural Analysis Toolkit</div>
                                  <div className="text-xs text-gray-500 leading-relaxed max-w-sm">Advanced finite element analysis tools for structural engineering calculations</div>
                                </div>
                              </div>
                            </div>
                          )
                        },
                        {
                          id: 'languages',
                          title: 'Language packs',
                          content: (
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm">
                                <Checkbox />
                                <span>Chinese-Simplified Language Pack for {products.find(p => p.id === selectedAppForDetails)?.name} 2026</span>
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <Checkbox />
                                <span>French Language Pack for {products.find(p => p.id === selectedAppForDetails)?.name} 2026</span>
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <Checkbox />
                                <span>German Language Pack for {products.find(p => p.id === selectedAppForDetails)?.name} 2026</span>
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <Checkbox />
                                <span>Spanish Language Pack for {products.find(p => p.id === selectedAppForDetails)?.name} 2026</span>
                              </label>
                            </div>
                          )
                        },
                        {
                          id: 'integrations',
                          title: 'Integrations',
                          content: (
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <Checkbox />
                                <div>
                                  <div className="text-sm">Microsoft Office Integration</div>
                                  <div className="text-xs text-gray-500 leading-relaxed max-w-sm">Seamlessly embed and edit {products.find(p => p.id === selectedAppForDetails)?.name} content within Office applications</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox />
                                <div>
                                  <div className="text-sm">Cloud Collaboration Tools</div>
                                  <div className="text-xs text-gray-500 leading-relaxed max-w-sm">Real-time collaboration features with automatic syncing and version control for team projects</div>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      ];
                      
                      // Randomize which accordions to show (always include customizations first)
                      const hash = selectedAppForDetails?.charCodeAt(0) || 0;
                      const numAccordions = 2 + (hash % 3); // 2-4 accordions
                      const selectedAccordions = [allAccordions[0]]; // Always include customizations first
                      
                      // Add random selection of other accordions
                      const otherAccordions = allAccordions.slice(1);
                      const shuffled = [...otherAccordions].sort(() => (hash % 7) - 3.5);
                      
                      for (let i = 0; i < Math.min(numAccordions - 1, shuffled.length); i++) {
                        selectedAccordions.push(shuffled[i]);
                      }
                      
                      return (
                        <Accordion type="single" collapsible className="space-y-2">
                          {selectedAccordions.map((accordion) => (
                            <AccordionItem key={accordion.id} value={accordion.id} className="border rounded-lg">
                              <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                                {accordion.title}
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-3">
                                {accordion.content}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : (
              /* Step 2 - Deployment Summary */
              <div className="space-y-4">
                {/* Package Summary */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                  <h3 className="font-medium text-lg mb-4">Package Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    {selectedApps.map(appId => {
                      const app = products.find(p => p.id === appId);
                      return (
                        <div key={appId} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-semibold ${
                                ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 
                                 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'][appId.charCodeAt(0) % 5]
                              }`}>
                                {app?.initials}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{app?.name}</div>
                                <div className="text-xs text-gray-600">
                                  {((appId.charCodeAt(0) + appId.charCodeAt(1)) % 4) + 1} customizations, {(appId.charCodeAt(0) % 3) + 1} extensions
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs text-gray-500 hover:text-gray-700"
                              onClick={() => {
                                setShowDetailsModal(appId);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="space-y-3 pt-6 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Size:</span>
                      <span className="font-medium">4.2 GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Install Time:</span>
                      <span className="font-medium">~45 min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Applications:</span>
                      <span className="font-medium">{selectedApps.length}</span>
                    </div>
                  </div>
                </div>
                
                {/* Deployment Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-sm">Deployment Summary</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{deploymentSettings.type === 'install' ? 'Install' : 'Deploy'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-medium">{deploymentSettings.type === 'install' ? 'End Users' : 'IT Admins'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium">{deploymentSettings.type === 'install' ? 'Interactive' : 'Silent'}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="text-[11px] text-gray-500">
                      {deploymentSettings.type === 'install' ? 
                        'Package will include installer wizard for end-user installation' : 
                        'Package optimized for enterprise deployment tools (SCCM, etc.)'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Details Modal */}
        {showDetailsModal && (
          <div className="absolute inset-0 z-50" onClick={() => setShowDetailsModal(null)}>
            <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-2xl border-l border-gray-200 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start p-6 border-b">
                <div>
                  <h3 className="text-lg font-medium">Package Configuration Details</h3>
                  <p className="text-sm text-gray-500 mt-1">Complete summary of selected products and settings</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {selectedApps.map(appId => {
                    const app = products.find(p => p.id === appId);
                    const version = appVersionSettings[appId];
                    const customization = customizations[appId];
                    
                    return (
                      <div key={appId} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-semibold ${
                            ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 
                             'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'][appId.charCodeAt(0) % 5]
                          }`}>
                            {app?.initials}
                          </div>
                          <h4 className="font-medium">{app?.name}</h4>
                          <span className="ml-auto text-sm text-gray-500">
                            {version?.type === 'latest' ? 'Latest (2024.3)' : version?.specificVersion || '2024.3'}
                          </span>
                        </div>
                        
                        <div className="p-4 space-y-4">
                          {/* Version and Licensing */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Version Type:</span>
                              <p className="font-medium">{version?.type === 'latest' ? 'Always Latest' : 'Specific Version'}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Language:</span>
                              <p className="font-medium">English</p>
                            </div>
                          </div>
                          
                          {customization?.customLicensing && (
                            <div className="bg-blue-50 rounded-md p-3">
                              <div className="text-sm font-medium text-blue-900 mb-1">Custom Licensing Configured</div>
                              <div className="text-xs text-blue-700 space-y-1">
                                {customization.serialNumber && (
                                  <div>Serial Number: {customization.serialNumber}</div>
                                )}
                                {customization.productKey && (
                                  <div>Product Key: {customization.productKey}</div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Customizations Summary */}
                          <div>
                            <h5 className="text-sm font-medium mb-2">Selected Customizations</h5>
                            <div className="bg-gray-50 rounded-md p-3">
                              <ul className="text-xs text-gray-600 space-y-1">
                                <li className="flex items-center gap-2">
                                  <Check className="w-3 h-3 text-green-600" />
                                  Microsoft Office/Outlook Add-ins
                                </li>
                                <li className="flex items-center gap-2">
                                  <Check className="w-3 h-3 text-green-600" />
                                  Desktop shortcuts created
                                </li>
                                <li className="flex items-center gap-2">
                                  <Check className="w-3 h-3 text-green-600" />
                                  Templates and samples included
                                </li>
                                <li className="flex items-center gap-2">
                                  <Check className="w-3 h-3 text-green-600" />
                                  Multi-threaded processing enabled
                                </li>
                              </ul>
                            </div>
                          </div>
                          
                          {/* Plug-ins and Extensions */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium mb-2">Plug-ins (3)</h5>
                              <ul className="text-xs text-gray-600 space-y-1">
                                <li>• FBX Plug-in</li>
                                <li>• Material Library</li>
                                <li>• Rendering Engine</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-2">Extensions (2)</h5>
                              <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Substance Extension</li>
                                <li>• BIM 360 Connector</li>
                              </ul>
                            </div>
                          </div>
                          
                          {/* Technical Details */}
                          <div className="border-t pt-3">
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="text-gray-500">Install Size:</span>
                                <p className="font-medium text-gray-700">{(1.2 + Math.random() * 2).toFixed(1)} GB</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Install Time:</span>
                                <p className="font-medium text-gray-700">~{15 + Math.floor(Math.random() * 10)} min</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Components:</span>
                                <p className="font-medium text-gray-700">{8 + Math.floor(Math.random() * 5)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Overall Package Summary */}
                <div className="mt-6 border-t pt-6">
                  <h4 className="font-medium mb-3">Package Summary</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Applications:</span>
                        <span className="font-medium">{selectedApps.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Install Size:</span>
                        <span className="font-medium">{(selectedApps.length * 1.5).toFixed(1)} GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Estimated Install Time:</span>
                        <span className="font-medium">~{selectedApps.length * 15} minutes</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Deployment Type:</span>
                        <span className="font-medium">{deploymentSettings.type === 'install' ? 'Install' : 'Deploy'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Target Audience:</span>
                        <span className="font-medium">{deploymentSettings.type === 'install' ? 'End Users' : 'IT Administrators'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Installation Method:</span>
                        <span className="font-medium">{deploymentSettings.type === 'install' ? 'Interactive Wizard' : 'Silent/Automated'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex justify-end gap-3 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Copy configuration to clipboard
                    toast({
                      title: "Configuration Copied",
                      description: "Package configuration has been copied to clipboard",
                    });
                  }}
                  className="text-sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Configuration
                </Button>
                <Button
                  onClick={() => setShowDetailsModal(null)}
                  className="bg-black hover:bg-gray-800 text-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };


  // Listen for zoom messages from parent window
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'setDemoZoom') {
        setZoom(event.data.zoom);
        // Also update parent's zoom manager if available
        if (window.parent && window.parent.demoZoomManager) {
          window.parent.demoZoomManager.setZoom('custom-install-demo', event.data.zoom * 100);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  // Apply zoom as root font size change for proper browser-style zoom
  useEffect(() => {
    // Default browser font size is 16px, so we scale from there
    const rootFontSize = 16 * zoom;
    document.documentElement.style.fontSize = `${rootFontSize}px`;
    
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [zoom]);

  return (
    <ToastProvider>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
      <DemoWrapper 
        url="manage.autodesk.com/products/deployments"
        browserTheme="mac"
        showBackground={true}
      >
        <div className="h-full bg-background flex flex-col overflow-hidden font-[Inter] relative"
          style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
        >
          {/* Simple header */}
          <header className="bg-foreground text-background flex-shrink-0">
            <div className="h-14 flex items-center px-6 border-b border-gray-800">
              <h1 className="text-sm font-medium tracking-wide">AUTODESK ACCOUNT</h1>
            </div>
          </header>

          {/* Main content */}
          <div className="flex-1 overflow-auto p-6">
            {currentView === 'library' ? (
              <LibraryView />
            ) : (
              <CreatorView />
            )}
          </div>
          
          {/* Multi-select action bar - positioned at bottom of browser chrome */}
          {selectedPackages.size > 0 && currentView === 'library' && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg p-2 z-50">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600">
                    {selectedPackages.size} package{selectedPackages.size > 1 ? 's' : ''} selected
                  </span>
                  <button 
                    onClick={() => setSelectedPackages(new Set())}
                    className="text-xs text-black hover:text-gray-700"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      const selectedPkgs = packages.filter(p => selectedPackages.has(p.id));
                      const duplicatedPkgs = selectedPkgs.map((pkg, idx) => ({
                        ...pkg,
                        id: `${pkg.id}-${Date.now()}-${idx}`,
                        name: `${pkg.name} (Copy)`,
                        isNew: true,
                        modified: new Date().toLocaleDateString(),
                        productCount: pkg.productCount
                      }));
                      setPackages([...duplicatedPkgs, ...packages]);
                      setSelectedPackages(new Set());
                      toast({
                        title: "Packages Duplicated",
                        description: `${selectedPkgs.length} package${selectedPkgs.length > 1 ? 's' : ''} duplicated successfully.`,
                      });
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Duplicate
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      const deployCount = selectedPackages.size;
                      setSelectedPackages(new Set());
                      toast({
                        title: "Deploy Packages",
                        description: `Deploying ${deployCount} package${deployCount > 1 ? 's' : ''}...`,
                      });
                    }}
                  >
                    <Package className="w-3 h-3 mr-1" />
                    Deploy
                  </Button>
                  <Button 
                    size="sm"
                    className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      const deleteCount = selectedPackages.size;
                      setSelectedPackages(new Set());
                      setPackages(packages.filter(p => !selectedPackages.has(p.id)));
                      toast({
                        title: "Packages Deleted",
                        description: `${deleteCount} package${deleteCount > 1 ? 's' : ''} deleted.`,
                      });
                    }}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Toaster positioned in top-right */}
          <Toaster />
        </div>
      </DemoWrapper>
    </ToastProvider>
  );
}

export default App;