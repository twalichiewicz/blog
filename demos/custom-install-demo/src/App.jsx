import React, { useState, useRef, useEffect } from 'react';
import DemoWrapper from '../../shared/components/DemoWrapper.jsx';
import '../../shared/components/demo-wrapper.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Checkbox } from './components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
import { Search, Plus, MoreHorizontal, ChevronDown, ChevronRight, X, Package, Settings, Download, Save, Check, Trash2, Copy, Edit3 } from 'lucide-react';
import { ToastProvider } from './components/ui/toast';
import { useToast } from './components/use-toast';
import { Toaster } from './components/Toaster';

function App() {
  const [currentView, setCurrentView] = useState('library'); // 'library' or 'creator'
  const [currentStep, setCurrentStep] = useState(1);
  const [zoom, setZoom] = useState(1);
  const demoRef = useRef(null);
  
  // Generate more realistic random data
  const generateRandomPackages = () => {
    const deploymentNames = [
      'Engineering Workstation 2024',
      'CAD Designer Bundle - Q4',
      'BIM Team Standard Config',
      'Remote Worker Package v3',
      'Intern Setup - Summer 2024',
      'Architecture Studio Suite',
      'MEP Contractor Tools',
      'Visualization Workstation Pro',
      'Field Engineer Mobile Kit',
      'Project Manager Essentials'
    ];
    
    return Array(3).fill(null).map((_, i) => {
      const installs = Math.floor(Math.random() * 450) + 50;
      const isNew = i === 2; // Make the last one "new"
      
      return {
        id: `pkg-${Date.now()}-${i}`,
        name: deploymentNames[i],
        installs: installs,
        created: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        modified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        isNew: isNew
      };
    });
  };
  
  const [packages, setPackages] = useState(generateRandomPackages());
  const [editingPackage, setEditingPackage] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState(new Set());
  const [selectedApps, setSelectedApps] = useState([]);
  const [selectedAppDetails, setSelectedAppDetails] = useState(null);
  const [customizations, setCustomizations] = useState({});
  const [deploymentSettings, setDeploymentSettings] = useState({
    type: 'install',
    createShortcuts: true,
    addToStartMenu: true,
    createRestorePoint: false,
    logLocation: '%TEMP%\\Autodesk\\Install.log',
    networkPath: ''
  });

  const handleCreateNew = () => {
    setEditingPackage(null);
    setCurrentStep(1);
    setSelectedApps([]);
    setCustomizations({});
    setCurrentView('creator');
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setCurrentStep(1);
    setCurrentView('creator');
  };

  const handleSavePackage = (newPackage) => {
    if (editingPackage) {
      setPackages(packages.map(p => p.id === editingPackage.id ? { ...p, ...newPackage } : p));
    } else {
      setPackages([...packages, { ...newPackage, id: Date.now().toString() }]);
    }
    setCurrentView('library');
    setCurrentStep(1);
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setCurrentStep(1);
  };

  const handleDuplicatePackage = (pkg) => {
    const newPackage = {
      ...pkg,
      id: `pkg-${Date.now()}-copy`,
      name: `${pkg.name} (Copy)`,
      modified: new Date().toLocaleDateString(),
      isNew: true
    };
    setPackages([...packages, newPackage]);
  };

  const handleDeletePackage = (id) => {
    setPackages(packages.filter(p => p.id !== id));
    // Also remove from selected packages
    const newSelected = new Set(selectedPackages);
    newSelected.delete(id);
    setSelectedPackages(newSelected);
  };
  
  const handleDeleteSelected = () => {
    setPackages(packages.filter(p => !selectedPackages.has(p.id)));
    setSelectedPackages(new Set());
  };
  
  const handleDuplicateSelected = () => {
    const newPackages = [];
    packages.forEach(pkg => {
      if (selectedPackages.has(pkg.id)) {
        newPackages.push({
          ...pkg,
          id: `pkg-${Date.now()}-${pkg.id}`,
          name: `${pkg.name} (Copy)`,
          modified: new Date().toLocaleDateString(),
          isNew: true
        });
      }
    });
    setPackages([...packages, ...newPackages]);
    setSelectedPackages(new Set());
  };

  const handleRenamePackage = (id, newName) => {
    setPackages(packages.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  // Library View Component
  const LibraryView = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('my-library');
    const [editingName, setEditingName] = useState(null);
    const [tempName, setTempName] = useState('');
    const [hoveredRow, setHoveredRow] = useState(null);
    
    const filteredPackages = packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
          <div className="border-b mb-6">
            <div className="flex -mb-px">
              <button
                onClick={() => setActiveTab('my-library')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === 'my-library'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                My Library
              </button>
              <button
                onClick={() => setActiveTab('team-library')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === 'team-library'
                    ? 'border-blue-600 text-blue-600'
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
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Package
              </Button>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search packages"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 w-12">
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
                    <th className="text-left p-4 font-medium text-sm text-gray-700">Package Name</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-700">Installs</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-700">Created</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-700">Modified</th>
                    <th className="w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr 
                      key={pkg.id} 
                      className="border-b hover:bg-gray-50 cursor-pointer relative group"
                      onMouseEnter={() => {
                        setHoveredRow(pkg.id);
                        // Remove "new" status on hover
                        if (pkg.isNew) {
                          setPackages(packages.map(p => p.id === pkg.id ? { ...p, isNew: false } : p));
                        }
                      }}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={(e) => {
                        // Only navigate to edit if not clicking on other interactive elements
                        if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('a')) {
                          handleEditPackage(pkg);
                        }
                      }}
                    >
                      <td className="p-4">
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
                      <td className="p-4 relative">
                        <div className="flex items-center gap-2">
                          {editingName === pkg.id ? (
                            <Input
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              onBlur={() => handleSaveEdit(pkg.id)}
                              onKeyDown={(e) => handleKeyDown(e, pkg.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-8 px-2"
                              autoFocus
                            />
                          ) : (
                            <>
                              <span 
                                className="hover:bg-gray-100 px-2 py-1 rounded cursor-text inline-block"
                                onClick={(e) => handleStartEdit(pkg, e)}
                                title="Click to edit"
                              >
                                {pkg.name}
                              </span>
                              {pkg.isNew && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                  NEW
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{pkg.installs}</td>
                      <td className="p-4 text-gray-600">{pkg.created}</td>
                      <td className="p-4 text-gray-600">{pkg.modified}</td>
                      <td className="p-4 relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                        
                        {/* Hover menu that expands from right to left */}
                        <div className={`absolute right-0 top-full mt-1 flex items-center gap-1 bg-white border border-gray-200 rounded-md shadow-lg p-1 transition-all duration-200 z-50 ${
                          hoveredRow === pkg.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
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
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-red-600 hover:text-red-700"
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
            
            {/* Multi-select action bar */}
            {selectedPackages.size > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg p-4 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {selectedPackages.size} package{selectedPackages.size > 1 ? 's' : ''} selected
                    </span>
                    <button 
                      onClick={() => setSelectedPackages(new Set())}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Clear selection
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleDuplicateSelected();
                        toast({
                          title: "Packages Duplicated",
                          description: `Successfully duplicated ${selectedPackages.size} packages`,
                        });
                      }}
                    >
                      Duplicate
                    </Button>
                    <Button 
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        const count = selectedPackages.size;
                        handleDeleteSelected();
                        toast({
                          title: "Packages Deleted",
                          description: `Successfully deleted ${count} packages`,
                        });
                      }}
                    >
                      Delete
                    </Button>
                    <Button 
                      className="bg-black hover:bg-gray-800 text-white"
                      onClick={() => {
                        toast({
                          title: "Deploy Packages",
                          description: `Deploying ${selectedPackages.size} packages...`,
                        });
                      }}
                    >
                      Deploy
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
    // Extended list of Autodesk products
    const products = [
      { id: 'autocad', name: 'AutoCAD 2024', shortName: 'AC' },
      { id: 'revit', name: 'Revit 2024', shortName: 'RV' },
      { id: 'civil3d', name: 'Civil 3D 2024', shortName: 'C3D' },
      { id: 'inventor', name: 'Inventor 2024', shortName: 'INV' },
      { id: 'navisworks', name: 'Navisworks 2024', shortName: 'NW' },
      { id: 'fusion360', name: 'Fusion 360', shortName: 'F360' },
      { id: '3dsmax', name: '3ds Max 2024', shortName: '3DS' },
      { id: 'maya', name: 'Maya 2024', shortName: 'MY' },
      { id: 'infraworks', name: 'InfraWorks 2024', shortName: 'IW' },
      { id: 'recap', name: 'ReCap Pro 2024', shortName: 'RC' },
      { id: 'robot', name: 'Robot Structural 2024', shortName: 'RSA' },
      { id: 'advance-steel', name: 'Advance Steel 2024', shortName: 'AS' },
      { id: 'fabrication', name: 'Fabrication CADmep 2024', shortName: 'FAB' },
      { id: 'vault', name: 'Vault Professional 2024', shortName: 'VLT' },
      { id: 'bim360', name: 'BIM 360', shortName: 'B360' },
      { id: 'plant3d', name: 'AutoCAD Plant 3D 2024', shortName: 'P3D' },
      { id: 'alias', name: 'Alias AutoStudio 2024', shortName: 'ALS' },
      { id: 'vred', name: 'VRED Professional 2024', shortName: 'VRD' },
      { id: 'flame', name: 'Flame 2024', shortName: 'FLM' },
      { id: 'mudbox', name: 'Mudbox 2024', shortName: 'MB' },
      { id: 'arnold', name: 'Arnold', shortName: 'ARN' },
      { id: 'motionbuilder', name: 'MotionBuilder 2024', shortName: 'MBD' },
      { id: 'autocad-mep', name: 'AutoCAD MEP 2024', shortName: 'MEP' },
      { id: 'autocad-electrical', name: 'AutoCAD Electrical 2024', shortName: 'ACE' },
      { id: 'autocad-map3d', name: 'AutoCAD Map 3D 2024', shortName: 'M3D' }
    ];

    const toggleApp = (appId) => {
      setSelectedApps(prev =>
        prev.includes(appId)
          ? prev.filter(id => id !== appId)
          : [...prev, appId]
      );
    };
    
    const handleSaveDownload = async (isDownload) => {
      const buttonText = isDownload ? 'Downloading...' : 'Saving...';
      
      toast({
        title: isDownload ? "Preparing Download" : "Saving Package",
        description: buttonText,
      });
      
      // Simulate save/download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isDownload) {
        // Show walkthrough modal
        toast({
          title: "Download Ready",
          description: "Your deployment package has been compiled. In a real scenario, the installer would download now.",
        });
      }
      
      // Return to library
      handleBackToLibrary();
    };

    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={handleBackToLibrary} 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Library
          </button>
          <h2 className="text-2xl font-light">Create Deployment Package</h2>
        </div>

        <div className="grid grid-cols-[1fr,400px] gap-6">
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
              <AccordionItem value="step-1" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                    </div>
                    <div>
                      <h3 className="font-medium">Select Applications</h3>
                      <p className="text-sm text-gray-600">Choose products and customize settings</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      {products.map((app) => (
                        <div 
                          key={app.id}
                          className={`flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer transition-all ${
                            selectedAppDetails?.id === app.id 
                              ? 'bg-blue-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedAppDetails(app)}
                        >
                          <div className={`w-10 h-10 rounded flex items-center justify-center text-xs font-bold ${
                            selectedApps.includes(app.id) 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {app.shortName}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{app.name}</div>
                          </div>
                          <Checkbox 
                            checked={selectedApps.includes(app.id)}
                            onCheckedChange={() => toggleApp(app.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button 
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setCurrentStep(2)}
                    disabled={selectedApps.length === 0}
                  >
                    Next: Configure Deployment →
                  </Button>
                </AccordionContent>
              </AccordionItem>
              
              {/* Step 2 - Deployment Settings */}
              <AccordionItem value="step-2" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                    </div>
                    <div>
                      <h3 className="font-medium">Deployment Settings</h3>
                      <p className="text-sm text-gray-600">Configure installation options</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 mt-4">
                    <div>
                      <h4 className="font-medium mb-3">Deployment Type</h4>
                      <div className="space-y-2">
                        <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input 
                            type="radio" 
                            name="deploy-type" 
                            value="install"
                            checked={deploymentSettings.type === 'install'}
                            onChange={(e) => setDeploymentSettings({...deploymentSettings, type: e.target.value})}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium">User Install</div>
                            <div className="text-sm text-gray-600">Users can run installer with customizations</div>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input 
                            type="radio" 
                            name="deploy-type" 
                            value="deploy"
                            checked={deploymentSettings.type === 'deploy'}
                            onChange={(e) => setDeploymentSettings({...deploymentSettings, type: e.target.value})}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium">Admin Deployment</div>
                            <div className="text-sm text-gray-600">Silent installation via SCCM/network</div>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Installation Options</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3">
                          <Checkbox 
                            checked={deploymentSettings.createShortcuts}
                            onCheckedChange={(checked) => setDeploymentSettings({...deploymentSettings, createShortcuts: checked})}
                          />
                          <span>Create desktop shortcuts</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <Checkbox 
                            checked={deploymentSettings.addToStartMenu}
                            onCheckedChange={(checked) => setDeploymentSettings({...deploymentSettings, addToStartMenu: checked})}
                          />
                          <span>Add to Start menu</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <Checkbox 
                            checked={deploymentSettings.createRestorePoint}
                            onCheckedChange={(checked) => setDeploymentSettings({...deploymentSettings, createRestorePoint: checked})}
                          />
                          <span>Create system restore point</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Log Settings</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Log file location</label>
                          <Input 
                            value={deploymentSettings.logLocation}
                            onChange={(e) => setDeploymentSettings({...deploymentSettings, logLocation: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Network share path</label>
                          <Input 
                            value={deploymentSettings.networkPath}
                            onChange={(e) => setDeploymentSettings({...deploymentSettings, networkPath: e.target.value})}
                            placeholder="\\\\server\\deployments"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <Button 
                      variant="outline"
                      onClick={() => handleSaveDownload(false)}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Package
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleSaveDownload(true)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Installer
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
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {!selectedAppDetails ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Select an application to view details</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-lg mb-4">{selectedAppDetails.name} Details</h3>
                    
                    <div className="space-y-4 mb-6">
                      {/* Version Selection */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Version</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name={`version-${selectedAppDetails.id}`}
                              value="latest"
                              defaultChecked
                              className="text-blue-600"
                            />
                            <span className="text-sm">Latest version (2024.1.2)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name={`version-${selectedAppDetails.id}`}
                              value="specific"
                              className="text-blue-600"
                            />
                            <span className="text-sm">Specific version</span>
                          </label>
                          <Select defaultValue="2024.1.2" className="ml-6">
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2024.1.2">2024.1.2 (Current)</SelectItem>
                              <SelectItem value="2024.1.1">2024.1.1</SelectItem>
                              <SelectItem value="2024.1.0">2024.1.0</SelectItem>
                              <SelectItem value="2023.3.2">2023.3.2</SelectItem>
                              <SelectItem value="2023.3.1">2023.3.1</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-medium">English</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">License Type:</span>
                        <span className="font-medium">Network</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">1.2 GB</span>
                      </div>
                    </div>
                    
                    <Accordion type="single" collapsible className="space-y-2">
                      <AccordionItem value="customization" className="border rounded-lg">
                        <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                          App Customization
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox defaultChecked />
                              <span>Express Tools</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox />
                              <span>Batch Standards Checker</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox defaultChecked />
                              <span>Reference Manager</span>
                            </label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="extensions" className="border rounded-lg">
                        <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                          Extensions
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox />
                              <span>Advance Steel</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox />
                              <span>MEP Toolkit</span>
                            </label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="languages" className="border rounded-lg">
                        <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                          Language Packs
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox />
                              <span>French</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox />
                              <span>German</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox />
                              <span>Spanish</span>
                            </label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </div>
            ) : (
              /* Checkout Summary */
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-lg mb-4">Package Summary</h3>
                
                <div className="space-y-3 mb-6">
                  {selectedApps.map(appId => {
                    const app = products.find(p => p.id === appId);
                    return (
                      <div key={appId} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{app?.name}</div>
                            <div className="text-sm text-gray-600">3 customizations, 2 extensions</div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "View Details",
                                description: `Showing details for ${app?.name}`,
                              });
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
            )}
          </div>
        </div>
      </div>
    );
  };


  // Listen for zoom messages from parent window
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'setDemoZoom') {
        setZoom(event.data.zoom);
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
      <DemoWrapper 
        url="manage.autodesk.com/products/deployments"
        browserTheme="mac"
        showBackground={true}
      >
        <div 
          ref={demoRef}
          className="h-full bg-background flex flex-col overflow-hidden"
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
        </div>
      </DemoWrapper>
      <Toaster />
    </ToastProvider>
  );
}

export default App;