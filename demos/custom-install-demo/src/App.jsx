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
    const products = ['AutoCAD', 'Revit', 'Civil 3D', 'Inventor', 'Navisworks', 'Fusion 360', '3ds Max', 'Maya'];
    const versions = ['2024', '2023', '2022'];
    const languages = ['English', 'French', 'German', 'Spanish', 'Italian', 'Japanese'];
    const statuses = ['Active', 'Testing', 'Archived'];
    
    return Array(15).fill(null).map((_, i) => {
      const numProducts = Math.floor(Math.random() * 5) + 1;
      const selectedProducts = [];
      for (let j = 0; j < numProducts; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const version = versions[Math.floor(Math.random() * versions.length)];
        selectedProducts.push(`${product} ${version}`);
      }
      
      return {
        id: `pkg-${i + 1}`,
        name: selectedProducts.join(', '),
        product: selectedProducts[0].split(' ')[0],
        version: selectedProducts[0].split(' ')[1],
        language: languages[Math.floor(Math.random() * languages.length)],
        type: Math.random() > 0.5 ? 'deployment' : 'install',
        created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        modified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        deployments: Math.floor(Math.random() * 500) + 10,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        products: numProducts,
        shared: Math.random() > 0.7
      };
    });
  };
  
  const [packages, setPackages] = useState(generateRandomPackages());
  const [editingPackage, setEditingPackage] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState(new Set());
  const [selectedApps, setSelectedApps] = useState([]);
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
      id: Date.now().toString(),
      name: `${pkg.name} (Copy)`,
      modified: new Date().toLocaleDateString()
    };
    setPackages([...packages, newPackage]);
  };

  const handleDeletePackage = (id) => {
    setPackages(packages.filter(p => p.id !== id));
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
          <h2 className="text-2xl font-light">Deploy at Scale</h2>
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
                className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600"
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
                    <th className="text-left p-4 font-medium text-sm text-gray-700">Product</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-700">Version</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-700">Language</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-700">Created</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-700">Modified</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-700">Deployments</th>
                    <th className="text-left p-4 font-medium text-sm text-gray-700">Status</th>
                    <th className="w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr 
                      key={pkg.id} 
                      className="border-b hover:bg-gray-50 cursor-pointer relative group"
                      onMouseEnter={() => setHoveredRow(pkg.id)}
                      onMouseLeave={() => setHoveredRow(null)}
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
                          <span 
                            className="hover:bg-gray-100 px-2 py-1 rounded cursor-text inline-block"
                            onClick={(e) => handleStartEdit(pkg, e)}
                            title="Click to edit"
                          >
                            {pkg.name}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-600">{pkg.product}</td>
                      <td className="p-4 text-gray-600">{pkg.version}</td>
                      <td className="p-4 text-gray-600">{pkg.language}</td>
                      <td className="p-4 text-gray-600">{pkg.created}</td>
                      <td className="p-4 text-gray-600">{pkg.modified}</td>
                      <td className="p-4 text-gray-600">{pkg.deployments}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          pkg.status === 'Active' ? 'bg-green-100 text-green-800' :
                          pkg.status === 'Testing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pkg.status}
                        </span>
                      </td>
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
                        <div className={`absolute right-full mr-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-gray-200 rounded-md shadow-lg p-1 transition-all duration-200 z-50 ${
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
            
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline"
                disabled={selectedPackages.size === 0}
                onClick={() => {
                  toast({
                    title: "Deploy Selected",
                    description: `Deploying ${selectedPackages.size} packages...`,
                  });
                }}
              >
                Deploy Selected
              </Button>
              <Button 
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create New Package
              </Button>
            </div>
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
    const products = [
      { id: 'autocad', name: 'AutoCAD 2024', icon: '🔧' },
      { id: 'revit', name: 'Revit 2024', icon: '🏗️' },
      { id: 'civil3d', name: 'Civil 3D 2024', icon: '🛣️' },
      { id: 'inventor', name: 'Inventor 2024', icon: '⚙️' },
      { id: 'navisworks', name: 'Navisworks 2024', icon: '🔍' },
      { id: 'fusion360', name: 'Fusion 360', icon: '🔄' },
      { id: '3dsmax', name: '3ds Max 2024', icon: '🎨' },
      { id: 'maya', name: 'Maya 2024', icon: '🎬' }
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
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {products.map((app) => (
                      <div 
                        key={app.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedApps.includes(app.id) 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleApp(app.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{app.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium">{app.name}</div>
                          </div>
                          <Checkbox 
                            checked={selectedApps.includes(app.id)}
                            onCheckedChange={() => toggleApp(app.id)}
                          />
                        </div>
                      </div>
                    ))}
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
                {selectedApps.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Select an application to view details</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-lg mb-4">{products.find(p => p.id === selectedApps[0])?.name} Details</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Version:</span>
                        <span className="font-medium">2024.1.2</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-medium">English</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">License Type:</span>
                        <span className="font-medium">Network</span>
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

  return (
    <ToastProvider>
      <DemoWrapper 
        url="manage.autodesk.com/products/deployments"
        browserTheme="mac"
        showBackground={true}
      >
        <div 
          ref={demoRef}
          className="h-full bg-background transition-transform origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Simple header */}
          <header className="bg-foreground text-background">
            <div className="h-14 flex items-center px-6 border-b border-gray-800">
              <h1 className="text-sm font-medium tracking-wide">AUTODESK DEPLOY AT SCALE</h1>
            </div>
          </header>

          {/* Main content */}
          <div className="p-6">
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