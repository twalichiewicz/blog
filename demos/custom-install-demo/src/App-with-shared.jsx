import React, { useState } from 'react';
import { DemoWrapper } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import AutodeskHeader from './components/AutodeskHeader';
import Sidebar from './components/Sidebar';
import Library from './components/Library';
import Editor from './components/Editor';
import { ToastProvider } from './components/ui/toast';
import { Toaster } from './components/Toaster';

function App() {
  const [currentView, setCurrentView] = useState('library');
  const [packages, setPackages] = useState([
    {
      id: '1',
      name: 'Fusion 360, BIM360, Civil 3D, AutoCAD, 3dsMax, Maya',
      type: 'deployment',
      modified: '03/03/2020',
      products: 20,
      shared: false
    },
    // ... other packages
  ]);
  const [editingPackage, setEditingPackage] = useState(null);

  // ... all the handler functions remain the same

  return (
    <ToastProvider>
      <DemoWrapper url="manage.autodesk.com/products/custom-install">
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
      </DemoWrapper>
      <Toaster />
    </ToastProvider>
  );
}

export default App;