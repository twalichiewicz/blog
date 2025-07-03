import React, { useState, useEffect, useRef } from 'react';
import { DemoWrapper, WalkthroughSupport } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Checkbox } from './components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Search, Plus, MoreHorizontal, ChevronDown, ChevronRight, X, Loader2, Edit2 } from 'lucide-react';
import { ToastProvider } from './components/ui/toast';
import { Toaster } from './components/Toaster';

function App() {
  const [currentView, setCurrentView] = useState('library'); // 'library' or 'editor'
  const [editingPackageName, setEditingPackageName] = useState(false);
  const [packageName, setPackageName] = useState('New Package');
  const walkthroughRef = useRef(null);
  
  // Dispatch navigation event when view changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('demo-navigation', {
      detail: { action: 'navigate', view: currentView }
    }));
  }, [currentView]);
  
  // Onboarding steps for the demo tour
  const onboardingSteps = [
    {
      title: "Custom Install Overview",
      description: "Welcome to Autodesk's Custom Install tool. This enterprise-grade interface allows IT administrators to create and manage software deployment packages across their organization.",
      developerNote: "Built with React and shadcn/ui components for a high-density, monochromatic design that matches Autodesk's enterprise aesthetic.",
      businessImpact: "Reduces deployment time by 60% and ensures consistent software configurations across teams.",
      metrics: [
        { value: "300+", label: "Products" },
        { value: "60%", label: "Time Saved" },
        { value: "99.9%", label: "Reliability" }
      ]
    },
    {
      title: "Package Library Management",
      description: "View and organize your installation packages. The tabbed interface separates personal packages from team-shared ones, with powerful search and filtering capabilities.",
      developerNote: "Implemented responsive tables with hover states and inline actions. Uses React state management for real-time search filtering.",
      businessImpact: "Centralized package management improves compliance and reduces software sprawl by 70% while increasing deployment success rates.",
      metrics: [
        { value: "70%", label: "Less Software Sprawl" },
        { value: "95%", label: "Deployment Success" }
      ],
      callouts: [
        {
          title: "Search & Filter",
          description: "Real-time package search",
          position: { top: '45%', left: '25%' }
        },
        {
          title: "Quick Actions",
          description: "Edit, duplicate, delete packages",
          position: { top: '50%', right: '15%' }
        }
      ]
    },
    {
      title: "Package Creation Workflow",
      description: "Step-by-step package creation with product selection, version control, and language configuration. The interface guides users through complex enterprise requirements.",
      developerNote: "Uses compound component patterns with controlled inputs and validation. Expandable sections reduce cognitive load while maintaining all functionality.",
      businessImpact: "Standardized deployment packages reduce installation errors by 85% and support compliance requirements.",
      metrics: [
        { value: "85%", label: "Fewer Errors" },
        { value: "100%", label: "Compliance Ready" }
      ],
      callouts: [
        {
          title: "Product Selection",
          description: "Choose from 300+ Autodesk products",
          position: { top: '40%', left: '20%' }
        },
        {
          title: "Version Control",
          description: "Latest or specific version targeting",
          position: { top: '55%', left: '35%' }
        }
      ]
    },
    {
      title: "Enterprise Design System",
      description: "Notice the strictly monochromatic design - no color accents, consistent typography, and high information density. This matches Autodesk's enterprise software aesthetic.",
      developerNote: "CSS custom properties enable consistent theming. All components use grayscale values only, with careful attention to contrast ratios for accessibility.",
      businessImpact: "Consistent UI patterns reduce training time by 50% and increase user productivity in enterprise environments by 25%.",
      metrics: [
        { value: "50%", label: "Less Training Time" },
        { value: "25%", label: "Higher Productivity" }
      ]
    }
  ];
  // Helper function to generate random dates
  const generateRandomDate = () => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Helper function to generate random types
  const getRandomType = () => {
    const types = ['Install', 'Deployment', 'Update', 'Custom'];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Helper function to generate random product counts
  const getRandomProducts = () => {
    return Math.floor(Math.random() * 25) + 5; // 5-30 products
  };

  const [packages, setPackages] = useState([
    {
      id: '1',
      name: 'Fusion 360, BIM360, Civil 3D, AutoCAD, 3dsMax, Maya',
      type: getRandomType(),
      modified: generateRandomDate(),
      products: 6,
      selectedProductIds: ['fusion', 'autocad', '3dsmax', 'maya'],
      productConfigs: {
        fusion: { version: 'latest', language: 'english', extensions: ['Generative Design', 'Simulation'], additionalOptions: [] },
        autocad: { version: 'specific', specificVersion: '2023', language: 'english', extensions: ['Express Tools'], additionalOptions: ['Sample Drawings'] },
        '3dsmax': { version: 'latest', language: 'english', extensions: ['Mental Ray', 'Arnold'], additionalOptions: [] },
        maya: { version: 'latest', language: 'japanese', extensions: ['Bifrost', 'MASH'], additionalOptions: ['Sample Scenes'] }
      },
      deploymentConfig: { mode: 'deploy', targetGroup: 'design-team', forceRestart: true, notifyUsers: false },
      shared: false,
      isNew: false
    },
    {
      id: '2',
      name: 'Architecture Engineering & Construction, Navisworks, Revit',
      type: getRandomType(),
      modified: generateRandomDate(),
      products: 2,
      selectedProductIds: ['revit', 'autocad'],
      productConfigs: {
        revit: { version: 'latest', language: 'english', extensions: ['Family Library', 'Content Browser'], additionalOptions: ['Template Files', 'Family Files'] },
        autocad: { version: 'latest', language: 'english', extensions: ['Express Tools', 'AutoLISP'], additionalOptions: [] }
      },
      deploymentConfig: { mode: 'install', licenseType: 'network', createShortcuts: true, silentInstall: false },
      shared: false,
      isNew: false
    },
    {
      id: '3',
      name: 'Austin Remote Team',
      type: getRandomType(),
      modified: generateRandomDate(),
      products: 3,
      selectedProductIds: ['inventor', 'fusion', 'autocad'],
      productConfigs: {},
      deploymentConfig: {},
      shared: false,
      isNew: false
    },
    {
      id: '4',
      name: 'Very Long Team Name 123456789101',
      type: getRandomType(),
      modified: generateRandomDate(),
      products: 1,
      selectedProductIds: ['maya'],
      productConfigs: {},
      deploymentConfig: {},
      shared: false,
      isNew: false
    }
  ]);
  const [editingPackage, setEditingPackage] = useState(null);
  const [renamingPackage, setRenamingPackage] = useState(null);
  const [showKebabMenu, setShowKebabMenu] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState({}); // Track loading state for checkboxes
  const [productConfigs, setProductConfigs] = useState({}); // Track configurations for each product

  const handleCreateNew = () => {
    setEditingPackage(null);
    setPackageName('Untitled package');
    setCurrentView('editor');
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageName(pkg.name);
    setCurrentView('editor');
  };

  const handleSavePackage = (newPackage) => {
    if (editingPackage) {
      setPackages(packages.map(p => p.id === editingPackage.id ? { ...p, ...newPackage, isNew: true } : p));
    } else {
      setPackages([...packages, { ...newPackage, id: Date.now().toString(), isNew: true, shared: false }]);
    }
    setCurrentView('library');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
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
    setRenamingPackage(null);
  };

  const handleStartRename = (pkg) => {
    setRenamingPackage(pkg.id);
  };

  const handleKebabClick = (e, pkgId) => {
    e.stopPropagation();
    setShowKebabMenu(showKebabMenu === pkgId ? null : pkgId);
  };

  // Close kebab menu when clicking outside
  const handleCloseKebab = () => {
    setShowKebabMenu(null);
  };

  // Library View Component
  const LibraryView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredPackages = packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-light mb-6">Custom Install</h2>
        </div>

        <Tabs defaultValue="library" className="w-full">
          <div className="relative">
            {/* Full-width underline */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-border"></div>
            
            <div className="flex items-end mb-6">
              <TabsList className="bg-transparent border-0 p-0 h-auto">
                <TabsTrigger 
                  value="library" 
                  className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 mr-8 pb-2 cursor-clickable"
                >
                  My Library
                </TabsTrigger>
                <TabsTrigger 
                  value="team"
                  className="bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 pb-2 cursor-clickable"
                >
                  Team Library
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="library" className="mt-6">
            <div className="bg-card rounded-xl shadow-lg" style={{boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)'}}>
              <div className="p-4 border-b border-border">
                <div className="flex justify-between items-center gap-4">
                  <Button 
                    onClick={handleCreateNew}
                    size="sm"
                    className="bg-foreground hover:bg-gray-800 text-background cursor-clickable rounded-[3px]"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Create package
                  </Button>
                  <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search packages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-sm rounded-[3px]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30 bg-gray-50">
                      <th className="text-left p-2 font-medium text-xs">Package name</th>
                      <th className="text-left p-2 font-medium text-xs">Type</th>
                      <th className="text-right p-2 font-medium text-xs">Last saved</th>
                      <th className="text-right p-2 font-medium text-xs">Products</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody onClick={handleCloseKebab}>
                    {filteredPackages.map((pkg) => (
                      <tr 
                        key={pkg.id} 
                        className="border-b border-border/20 hover:bg-gray-50 text-sm cursor-pointer cursor-clickable"
                        onClick={() => handleEditPackage(pkg)}
                      >
                      <td className="p-2 relative">
                        <div className="flex items-center gap-2">
                          {pkg.isNew && (
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          )}
                          <div className="flex-1">
                            {renamingPackage === pkg.id ? (
                              <Input
                                defaultValue={pkg.name}
                            autoFocus
                            onBlur={(e) => handleRenamePackage(pkg.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRenamePackage(pkg.id, e.target.value);
                              }
                              if (e.key === 'Escape') {
                                setRenamingPackage(null);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-auto p-1 text-sm"
                          />
                        ) : (
                          <span 
                            className="cursor-text-edit hover:bg-blue-50 rounded px-1 py-0.5 -mx-1 -my-0.5 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartRename(pkg);
                            }}
                          >
                            {pkg.name}
                          </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-muted-foreground cursor-not-clickable">{pkg.type}</td>
                      <td className="p-2 text-muted-foreground text-right cursor-not-clickable">{pkg.modified}</td>
                      <td className="p-2 text-muted-foreground text-right cursor-not-clickable">{pkg.products}</td>
                      <td className="p-2 relative" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 hover:bg-gray-200 cursor-pointer"
                          onClick={(e) => handleKebabClick(e, pkg.id)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                        {showKebabMenu === pkg.id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 min-w-[120px]">
                            <button 
                              className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => {
                                console.log('Info clicked for', pkg.name);
                                setShowKebabMenu(null);
                              }}
                            >
                              Info
                            </button>
                            <button 
                              className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => {
                                handleDuplicatePackage(pkg);
                                setShowKebabMenu(null);
                              }}
                            >
                              Duplicate
                            </button>
                            <button 
                              className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => {
                                console.log('Download clicked for', pkg.name);
                                setShowKebabMenu(null);
                              }}
                            >
                              Download
                            </button>
                            <button 
                              className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 text-red-600 transition-colors cursor-pointer"
                              onClick={() => {
                                handleDeletePackage(pkg.id);
                                setShowKebabMenu(null);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <div className="p-12 text-center">
              {/* Placeholder icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <p className="text-muted-foreground text-sm">No packages in team library.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Editor View Component - Two-step workflow
  const EditorView = ({ editingPackage, onSave, onBack, packageName, setPackageName, editingPackageName, setEditingPackageName }) => {
    // Initialize state from editing package or defaults
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState(editingPackage?.selectedProductIds || []);
    const [activeProduct, setActiveProduct] = useState(editingPackage?.selectedProductIds?.[0] || '3dsmax');
    const [expandedSections, setExpandedSections] = useState({});
    const [deploymentMode, setDeploymentMode] = useState(editingPackage?.deploymentConfig?.mode || 'install');
    const [licenseType, setLicenseType] = useState(editingPackage?.deploymentConfig?.licenseType || 'autodesk-id');
    const [targetGroup, setTargetGroup] = useState(editingPackage?.deploymentConfig?.targetGroup || 'all-users');
    const [createShortcuts, setCreateShortcuts] = useState(editingPackage?.deploymentConfig?.createShortcuts ?? true);
    const [silentInstall, setSilentInstall] = useState(editingPackage?.deploymentConfig?.silentInstall ?? false);
    const [forceRestart, setForceRestart] = useState(editingPackage?.deploymentConfig?.forceRestart ?? true);
    const [notifyUsers, setNotifyUsers] = useState(editingPackage?.deploymentConfig?.notifyUsers ?? false);
    const [saveStatus, setSaveStatus] = useState({ isLoading: false, message: '', type: '' }); // 'saving', 'downloading', 'success', 'error'
    const [showVersionModal, setShowVersionModal] = useState(false);
    const [selectedVersionProduct, setSelectedVersionProduct] = useState(null);
    const [versionSearchTerm, setVersionSearchTerm] = useState('');
    
    // Initialize product configs from editing package
    const [productConfigs, setProductConfigs] = useState(() => {
      if (editingPackage?.productConfigs) {
        return editingPackage.productConfigs;
      }
      return {};
    });

    const products = [
      { 
        id: '3dsmax', 
        name: '3ds Max', 
        icon: '3',
        category: 'Media & Entertainment',
        extensions: ['Mental Ray', 'Arnold', 'Character Studio', 'Biped'],
        languages: ['English', 'Japanese', 'Chinese (Simplified)', 'German', 'French'],
        platforms: ['Windows x64'],
        additionalOptions: ['Sample Files', 'Documentation', 'Help Files'],
        licensing: null
      },
      { 
        id: 'autocad', 
        name: 'AutoCAD', 
        icon: 'A',
        category: 'Design & Drafting',
        extensions: ['Express Tools', 'Raster Design', 'AutoLISP', 'Visual LISP IDE'],
        languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'],
        platforms: ['Windows x64', 'macOS'],
        additionalOptions: ['Sample Drawings', 'Plot Styles', 'Fonts', 'Hatch Patterns'],
        licensing: 'Serial number'
      },
      { 
        id: 'fusion', 
        name: 'Fusion 360', 
        icon: 'F',
        category: 'Product Design & Manufacturing',
        extensions: ['Generative Design', 'Simulation', 'CAM', 'Electronics'],
        languages: ['English', 'German', 'French', 'Italian', 'Spanish', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'],
        platforms: ['Windows x64', 'macOS'],
        additionalOptions: ['Sample Projects', 'Material Libraries', 'Post Processors', 'Tool Libraries'],
        licensing: null
      },
      { 
        id: 'inventor', 
        name: 'Inventor Professional', 
        icon: 'I',
        category: 'Product Design & Manufacturing',
        extensions: ['Stress Analysis', 'Frame Generator', 'Tube & Pipe', 'Cable & Harness'],
        languages: ['English', 'German', 'French', 'Italian', 'Spanish', 'Portuguese'],
        platforms: ['Windows x64'],
        additionalOptions: ['Content Libraries', 'Material Libraries', 'Bolt Connections'],
        licensing: null
      },
      { 
        id: 'maya', 
        name: 'Maya', 
        icon: 'M',
        category: 'Media & Entertainment',
        extensions: ['Bifrost', 'MASH', 'XGen', 'Arnold for Maya'],
        languages: ['English', 'Japanese', 'Chinese (Simplified)'],
        platforms: ['Windows x64', 'macOS', 'Linux'],
        additionalOptions: ['Sample Scenes', 'Scripts & Plugins', 'Documentation'],
        licensing: null
      },
      { 
        id: 'revit', 
        name: 'Revit', 
        icon: 'R',
        category: 'Architecture, Engineering & Construction',
        extensions: ['Family Library', 'Content Browser', 'Worksharing Monitor'],
        languages: ['English', 'French', 'German', 'Italian', 'Spanish', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'],
        platforms: ['Windows x64'],
        additionalOptions: ['Template Files', 'Family Files', 'Material Libraries', 'Rendering Content'],
        licensing: 'Provisioned'
      }
    ].sort((a, b) => a.name.localeCompare(b.name));

    const activeProductData = products.find(p => p.id === activeProduct);

    const toggleProduct = async (productId) => {
      // Set loading state
      setLoadingProducts(prev => ({ ...prev, [productId]: true }));
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use functional update to get current state
        setSelectedProducts(currentSelected => {
          const isCurrentlySelected = currentSelected.includes(productId);
          
          if (!isCurrentlySelected) {
            // Adding product - initialize default config
            const product = products.find(p => p.id === productId);
            
            // Initialize product config immediately
            setProductConfigs(prevConfigs => ({
              ...prevConfigs,
              [productId]: {
                version: 'latest',
                language: 'english',
                platform: product?.platforms[0] || 'Windows x64',
                extensions: product?.extensions || [],
                additionalOptions: []
              }
            }));
            
            return [...currentSelected, productId];
          } else {
            // Removing product - handle active product change
            if (activeProduct === productId && currentSelected.length > 1) {
              const remaining = currentSelected.filter(id => id !== productId);
              if (remaining.length > 0) {
                setActiveProduct(remaining[0]);
              }
            }
            
            // Remove product config when removing product
            setProductConfigs(prevConfigs => {
              const newConfigs = { ...prevConfigs };
              delete newConfigs[productId];
              return newConfigs;
            });
            
            return currentSelected.filter(id => id !== productId);
          }
        });
      } catch (error) {
        console.error('Error toggling product:', error);
      } finally {
        // Always clear loading state
        setLoadingProducts(prev => ({ ...prev, [productId]: false }));
      }
    };

    const toggleSection = (section) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    const handleConfigChange = (productId, configKey, value) => {
      // Update configuration
      setProductConfigs(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          [configKey]: value
        }
      }));
      
      // Auto-add product if not already selected (this simulates user intent to add with custom config)
      if (!selectedProducts.includes(productId)) {
        // Add product immediately without async delay since user is configuring
        setSelectedProducts(prev => [...prev, productId]);
        
        // Initialize default config if not exists
        const product = products.find(p => p.id === productId);
        if (!productConfigs[productId]) {
          setProductConfigs(configs => ({
            ...configs,
            [productId]: {
              version: 'latest',
              language: 'english',
              platform: product?.platforms[0] || 'Windows x64',
              extensions: product?.extensions || [],
              additionalOptions: []
            }
          }));
        }
      }
    };

    const proceedToStep2 = () => {
      if (selectedProducts.length > 0) {
        setCurrentStep(2);
      }
    };

    const goBackToStep1 = () => {
      setCurrentStep(1);
    };

    // Dynamic package naming - update name when products are added (only for new packages)
    useEffect(() => {
      if (!editingPackage && selectedProducts.length > 0 && (packageName === 'Untitled package' || packageName === 'New Package')) {
        const selectedProductNames = selectedProducts.map(id => {
          const product = products.find(p => p.id === id);
          return product ? product.name : '';
        }).filter(Boolean);
        
        if (selectedProductNames.length > 0) {
          const newName = selectedProductNames.slice(0, 3).join(', ') + 
                         (selectedProductNames.length > 3 ? ` and ${selectedProductNames.length - 3} more` : '');
          setPackageName(newName);
        }
      }
    }, [selectedProducts, packageName, editingPackage, products]);

    const handleSave = async () => {
      setSaveStatus({ isLoading: true, message: 'Saving package...', type: 'saving' });
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create package data
        const packageData = {
          name: editingPackage?.name || packageName,
          type: deploymentMode,
          modified: new Date().toLocaleDateString(),
          products: selectedProducts.length,
          selectedProductIds: selectedProducts,
          productConfigs: productConfigs,
          deploymentConfig: {
            mode: deploymentMode,
            ...(deploymentMode === 'install' ? {
              licenseType,
              createShortcuts,
              silentInstall
            } : {
              targetGroup,
              forceRestart,
              notifyUsers
            })
          }
        };
        
        // Call the original onSave function (which adds to library with new indicator)
        onSave(packageData);
        
        setSaveStatus({ isLoading: false, message: 'Package saved successfully', type: 'success' });
        
        // Clear status after 3 seconds
        setTimeout(() => {
          setSaveStatus({ isLoading: false, message: '', type: '' });
        }, 3000);
        
      } catch (error) {
        setSaveStatus({ isLoading: false, message: 'Failed to save package', type: 'error' });
        setTimeout(() => {
          setSaveStatus({ isLoading: false, message: '', type: '' });
        }, 3000);
      }
    };

    const handleDownload = async () => {
      setSaveStatus({ isLoading: true, message: 'Generating installer...', type: 'downloading' });
      
      try {
        // Simulate download generation
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        setSaveStatus({ isLoading: false, message: 'Installer downloaded successfully', type: 'success' });
        
        // Clear status after 3 seconds
        setTimeout(() => {
          setSaveStatus({ isLoading: false, message: '', type: '' });
        }, 3000);
        
      } catch (error) {
        setSaveStatus({ isLoading: false, message: 'Failed to generate installer', type: 'error' });
        setTimeout(() => {
          setSaveStatus({ isLoading: false, message: '', type: '' });
        }, 3000);
      }
    };

    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button onClick={onBack} className="hover:text-foreground cursor-clickable">
              Custom Install
            </button>
            <ChevronRight className="w-4 h-4" />
            <span>{editingPackage?.name || packageName}</span>
          </div>
          {editingPackageName ? (
            <Input
              defaultValue={editingPackage?.name || packageName}
              autoFocus
              onBlur={(e) => {
                setPackageName(e.target.value);
                setEditingPackageName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPackageName(e.target.value);
                  setEditingPackageName(false);
                }
                if (e.key === 'Escape') {
                  setEditingPackageName(false);
                }
              }}
              className="text-2xl font-light h-auto p-0 border-0 border-b-2 border-transparent focus:border-blue-500 rounded-none"
            />
          ) : (
            <div className="inline-flex items-center gap-2 group">
              <h2 
                className="text-2xl font-light cursor-text hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-200"
                onClick={() => setEditingPackageName(true)}
                title="Click to edit package name"
              >
                {editingPackage?.name || packageName}
              </h2>
              <Edit2 
                className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                onClick={() => setEditingPackageName(true)}
              />
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Left Column - Steps Container */}
          <div className="w-1/2 space-y-4">
            {/* Step 1 Container */}
            <div className={`bg-card rounded-xl shadow-lg transition-all duration-300 ${
              currentStep === 2 ? 'opacity-60' : ''
            }`} style={{boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)'}}>
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full text-sm flex items-center justify-center font-medium ${
                    currentStep === 1 ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {currentStep === 1 ? '1' : '✓'}
                  </span>
                  <h3 className="font-medium">Select and Configure Products</h3>
                </div>
              </div>
              
              {currentStep === 1 ? (
                <>
                  <div className="p-2">
                    <div className="space-y-0 max-h-96 overflow-y-auto">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className={`flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer transition-all duration-200 shadow-sm ${
                            activeProduct === product.id ? 'bg-blue-50 border border-blue-200 shadow-md' : 'hover:bg-gray-50 hover:shadow-md'
                          }`}
                          onClick={() => setActiveProduct(product.id)}
                        >
                          {loadingProducts[product.id] ? (
                            <div className="w-4 h-4 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            </div>
                          ) : (
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={(checked) => {
                                toggleProduct(product.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          <div className="flex items-center gap-2 flex-1">
                            <div className="w-8 h-8 bg-muted rounded text-sm font-medium flex items-center justify-center flex-shrink-0">
                              {product.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{product.name}</div>
                              {product.licensing && (
                                <div className="text-xs text-muted-foreground truncate">{product.licensing}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex justify-end">
                      <Button 
                        onClick={proceedToStep2}
                        disabled={selectedProducts.length === 0}
                        className="bg-foreground hover:bg-gray-800 text-background"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">
                  {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                  {currentStep === 2 && (
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={goBackToStep1}
                      className="ml-2 p-0 h-auto"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Step 2 Container */}
            <div className={`bg-card rounded-xl shadow-lg transition-all duration-300 ${
              currentStep === 1 ? 'opacity-60' : ''
            }`} style={{boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)'}}>
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full text-sm flex items-center justify-center font-medium ${
                    currentStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                  }`}>
                    2
                  </span>
                  <h3 className="font-medium">Configure Deployment</h3>
                </div>
              </div>
              
              {currentStep === 2 ? (
                <>
                  <div className="p-4 space-y-4">
                    {/* Deployment Type Toggle */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Deployment Method</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="deployment"
                            value="install"
                            checked={deploymentMode === 'install'}
                            onChange={(e) => setDeploymentMode(e.target.value)}
                          />
                          <div>
                            <span className="font-medium text-sm">Install</span>
                            <p className="text-xs text-muted-foreground">Direct installation package</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="deployment"
                            value="deploy"
                            checked={deploymentMode === 'deploy'}
                            onChange={(e) => setDeploymentMode(e.target.value)}
                          />
                          <div>
                            <span className="font-medium text-sm">Deploy</span>
                            <p className="text-xs text-muted-foreground">Network deployment package</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Dynamic Options Based on Mode */}
                    {deploymentMode === 'install' ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">License Type</label>
                          <Select value={licenseType} onValueChange={setLicenseType}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="autodesk-id">Autodesk ID</SelectItem>
                              <SelectItem value="network">Network License</SelectItem>
                              <SelectItem value="standalone">Standalone</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-clickable">
                            <Checkbox 
                              checked={createShortcuts}
                              onCheckedChange={setCreateShortcuts}
                            />
                            <span className="text-sm">Create desktop shortcuts</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-clickable">
                            <Checkbox 
                              checked={silentInstall}
                              onCheckedChange={setSilentInstall}
                            />
                            <span className="text-sm">Silent installation</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Target Group</label>
                          <Select value={targetGroup} onValueChange={setTargetGroup}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all-users">All Users</SelectItem>
                              <SelectItem value="design-team">Design Team</SelectItem>
                              <SelectItem value="engineers">Engineers</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-clickable">
                            <Checkbox 
                              checked={forceRestart}
                              onCheckedChange={setForceRestart}
                            />
                            <span className="text-sm">Force restart</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-clickable">
                            <Checkbox 
                              checked={notifyUsers}
                              onCheckedChange={setNotifyUsers}
                            />
                            <span className="text-sm">Notify users</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex justify-end gap-3">
                      <Button 
                        onClick={handleSave}
                        variant="outline"
                        size="sm"
                        className="cursor-clickable"
                        disabled={saveStatus.isLoading}
                      >
                        {saveStatus.isLoading && saveStatus.type === 'saving' ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save'
                        )}
                      </Button>
                      <Button 
                        onClick={handleDownload}
                        size="sm"
                        className="bg-foreground hover:bg-gray-800 text-background cursor-clickable"
                        disabled={saveStatus.isLoading}
                      >
                        {saveStatus.isLoading && saveStatus.type === 'downloading' ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          'Download'
                        )}
                      </Button>
                    </div>
                    
                    {/* Status message */}
                    {saveStatus.message && (
                      <div className="mt-3 flex items-center justify-end gap-2 text-sm">
                        {saveStatus.isLoading && (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        )}
                        <span className={`${
                          saveStatus.type === 'success' ? 'text-green-600' : 
                          saveStatus.type === 'error' ? 'text-red-600' : 
                          'text-muted-foreground'
                        }`}>
                          {saveStatus.message}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">
                  Configure deployment options
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Product Details */}
          <div className="w-1/2">
            <div className="bg-card rounded-xl shadow-lg h-full" style={{boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)'}}>
              {currentStep === 1 ? (
                // Step 1: Show active product details
                activeProductData ? (
                  <>
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded text-lg font-medium flex items-center justify-center flex-shrink-0">
                            {activeProductData.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{activeProductData.name}</h4>
                            <p className="text-xs text-muted-foreground">{activeProductData.category}</p>
                          </div>
                        </div>
                        {/* Language selector in top-right */}
                        <div>
                          <Select 
                            value={productConfigs[activeProduct]?.language || 'english'} 
                            onValueChange={(value) => handleConfigChange(activeProduct, 'language', value)}
                          >
                            <SelectTrigger className="w-auto min-w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {activeProductData.languages.slice(0, 5).map(lang => (
                                <SelectItem key={lang} value={lang.toLowerCase()}>{lang}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                      {/* Version Selection - Radio Options */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">Version to install</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`version-${activeProduct}`}
                              value="latest"
                              checked={(productConfigs[activeProduct]?.version || 'latest') === 'latest'}
                              onChange={() => handleConfigChange(activeProduct, 'version', 'latest')}
                            />
                            <div>
                              <span className="text-sm">Latest version</span>
                              <span className="text-xs text-muted-foreground block ml-5">2024.2</span>
                            </div>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`version-${activeProduct}`}
                              value="specific"
                              checked={productConfigs[activeProduct]?.version === 'specific'}
                              onChange={() => handleConfigChange(activeProduct, 'version', 'specific')}
                            />
                            <span className="text-sm">Specific version</span>
                          </label>
                          {productConfigs[activeProduct]?.version === 'specific' && (
                            <Select 
                              value={productConfigs[activeProduct]?.specificVersion || '2024'}
                              onValueChange={(value) => handleConfigChange(activeProduct, 'specificVersion', value)}
                              className="mt-2 ml-6"
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2024">2024.2</SelectItem>
                                <SelectItem value="2023">2023.4</SelectItem>
                                <SelectItem value="2022">2022.6</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>

                      {/* Platform Selection if multiple platforms */}
                      {activeProductData.platforms.length > 1 && (
                        <div>
                          <label className="text-sm font-medium">Platform</label>
                          <Select 
                            value={productConfigs[activeProduct]?.platform || activeProductData.platforms[0].toLowerCase().replace(' ', '-')} 
                            onValueChange={(value) => handleConfigChange(activeProduct, 'platform', value)}
                            className="mt-1"
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {activeProductData.platforms.map(platform => (
                                <SelectItem key={platform} value={platform.toLowerCase().replace(' ', '-')}>{platform}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Registration Section */}
                      <div className="border-t pt-4">
                        <label className="text-sm font-medium mb-3 block">Registration</label>
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <label className="text-xs font-medium text-muted-foreground">Serial Number</label>
                              <Input 
                                type="text"
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                value={productConfigs[activeProduct]?.serialNumber || ''}
                                onChange={(e) => handleConfigChange(activeProduct, 'serialNumber', e.target.value)}
                                className="mt-1 text-sm"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs font-medium text-muted-foreground">Product Key</label>
                              <Input 
                                type="text"
                                placeholder="XXX-XXXXXXX"
                                value={productConfigs[activeProduct]?.productKey || ''}
                                onChange={(e) => handleConfigChange(activeProduct, 'productKey', e.target.value)}
                                className="mt-1 text-sm"
                              />
                            </div>
                          </div>
                          <label className="flex items-center gap-2 cursor-clickable">
                            <Checkbox 
                              checked={productConfigs[activeProduct]?.customRegistration || false}
                              onCheckedChange={(checked) => handleConfigChange(activeProduct, 'customRegistration', checked)}
                            />
                            <span className="text-sm">Use custom registration</span>
                          </label>
                          {productConfigs[activeProduct]?.customRegistration && (
                            <Input 
                              type="text"
                              placeholder="Enter custom registration value"
                              value={productConfigs[activeProduct]?.customRegistrationValue || ''}
                              onChange={(e) => handleConfigChange(activeProduct, 'customRegistrationValue', e.target.value)}
                              className="ml-6 text-sm"
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Horizontal Rule */}
                      <hr className="border-t border-border my-4" />
                      
                      {/* Product-specific accordions */}
                      <div className="space-y-2">
                        {/* Customizations */}
                        <div className="border border-border/30 rounded bg-gray-50/50">
                          <button
                            onClick={() => toggleSection(`${activeProduct}-customizations`)}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 cursor-clickable"
                          >
                            <span className="font-medium text-sm">Customizations</span>
                            {expandedSections[`${activeProduct}-customizations`] ? 
                              <ChevronDown className="w-4 h-4" /> : 
                              <ChevronRight className="w-4 h-4" />
                            }
                          </button>
                          {expandedSections[`${activeProduct}-customizations`] && (
                            <div className="border-t p-3 space-y-3">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Installation Path</label>
                                <Input 
                                  type="text"
                                  placeholder="C:\\Program Files\\Autodesk\\"
                                  value={productConfigs[activeProduct]?.installPath || ''}
                                  onChange={(e) => handleConfigChange(activeProduct, 'installPath', e.target.value)}
                                  className="mt-1 text-sm"
                                />
                              </div>
                              <label className="flex items-center gap-2 cursor-clickable">
                                <Checkbox 
                                  checked={productConfigs[activeProduct]?.autoUpdate ?? true}
                                  onCheckedChange={(checked) => handleConfigChange(activeProduct, 'autoUpdate', checked)}
                                />
                                <span className="text-sm">Enable automatic updates</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-clickable">
                                <Checkbox 
                                  checked={productConfigs[activeProduct]?.collectAnalytics ?? false}
                                  onCheckedChange={(checked) => handleConfigChange(activeProduct, 'collectAnalytics', checked)}
                                />
                                <span className="text-sm">Send usage analytics</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-clickable">
                                <Checkbox 
                                  checked={productConfigs[activeProduct]?.enableCloudSync ?? true}
                                  onCheckedChange={(checked) => handleConfigChange(activeProduct, 'enableCloudSync', checked)}
                                />
                                <span className="text-sm">Enable cloud sync</span>
                              </label>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Default Project Location</label>
                                <Input 
                                  type="text"
                                  placeholder="C:\\Users\\%USERNAME%\\Documents\\"
                                  value={productConfigs[activeProduct]?.projectPath || ''}
                                  onChange={(e) => handleConfigChange(activeProduct, 'projectPath', e.target.value)}
                                  className="mt-1 text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Extensions */}
                        <div className="border border-border/30 rounded bg-gray-50/50">
                          <button
                            onClick={() => toggleSection(`${activeProduct}-extensions`)}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 cursor-clickable"
                          >
                            <span className="font-medium text-sm">Extensions & Add-ons</span>
                            {expandedSections[`${activeProduct}-extensions`] ? 
                              <ChevronDown className="w-4 h-4" /> : 
                              <ChevronRight className="w-4 h-4" />
                            }
                          </button>
                          {expandedSections[`${activeProduct}-extensions`] && (
                            <div className="border-t p-2 space-y-1">
                              {activeProductData.extensions.map(ext => (
                                <label key={ext} className="flex items-center gap-2 cursor-clickable">
                                  <Checkbox 
                                    checked={productConfigs[activeProduct]?.extensions?.includes(ext) ?? true}
                                    onCheckedChange={(checked) => {
                                      const currentExtensions = productConfigs[activeProduct]?.extensions || activeProductData.extensions;
                                      const newExtensions = checked 
                                        ? [...currentExtensions.filter(e => e !== ext), ext]
                                        : currentExtensions.filter(e => e !== ext);
                                      handleConfigChange(activeProduct, 'extensions', newExtensions);
                                    }}
                                  />
                                  <span className="text-sm">{ext}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Additional Components */}
                        <div className="border border-border/30 rounded bg-gray-50/50">
                          <button
                            onClick={() => toggleSection(`${activeProduct}-additional`)}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 cursor-clickable"
                          >
                            <span className="font-medium text-sm">Additional Components</span>
                            {expandedSections[`${activeProduct}-additional`] ? 
                              <ChevronDown className="w-4 h-4" /> : 
                              <ChevronRight className="w-4 h-4" />
                            }
                          </button>
                          {expandedSections[`${activeProduct}-additional`] && (
                            <div className="border-t p-2 space-y-1">
                              {activeProductData.additionalOptions.map(option => (
                                <label key={option} className="flex items-center gap-2 cursor-clickable">
                                  <Checkbox 
                                    checked={productConfigs[activeProduct]?.additionalOptions?.includes(option) ?? false}
                                    onCheckedChange={(checked) => {
                                      const currentOptions = productConfigs[activeProduct]?.additionalOptions || [];
                                      const newOptions = checked 
                                        ? [...currentOptions, option]
                                        : currentOptions.filter(o => o !== option);
                                      handleConfigChange(activeProduct, 'additionalOptions', newOptions);
                                    }}
                                  />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-8">
                    <div>
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        Select a product to configure
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Click on a product in the left panel to view options
                      </p>
                    </div>
                  </div>
                )
              ) : (
                // Step 2: Show all selected products summary
                <>
                  <div className="p-4 border-b">
                    <h4 className="font-medium">Selected Products ({selectedProducts.length})</h4>
                    <p className="text-sm text-muted-foreground mt-1">Review your package configuration</p>
                  </div>
                  
                  <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                    {selectedProducts.map((productId) => {
                      const product = products.find(p => p.id === productId);
                      return (
                        <div key={productId} className="border border-border rounded-sm p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded text-sm font-medium flex items-center justify-center flex-shrink-0">
                              {product.icon}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{product.name}</h5>
                              <p className="text-xs text-muted-foreground">{product.category}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Version Selection Modal */}
        {showVersionModal && selectedVersionProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowVersionModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">Select Version - {products.find(p => p.id === selectedVersionProduct)?.name}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowVersionModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search versions..."
                  value={versionSearchTerm}
                  onChange={(e) => setVersionSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Year tabs */}
            <div className="border-b">
              <div className="flex gap-1 p-2 overflow-x-auto">
                {['2024', '2023', '2022', '2021', '2020', '2019', '2018'].map(year => (
                  <button
                    key={year}
                    className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => setVersionSearchTerm(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Version list */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {[
                  { version: '2024.2', release: 'November 2024', status: 'Latest' },
                  { version: '2024.1.1', release: 'September 2024', status: 'Update' },
                  { version: '2024.1', release: 'June 2024', status: 'Major' },
                  { version: '2024', release: 'March 2024', status: 'Initial' },
                  { version: '2023.4', release: 'December 2023', status: 'Final' },
                  { version: '2023.3', release: 'September 2023', status: 'Update' },
                  { version: '2023.2', release: 'June 2023', status: 'Update' },
                  { version: '2023.1', release: 'March 2023', status: 'Update' },
                  { version: '2023', release: 'January 2023', status: 'Initial' },
                ].filter(v => !versionSearchTerm || v.version.includes(versionSearchTerm)).map(versionInfo => (
                  <button
                    key={versionInfo.version}
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-50 text-left"
                    onClick={() => {
                      handleConfigChange(selectedVersionProduct, 'specificVersion', versionInfo.version);
                      setShowVersionModal(false);
                      setVersionSearchTerm('');
                    }}
                  >
                    <div>
                      <div className="font-medium text-sm">{versionInfo.version}</div>
                      <div className="text-xs text-muted-foreground">{versionInfo.release}</div>
                    </div>
                    <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                      {versionInfo.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    );
  };

  // Initialize walkthrough support
  useEffect(() => {
    // Create simplified steps for the parent toolbar
    const walkthroughSteps = onboardingSteps.map(step => ({
      title: step.title,
      description: step.description,
      autoComplete: true,
      duration: 5000
    }));
    
    // Initialize walkthrough support for parent communication
    walkthroughRef.current = new WalkthroughSupport(walkthroughSteps);
    
    // Handle postMessage for demo reinitialization
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'reinitialize') {
        console.log('[Custom Install Demo] Received reinitialize message:', event.data.reason)
        // Reset demo to initial state
        setCurrentView('library')
        setEditingPackageName(false)
        setPackageName('New Package')
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('message', handleMessage)
      if (walkthroughRef.current) {
        walkthroughRef.current.end();
      }
    };
  }, []);

  const handleNavigate = (direction, view) => {
    if (view) {
      setCurrentView(view);
    }
  };

  return (
    <ToastProvider>
      <DemoWrapper 
        url="manage.autodesk.com/custom-install"
        browserTheme="mac"
        customCursor="enterprise"
        onNavigate={handleNavigate}
      >
        <div className="min-h-full bg-background flex flex-col">
          {/* Simple header */}
          <header className="bg-black text-white flex-shrink-0">
            <div className="h-14 flex items-center px-6 border-b border-gray-800">
              <h1 className="text-sm font-medium tracking-wide">Autodesk</h1>
            </div>
          </header>

          {/* Main content */}
          <div className="flex-1 p-6 bg-background">
            {currentView === 'library' ? (
              <LibraryView />
            ) : (
              <EditorView 
                editingPackage={editingPackage}
                onSave={handleSavePackage}
                onBack={handleBackToLibrary}
                packageName={packageName}
                setPackageName={setPackageName}
                editingPackageName={editingPackageName}
                setEditingPackageName={setEditingPackageName}
              />
            )}
          </div>
        </div>
      </DemoWrapper>
      <Toaster />
    </ToastProvider>
  );
}

export default App;

// Test change Mon Jun 30 14:12:52 PDT 2025
