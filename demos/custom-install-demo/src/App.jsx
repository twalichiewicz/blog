import React, { useState } from 'react';
import DemoWrapper from '../../shared/components/DemoWrapper.jsx';
import '../../shared/components/demo-wrapper.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Checkbox } from './components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Search, Plus, MoreHorizontal, ChevronDown, ChevronRight, X } from 'lucide-react';
import { ToastProvider } from './components/ui/toast';
import { Toaster } from './components/Toaster';

function App() {
  const [currentView, setCurrentView] = useState('library'); // 'library' or 'editor'
  const [packages, setPackages] = useState([
    {
      id: '1',
      name: 'Fusion 360, BIM360, Civil 3D, AutoCAD, 3dsMax, Maya',
      type: 'deployment',
      modified: '03/03/2020',
      products: 20,
      shared: false
    },
    {
      id: '2',
      name: 'Architecture Engineering & Construction, Navisworks, Revit',
      type: 'deployment',
      modified: '03/03/2020',
      products: 20,
      shared: false
    },
    {
      id: '3',
      name: 'Austin Remote Team',
      type: 'deployment',
      modified: '03/03/2020',
      products: 20,
      shared: false
    },
    {
      id: '4',
      name: 'Very Long Team Name 123456789101',
      type: 'install',
      modified: '03/03/2020',
      products: 20,
      shared: false
    }
  ]);
  const [editingPackage, setEditingPackage] = useState(null);

  const handleCreateNew = () => {
    setEditingPackage(null);
    setCurrentView('editor');
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setCurrentView('editor');
  };

  const handleSavePackage = (newPackage) => {
    if (editingPackage) {
      setPackages(packages.map(p => p.id === editingPackage.id ? { ...p, ...newPackage } : p));
    } else {
      setPackages([...packages, { ...newPackage, id: Date.now().toString() }]);
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
          <Button 
            onClick={handleCreateNew}
            className="bg-foreground hover:bg-gray-800 text-background"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create package
          </Button>
        </div>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="library">My Library</TabsTrigger>
            <TabsTrigger value="team">Team Library</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="mt-6">
            <div className="bg-card border border-border rounded-sm">
              <div className="p-4 border-b">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium text-sm">Package name</th>
                    <th className="text-left p-4 font-medium text-sm">Type</th>
                    <th className="text-left p-4 font-medium text-sm">Last saved</th>
                    <th className="text-left p-4 font-medium text-sm">Products</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr 
                      key={pkg.id} 
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleEditPackage(pkg)}
                    >
                      <td className="p-4">{pkg.name}</td>
                      <td className="p-4 text-muted-foreground">Install</td>
                      <td className="p-4 text-muted-foreground">{pkg.modified}</td>
                      <td className="p-4 text-muted-foreground">{pkg.products}</td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <div className="bg-card border border-border rounded-sm p-8 text-center text-muted-foreground">
              <p>No packages in team library.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Editor View Component
  const EditorView = () => {
    const [selectedProducts, setSelectedProducts] = useState(['3dsmax', 'inventor']);
    const [expandedSections, setExpandedSections] = useState({});

    const products = [
      { id: '3dsmax', name: '3ds Max', icon: '3' },
      { id: 'inventor', name: 'Inventor Professional', icon: 'I' },
      { id: 'maya', name: 'Maya', icon: 'M' },
      { id: 'autocad', name: 'AutoCAD', icon: 'A' },
      { id: 'revit', name: 'Revit', icon: 'R' },
      { id: 'fusion', name: 'Fusion 360', icon: 'F' }
    ];

    const toggleProduct = (productId) => {
      setSelectedProducts(prev =>
        prev.includes(productId)
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      );
    };

    const toggleSection = (productId, section) => {
      const key = `${productId}-${section}`;
      setExpandedSections(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button onClick={handleBackToLibrary} className="hover:text-foreground">
              Custom Install
            </button>
            <ChevronRight className="w-4 h-4" />
            <span>{editingPackage?.name || 'New Package'}</span>
          </div>
          <h2 className="text-2xl font-light">{editingPackage?.name || 'New Package'}</h2>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs flex items-center justify-center">1</span>
              Add products
            </h3>

            <div className="ml-8 space-y-4">
              <div>
                <label className="text-sm font-medium">License Type:</label>
                <Select defaultValue="autodesk-id" className="mt-1">
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="autodesk-id">Autodesk ID</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="standalone">Standalone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="border border-border rounded-sm bg-card">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => toggleProduct(product.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-muted rounded text-sm font-medium flex items-center justify-center">
                              {product.icon}
                            </div>
                            <span className="font-medium">{product.name}</span>
                          </div>

                          {selectedProducts.includes(product.id) && (
                            <div className="mt-4 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm">Version to install:</label>
                                  <div className="mt-2 space-y-1">
                                    <label className="flex items-center gap-2">
                                      <input type="radio" name={`version-${product.id}`} defaultChecked />
                                      <span className="text-sm">Latest version</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                      <input type="radio" name={`version-${product.id}`} />
                                      <span className="text-sm">Specific version...</span>
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm">Language:</label>
                                  <Select defaultValue="english" className="mt-1">
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="english">English</SelectItem>
                                      <SelectItem value="french">French</SelectItem>
                                      <SelectItem value="german">German</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <button
                                  onClick={() => toggleSection(product.id, 'extensions')}
                                  className="flex items-center gap-2 text-sm font-medium"
                                >
                                  {expandedSections[`${product.id}-extensions`] ? 
                                    <ChevronDown className="w-4 h-4" /> : 
                                    <ChevronRight className="w-4 h-4" />
                                  }
                                  Extensions
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-6">
                <Button 
                  onClick={handleBackToLibrary}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleSavePackage({
                    name: editingPackage?.name || 'New Package',
                    type: 'install',
                    modified: new Date().toLocaleDateString(),
                    products: selectedProducts.length
                  })}
                  className="bg-foreground hover:bg-gray-800 text-background"
                >
                  Save package
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  return (
    <ToastProvider>
      <DemoWrapper 
        url="manage.autodesk.com/products/deployments"
        browserTheme="mac"
        showBackground={true}
      >
        <div className="h-full">
          {/* Simple header */}
          <header className="bg-foreground text-background">
            <div className="h-14 flex items-center px-6 border-b border-gray-800">
              <h1 className="text-sm font-medium tracking-wide">AUTODESK CUSTOM INSTALL</h1>
            </div>
          </header>

          {/* Main content */}
          <div className="p-6">
            {currentView === 'library' ? (
              <LibraryView />
            ) : (
              <EditorView />
            )}
          </div>
        </div>
      </DemoWrapper>
      <Toaster />
    </ToastProvider>
  );
}

export default App;