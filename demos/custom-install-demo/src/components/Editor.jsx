import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArrowLeft, AlertCircle, Download, Loader2 } from 'lucide-react';
import { useToast } from './use-toast';

const Editor = ({ editingPackage, onSave, onBack }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [packageName, setPackageName] = useState(editingPackage?.name || '');
  const [packageDescription, setPackageDescription] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deploymentType, setDeploymentType] = useState('install');
  const [installPath, setInstallPath] = useState('');
  const [installDesktopApp, setInstallDesktopApp] = useState(true);
  const [agreeTOS, setAgreeTOS] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const products = [
    { 
      id: 'autocad', 
      name: 'AutoCAD', 
      icon: '🅰️',
      version: '2020 Update 1',
      serial: 'Value',
      language: 'English',
      customizations: ['Custom Settings File Example Input', 'Extensions']
    },
    { 
      id: 'maya', 
      name: 'Maya', 
      icon: '🐍',
      version: '2020 Update 1',
      serial: 'Value',
      language: 'English',
      customizations: ['Maya Settings', 'Plugins', 'Scripts']
    },
    { 
      id: 'revit', 
      name: 'Revit', 
      icon: '🅱️',
      version: '2020 Update 1',
      serial: 'Value',
      language: 'English',
      customizations: ['Revit Templates', 'Families', 'Add-ins']
    },
    { 
      id: 'fusion360', 
      name: 'Fusion 360', 
      icon: '🅵',
      version: 'Latest',
      serial: 'Value',
      language: 'English',
      customizations: ['Cloud Settings', 'Extensions']
    },
    { 
      id: 'navisworks', 
      name: 'Navisworks', 
      icon: '🆖',
      version: '2020 Update 1',
      serial: 'Value',
      language: 'English',
      customizations: ['Clash Detection Rules', 'Appearance Profiles']
    },
    { 
      id: '3dsmax', 
      name: '3ds Max', 
      icon: '🅰️',
      version: '2020 Update 1',
      serial: 'Value',
      language: 'English',
      customizations: ['Render Settings', 'Scripts', 'Plugins']
    }
  ];

  const handleProductToggle = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleNext = () => {
    if (selectedProducts.length > 0) {
      setCurrentStep(2);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSave({
      name: packageName || 'Unnamed package',
      type: deploymentType,
      modified: new Date().toLocaleDateString(),
      products: selectedProducts.length,
      shared: false
    });

    toast({
      title: "Package saved",
      description: "Your package has been saved successfully.",
    });

    setIsSaving(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate download preparation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a text file explaining what would happen
    const content = `Autodesk Custom Install Package
================================

Package Name: ${packageName || 'Unnamed package'}
Created: ${new Date().toLocaleString()}
Type: ${deploymentType}

Selected Products:
${selectedProducts.map(id => {
  const product = products.find(p => p.id === id);
  return `- ${product.name} (${product.version})`;
}).join('\n')}

Installation Path: ${installPath || 'Default location'}

What would happen on the user's machine:
----------------------------------------
1. A small executable (.exe) file would be downloaded
2. When run, this executable would:
   - Connect to Autodesk servers
   - Download only the selected products
   - Apply all customizations automatically
   - Install to the specified path
   - Configure licensing based on your account

This approach saves bandwidth and ensures users always get
the latest versions with your exact configuration.

For more information, visit:
https://knowledge.autodesk.com/custom-install`;

    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-install-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download ready",
      description: "Your installer package information has been downloaded.",
    });

    setIsDownloading(false);
    
    // Navigate back to library after download
    setTimeout(() => {
      onSave({
        name: packageName || 'Unnamed package',
        type: deploymentType,
        modified: new Date().toLocaleDateString(),
        products: selectedProducts.length,
        shared: false
      });
    }, 500);
  };

  return (
    <div className="h-full flex">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-normal text-gray-800">
            {editingPackage ? packageName : 'Unnamed package'}
          </h1>
        </div>

        <div className="flex gap-6 h-full">
          {/* Left Panel - Stepper */}
          <div className="w-80 bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className={`border rounded-lg p-4 ${currentStep === 1 ? 'border-[#0092e0] bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === 1 ? 'bg-[#0092e0] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <h3 className="font-medium">Add products</h3>
                </div>
                
                <div className="mb-4">
                  <label className="text-sm text-gray-600 mb-2 block">License type:</label>
                  <Select defaultValue="autodesk-id">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="autodesk-id">Autodesk ID</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                      <SelectItem value="standalone">Standalone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {products.map(product => (
                    <label key={product.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleProductToggle(product.id)}
                      />
                      <span className="text-2xl">{product.icon}</span>
                      <span className="text-sm">{product.name}</span>
                    </label>
                  ))}
                </div>

                <Button 
                  className="w-full mt-4 bg-[#0092e0] hover:bg-[#0077b8]" 
                  onClick={handleNext}
                  disabled={selectedProducts.length === 0}
                >
                  Next
                </Button>
              </div>

              <div className={`border rounded-lg p-4 ${currentStep === 2 ? 'border-[#0092e0] bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === 2 ? 'bg-[#0092e0] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <h3 className="font-medium">Enter package details</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {currentStep === 1 ? (
              <div>
                <h2 className="text-lg font-medium mb-4">Product name</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Select products to add to the package. Only products with the same license type can be added.
                </p>

                {selectedProducts.length > 0 && (
                  <div className="space-y-4">
                    {selectedProducts.map(productId => {
                      const product = products.find(p => p.id === productId);
                      return (
                        <div key={productId} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">{product.icon}</span>
                            <div className="flex-1">
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-gray-600">%SELECTEDVERSION%</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="text-sm text-gray-600">Version to install:</label>
                              <div className="flex items-center gap-2 mt-1">
                                <input type="radio" name={`version-${productId}`} defaultChecked />
                                <span className="text-sm">Latest</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <input type="radio" name={`version-${productId}`} />
                                <span className="text-sm">Specific</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Serial number:</label>
                              <Select defaultValue="value">
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="value">Value</SelectItem>
                                  <SelectItem value="12711">12711</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {product.customizations && (
                            <Accordion type="single" collapsible className="border-t">
                              <AccordionItem value="customizations" className="border-0">
                                <AccordionTrigger className="hover:no-underline">
                                  <span className="text-sm font-medium">Customizations</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3 pt-2">
                                    {product.customizations.map((custom, idx) => (
                                      <div key={idx}>
                                        <label className="text-sm text-gray-600">{custom}:</label>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Input placeholder="Filename.xml" className="flex-1" />
                                          <Button variant="outline" size="sm">Browse</Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-medium mb-6">Deployment summary</h2>
                
                <div className="space-y-6">
                  {selectedProducts.map(productId => {
                    const product = products.find(p => p.id === productId);
                    return (
                      <div key={productId} className="flex items-start gap-3">
                        <span className="text-2xl">{product.icon}</span>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">%SELECTEDVERSION%</p>
                          <button className="text-sm text-[#0092e0] hover:underline">What's included</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t mt-6 pt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Package name:</label>
                    <Input 
                      value={packageName} 
                      onChange={(e) => setPackageName(e.target.value)}
                      placeholder="My Custom Package"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">Package description (optional):</label>
                    <textarea 
                      className="w-full border rounded-md p-3 text-sm"
                      rows={3}
                      value={packageDescription}
                      onChange={(e) => setPackageDescription(e.target.value)}
                      placeholder="Install will generate an installer you can run to complete installation."
                    />
                  </div>

                  <div>
                    <div className="flex gap-4 mb-4">
                      <Button 
                        variant={deploymentType === 'install' ? 'default' : 'outline'}
                        onClick={() => setDeploymentType('install')}
                      >
                        Install
                      </Button>
                      <Button 
                        variant={deploymentType === 'deploy' ? 'default' : 'outline'}
                        onClick={() => setDeploymentType('deploy')}
                      >
                        Deploy
                      </Button>
                      <span className="text-sm text-gray-500 self-center">
                        Create a package of products to install on your own device.
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium block mb-2">Package licensing:</label>
                        <Button variant="outline" size="sm">Edit license server...</Button>
                      </div>

                      <div>
                        <label className="text-sm font-medium block mb-2">Installation path:</label>
                        <Input 
                          placeholder="The location to store deployment image files"
                          value={installPath}
                          onChange={(e) => setInstallPath(e.target.value)}
                        />
                      </div>

                      <label className="flex items-center gap-2">
                        <Checkbox 
                          checked={installDesktopApp}
                          onCheckedChange={setInstallDesktopApp}
                        />
                        <span className="text-sm">Install Autodesk desktop app</span>
                        <span className="text-xs text-gray-500">Lorem ipsum dolor sit amet</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <Checkbox 
                          checked={agreeTOS}
                          onCheckedChange={setAgreeTOS}
                        />
                        <span className="text-sm">I agree to the Terms of use</span>
                      </label>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save for later
                      </Button>
                      <Button 
                        className="bg-[#0092e0] hover:bg-[#0077b8]"
                        onClick={handleDownload}
                        disabled={isDownloading}
                      >
                        {isDownloading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Download
                      </Button>
                    </div>

                    {(isSaving || isDownloading) && (
                      <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isSaving ? 'Saving installer...' : 'Preparing download...'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;