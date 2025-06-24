import React, { useState } from 'react';
import BrowserChrome from './components/BrowserChrome';
import AutodeskHeader from './components/AutodeskHeader';
import Sidebar from './components/Sidebar';
import Library from './components/Library';
import Editor from './components/Editor';
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

  return (
    <ToastProvider>
      <div className="makers-marks" />
      <div className="min-h-screen flex items-center justify-center p-8">
        <BrowserChrome>
          <AutodeskHeader />
          <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 bg-[#f5f6f7]">
              {currentView === 'library' ? (
                <Library 
                  packages={packages}
                  onCreateNew={handleCreateNew}
                  onEditPackage={handleEditPackage}
                  onDuplicatePackage={handleDuplicatePackage}
                  onDeletePackage={handleDeletePackage}
                  onRenamePackage={handleRenamePackage}
                />
              ) : (
                <Editor 
                  editingPackage={editingPackage}
                  onSave={handleSavePackage}
                  onBack={handleBackToLibrary}
                />
              )}
            </main>
          </div>
        </BrowserChrome>
      </div>
      <Toaster />
    </ToastProvider>
  );
}

export default App;