import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Search, Grid3X3, List, Plus, Copy, Trash2, Edit3, Download, Users } from 'lucide-react';

const Library = ({ packages, onCreateNew, onEditPackage, onDuplicatePackage, onDeletePackage, onRenamePackage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [hoveredPackage, setHoveredPackage] = useState(null);
  const [editingName, setEditingName] = useState(null);
  const [tempName, setTempName] = useState('');

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartRename = (pkg) => {
    setEditingName(pkg.id);
    setTempName(pkg.name);
  };

  const handleSaveRename = (id) => {
    onRenamePackage(id, tempName);
    setEditingName(null);
  };

  const handleCancelRename = () => {
    setEditingName(null);
    setTempName('');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-normal text-gray-800">Custom Install</h1>
        <Button onClick={onCreateNew} className="bg-[#0092e0] hover:bg-[#0077b8]">
          <Plus className="w-4 h-4 mr-2" />
          Create new
        </Button>
      </div>

      <p className="text-gray-600 mb-6">
        Create a new package, or start from a saved package below to get started.
      </p>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-gray-100' : ''}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-gray-100' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="owned" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0092e0] px-6 py-3"
            >
              Owned Team
            </TabsTrigger>
            <TabsTrigger 
              value="shared" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0092e0] px-6 py-3"
            >
              Shared with me
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owned" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-4 font-medium text-gray-600 text-sm">Package Name</th>
                    <th className="p-4 font-medium text-gray-600 text-sm">Type</th>
                    <th className="p-4 font-medium text-gray-600 text-sm">Modified</th>
                    <th className="p-4 font-medium text-gray-600 text-sm">Products ↓</th>
                    <th className="p-4 font-medium text-gray-600 text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr 
                      key={pkg.id} 
                      className="border-b hover:bg-gray-50 group relative"
                      onMouseEnter={() => setHoveredPackage(pkg.id)}
                      onMouseLeave={() => setHoveredPackage(null)}
                    >
                      <td className="p-4">
                        {editingName === pkg.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(pkg.id);
                                if (e.key === 'Escape') handleCancelRename();
                              }}
                              className="h-8"
                              autoFocus
                            />
                            <Button size="sm" onClick={() => handleSaveRename(pkg.id)}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={handleCancelRename}>Cancel</Button>
                          </div>
                        ) : (
                          <span 
                            className="cursor-pointer hover:text-[#0092e0] hover:underline"
                            onClick={() => handleStartRename(pkg)}
                          >
                            {pkg.name}
                          </span>
                        )}
                        <div className="text-xs text-gray-500 mt-1">Package contents:</div>
                        <div className="text-xs text-gray-600">
                          {pkg.name.split(',').slice(0, 3).join(', ')}...
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{pkg.type}</td>
                      <td className="p-4 text-gray-600">{pkg.modified}</td>
                      <td className="p-4 text-gray-600">{pkg.products}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 justify-end">
                          {hoveredPackage === pkg.id && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onDuplicatePackage(pkg)}
                                title="Duplicate"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onDeletePackage(pkg.id)}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Assign"
                              >
                                <Users className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditPackage(pkg)}
                          >
                            Edit →
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="shared" className="mt-0 p-8 text-center text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No packages have been shared with you yet.</p>
            <p className="text-sm mt-2">When team members share packages with you, they'll appear here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Library;