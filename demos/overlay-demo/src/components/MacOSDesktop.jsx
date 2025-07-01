import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MacOSDesktop.css';
import TWDesignLogo from '../assets/TWDesignLogo.svg';
import overlayWallpaper from '../assets/overlayWallpaper.svg';
import finderIcon from '../assets/finder.png';
import SteamOverlay from './SteamOverlay';

const applications = [
  {
    id: 'fusion',
    name: 'Autodesk Fusion 2025',
    icon: '🔧',
    color: '#FF6B00',
    content: 'CAD/CAM/CAE',
    window: { x: 50, y: 80, width: 700, height: 500 },
    theme: {
      titlebar: '#E5E5E5',
      background: '#f0f0f0',
      ribbon: '#f8f8f8',
      ribbonTab: '#ffffff',
      ribbonTabActive: '#0078d4',
      tools: '#ffffff',
      toolHover: '#e1e1e1',
      text: '#323130',
      textActive: '#ffffff',
      border: '#d2d0ce',
      panel: '#faf9f8',
      panelHeader: '#f3f2f1'
    }
  },
  {
    id: 'autocad',
    name: 'Autodesk AutoCAD 2025',
    filename: 'Drawing1.dwg',
    icon: '📐',
    color: '#E51937',
    content: '2D/3D Design',
    window: { x: 300, y: 150, width: 750, height: 550 },
    theme: {
      titlebar: '#E5E5E5',
      background: '#1e2832', // Dark navy
      ribbon: '#243441', // Slightly lighter navy
      ribbonTab: '#2c3e50',
      ribbonTabActive: '#0078d4',
      tools: '#34495e',
      toolHover: '#4a5f7a',
      text: '#ecf0f1',
      textActive: '#ffffff',
      border: '#34495e',
      panel: '#243441',
      panelHeader: '#2c3e50'
    }
  },
  {
    id: 'revit',
    name: 'Revit 2025',
    icon: '🏗️',
    color: '#0696D7',
    content: 'BIM Software',
    window: { x: 150, y: 250, width: 800, height: 600 },
    theme: {
      titlebar: '#E5E5E5',
      background: '#f0f0f0',
      ribbon: '#f8f8f8',
      ribbonTab: '#ffffff',
      ribbonTabActive: '#0078d4',
      tools: '#ffffff',
      toolHover: '#e1e1e1',
      text: '#323130',
      textActive: '#ffffff',
      border: '#d2d0ce',
      panel: '#faf9f8',
      panelHeader: '#f3f2f1'
    }
  }
];

function MacOSDesktop({ activeApp, setActiveApp, overlayActive, toggleOverlay }) {
  const [windowStates, setWindowStates] = React.useState({
    fusion: { 
      visible: false, 
      minimized: false,
      maximized: false,
      position: { x: 50, y: 80 }, 
      size: { width: 600, height: 400 },
      previousPosition: null,
      previousSize: null
    },
    autocad: { 
      visible: true, 
      minimized: false,
      maximized: false,
      position: { x: 300, y: 150 }, 
      size: { width: 650, height: 450 },
      previousPosition: null,
      previousSize: null
    },
    revit: { 
      visible: true, 
      minimized: false,
      maximized: false,
      position: { x: 150, y: 250 }, 
      size: { width: 700, height: 480 },
      previousPosition: null,
      previousSize: null
    }
  });
  
  const [windowZOrder, setWindowZOrder] = React.useState(['fusion', 'autocad', 'revit']);
  const [isDesktopActive, setIsDesktopActive] = React.useState(false);
  const desktopRef = React.useRef(null);

  const toggleWindow = (appId) => {
    const wasMinimized = windowStates[appId].minimized;
    const wasVisible = windowStates[appId].visible;
    
    if (!wasVisible && !wasMinimized) {
      // Window is closed, open it
      setWindowStates(prev => ({
        ...prev,
        [appId]: {
          ...prev[appId],
          visible: true,
          minimized: false
        }
      }));
      setActiveApp(appId);
      bringToFront(appId);
      setIsDesktopActive(false);
    } else if (wasMinimized) {
      // Restore from minimized
      setWindowStates(prev => ({
        ...prev,
        [appId]: {
          ...prev[appId],
          visible: true,
          minimized: false
        }
      }));
      setActiveApp(appId);
      bringToFront(appId);
      setIsDesktopActive(false);
    } else if (wasVisible && activeApp === appId) {
      // Minimize if clicking on active window's dock icon
      minimizeWindow(appId);
    } else if (wasVisible) {
      // Just bring to front if already visible but not active
      setActiveApp(appId);
      bringToFront(appId);
      setIsDesktopActive(false);
    }
  };
  
  const minimizeWindow = (appId) => {
    setWindowStates(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        minimized: true,
        visible: false
      }
    }));
    
    // Switch to next visible window or desktop
    const visibleWindows = windowZOrder.filter(id => 
      id !== appId && windowStates[id].visible && !windowStates[id].minimized
    );
    
    if (visibleWindows.length > 0) {
      setActiveApp(visibleWindows[visibleWindows.length - 1]);
    } else {
      setActiveApp('finder');
      setIsDesktopActive(true);
    }
  };
  
  const maximizeWindow = (appId) => {
    const desktop = desktopRef.current;
    if (!desktop) return;
    
    const isMaximized = windowStates[appId].maximized;
    
    if (isMaximized) {
      // Restore window
      setWindowStates(prev => ({
        ...prev,
        [appId]: {
          ...prev[appId],
          maximized: false,
          position: prev[appId].previousPosition || prev[appId].position,
          size: prev[appId].previousSize || prev[appId].size
        }
      }));
    } else {
      // Maximize window
      const desktopRect = desktop.getBoundingClientRect();
      setWindowStates(prev => ({
        ...prev,
        [appId]: {
          ...prev[appId],
          maximized: true,
          previousPosition: prev[appId].position,
          previousSize: prev[appId].size,
          position: { x: 0, y: 0 },
          size: { width: desktopRect.width - 20, height: desktopRect.height - 90 }
        }
      }));
    }
  };
  
  const closeWindow = (appId) => {
    setWindowStates(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        visible: false,
        minimized: false
      }
    }));
    
    // Switch to next visible window or desktop
    const visibleWindows = windowZOrder.filter(id => 
      id !== appId && windowStates[id].visible && !windowStates[id].minimized
    );
    
    if (visibleWindows.length > 0) {
      setActiveApp(visibleWindows[visibleWindows.length - 1]);
    } else {
      setActiveApp('finder');
      setIsDesktopActive(true);
    }
  };

  const updateWindowPosition = (appId, newPosition) => {
    setWindowStates(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        position: newPosition
      }
    }));
  };
  
  const updateWindowSize = (appId, newSize) => {
    setWindowStates(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        size: newSize
      }
    }));
  };
  
  const bringToFront = (appId) => {
    setWindowZOrder(prev => {
      const filtered = prev.filter(id => id !== appId);
      return [...filtered, appId];
    });
  };
  
  const handleWindowClick = (appId) => {
    setActiveApp(appId);
    bringToFront(appId);
    setIsDesktopActive(false);
  };
  
  const handleDesktopClick = (e) => {
    if (e.target.classList.contains('desktop-area')) {
      setActiveApp('finder');
      setIsDesktopActive(true);
    }
  };
  
  const handleResize = (e, appId, direction, windowState) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowState.size.width;
    const startHeight = windowState.size.height;
    const startPosX = windowState.position.x;
    const startPosY = windowState.position.y;
    
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;
      
      // Handle different resize directions
      switch (direction) {
        case 'br': // bottom-right
          newWidth = Math.max(400, startWidth + deltaX);
          newHeight = Math.max(300, startHeight + deltaY);
          break;
        case 'bl': // bottom-left
          newWidth = Math.max(400, startWidth - deltaX);
          newHeight = Math.max(300, startHeight + deltaY);
          newX = startPosX + deltaX;
          break;
        case 'tr': // top-right
          newWidth = Math.max(400, startWidth + deltaX);
          newHeight = Math.max(300, startHeight - deltaY);
          newY = startPosY + deltaY;
          break;
        case 'tl': // top-left
          newWidth = Math.max(400, startWidth - deltaX);
          newHeight = Math.max(300, startHeight - deltaY);
          newX = startPosX + deltaX;
          newY = startPosY + deltaY;
          break;
        case 't': // top
          newHeight = Math.max(300, startHeight - deltaY);
          newY = startPosY + deltaY;
          break;
        case 'b': // bottom
          newHeight = Math.max(300, startHeight + deltaY);
          break;
        case 'l': // left
          newWidth = Math.max(400, startWidth - deltaX);
          newX = startPosX + deltaX;
          break;
        case 'r': // right
          newWidth = Math.max(400, startWidth + deltaX);
          break;
      }
      
      // Apply constraints to keep window in bounds
      const desktop = desktopRef.current;
      if (desktop) {
        const desktopRect = desktop.getBoundingClientRect();
        
        // Ensure window doesn't go off-screen
        newX = Math.max(0, Math.min(newX, desktopRect.width - newWidth));
        newY = Math.max(0, Math.min(newY, desktopRect.height - newHeight));
        
        // If position changed due to left/top resize, update it
        if (newX !== startPosX || newY !== startPosY) {
          updateWindowPosition(appId, { x: newX, y: newY });
        }
      }
      
      updateWindowSize(appId, { width: newWidth, height: newHeight });
    };
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  return (
    <div className="macos-desktop">
      {/* Menu Bar */}
      <div className="macos-menubar">
        <div className="menubar-left">
          <img src={TWDesignLogo} alt="TW Design" className="tw-logo" />
          <span className="menubar-app">{activeApp === 'finder' ? 'Finder' : applications.find(app => app.id === activeApp)?.name || 'Finder'}</span>
          {activeApp === 'revit' ? (
            <>
              <span className="menubar-item">File</span>
              <span className="menubar-item">Edit</span>
              <span className="menubar-item">View</span>
              <span className="menubar-item">Modeling</span>
              <span className="menubar-item">Drafting</span>
              <span className="menubar-item">Site</span>
              <span className="menubar-item">Collaborate</span>
              <span className="menubar-item">Analyze</span>
              <span className="menubar-item">Steel</span>
              <span className="menubar-item">Precast</span>
              <span className="menubar-item">Manage</span>
              <span className="menubar-item">Add-Ins</span>
            </>
          ) : (
            <>
              <span className="menubar-item">File</span>
              <span className="menubar-item">Edit</span>
              <span className="menubar-item">View</span>
              <span className="menubar-item">Tools</span>
            </>
          )}
        </div>
        <div className="menubar-right">
          <span className="menubar-time">9:41 AM</span>
        </div>
      </div>

      {/* Desktop with Application Windows */}
      <div className="desktop-area" ref={desktopRef} onClick={handleDesktopClick}>
        {applications.map((app, index) => {
          const windowState = windowStates[app.id];
          if (!windowState.visible) return null;
          
          return (
            <div
              key={app.id}
              className={`app-window ${activeApp === app.id ? 'active' : ''} ${overlayActive[app.id] ? 'dimmed' : ''} ${windowState.maximized ? 'maximized' : ''}`}
              data-app={app.id}
              style={{
                position: 'absolute',
                left: windowState.position.x,
                top: windowState.position.y,
                width: windowState.size.width,
                height: windowState.size.height,
                zIndex: windowZOrder.indexOf(app.id) + 1
              }}
              onClick={() => handleWindowClick(app.id)}
            >
            <div 
              className={`window-titlebar ${overlayActive[app.id] ? 'overlay-active' : ''}`} 
              onMouseDown={(e) => {
                if (windowState.maximized) return;
                
                e.preventDefault();
                handleWindowClick(app.id);
                
                const desktop = desktopRef.current;
                if (!desktop) return;
                
                const desktopRect = desktop.getBoundingClientRect();
                
                // Calculate offset between mouse and window position in desktop space
                const mouseXInDesktop = e.clientX - desktopRect.left;
                const mouseYInDesktop = e.clientY - desktopRect.top;
                const offsetX = mouseXInDesktop - windowState.position.x;
                const offsetY = mouseYInDesktop - windowState.position.y;
                
                const handleMouseMove = (e) => {
                  const currentDesktopRect = desktop.getBoundingClientRect();
                  
                  // Convert mouse position to desktop space
                  const mouseXInDesktop = e.clientX - currentDesktopRect.left;
                  const mouseYInDesktop = e.clientY - currentDesktopRect.top;
                  
                  // Calculate new window position
                  let newX = mouseXInDesktop - offsetX;
                  let newY = mouseYInDesktop - offsetY;
                  
                  // Apply constraints - allow window to be dragged mostly off screen
                  const maxX = currentDesktopRect.width - windowState.size.width;
                  const maxY = currentDesktopRect.height - 32; // Only titlebar (32px) needs to stay visible
                  
                  newX = Math.max(0, Math.min(newX, maxX));
                  newY = Math.max(0, Math.min(newY, maxY)); // Allow dragging until only titlebar is visible
                  
                  updateWindowPosition(app.id, { x: newX, y: newY });
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                  document.body.style.cursor = '';
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = 'grabbing';
              }}
            >
              <div className="window-controls">
                <span 
                  className="window-control close" 
                  onClick={(e) => {
                    e.stopPropagation();
                    closeWindow(app.id);
                  }}
                  title="Close"
                ></span>
                <span 
                  className="window-control minimize" 
                  onClick={(e) => {
                    e.stopPropagation();
                    minimizeWindow(app.id);
                  }}
                  title="Minimize"
                ></span>
                <span 
                  className="window-control maximize" 
                  onClick={(e) => {
                    e.stopPropagation();
                    maximizeWindow(app.id);
                  }}
                  title={windowState.maximized ? "Restore" : "Maximize"}
                ></span>
              </div>
              <div className="window-title" style={{ 
                color: overlayActive[app.id] ? '#ffffff' : '#323130'
              }}>
                {app.name}{app.filename ? ` - [${app.filename}]` : ''}
              </div>
              <div className="window-actions">
                <button className="overlay-trigger" onClick={(e) => {
                  e.stopPropagation();
                  toggleOverlay(app.id);
                }}>
                  Overlay
                </button>
                {app.id === 'autocad' && (
                  <button className="profile-button" onClick={(e) => e.stopPropagation()}>
                    <span className="profile-avatar">👤</span>
                    <span className="profile-name">User</span>
                  </button>
                )}
              </div>
            </div>
            <div className="window-content" style={{ background: app.theme.background, position: 'relative' }}>
              {/* Top Ribbon */}
              {app.id === 'revit' ? (
                <>
                  {/* Revit Tab Bar */}
                  <div className="revit-tabs">
                    <div className="revit-tab">File</div>
                    <div className="revit-tab active">Architecture</div>
                    <div className="revit-tab">Structure</div>
                    <div className="revit-tab">Steel</div>
                    <div className="revit-tab">Precast</div>
                    <div className="revit-tab">Systems</div>
                    <div className="revit-tab">Insert</div>
                    <div className="revit-tab">Annotate</div>
                    <div className="revit-tab">Analyze</div>
                    <div className="revit-tab">Massing & Site</div>
                    <div className="revit-tab">Collaborate</div>
                    <div className="revit-tab">View</div>
                    <div className="revit-tab">Manage</div>
                    <div className="revit-tab">Add-ins</div>
                    <div className="revit-tab">Modify</div>
                  </div>
                  {/* Revit Ribbon */}
                  <div className="revit-ribbon">
                    <div className="revit-ribbon-sections">
                      <div className="revit-section">
                        <div className="revit-section-content">
                          <div className="revit-section-tools">
                            <div className="revit-tool-row">
                              <div className="revit-tool compact">
                                <span className="tool-icon">🏗️</span>
                                <span className="tool-label">Wall</span>
                              </div>
                              <div className="revit-tool compact">
                                <span className="tool-icon">🚪</span>
                                <span className="tool-label">Door</span>
                              </div>
                              <div className="revit-tool compact">
                                <span className="tool-icon">🪟</span>
                                <span className="tool-label">Window</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="revit-section-label">
                          Build <span className="accordion-arrow">▼</span>
                        </div>
                      </div>
                      <div className="revit-section">
                        <div className="revit-section-content">
                          <div className="revit-section-tools">
                            <div className="revit-tool-row">
                              <div className="revit-tool">
                                <span className="tool-icon">⬜</span>
                                <span className="tool-label">Floor</span>
                              </div>
                              <div className="revit-tool">
                                <span className="tool-icon">⬛</span>
                                <span className="tool-label">Ceiling</span>
                              </div>
                              <div className="revit-tool">
                                <span className="tool-icon">🔺</span>
                                <span className="tool-label">Roof</span>
                              </div>
                            </div>
                            <div className="revit-tool-row">
                              <div className="revit-tool">
                                <span className="tool-icon">🏛️</span>
                                <span className="tool-label">Column</span>
                              </div>
                              <div className="revit-tool">
                                <span className="tool-icon">📏</span>
                                <span className="tool-label">Beam</span>
                              </div>
                              <div className="revit-tool">
                                <span className="tool-icon">🔲</span>
                                <span className="tool-label">Slab</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="revit-section-label">
                          Structure <span className="accordion-arrow">▼</span>
                        </div>
                      </div>
                      <div className="revit-section">
                        <div className="revit-section-content">
                          <div className="revit-section-tools">
                            <div className="revit-tool-row">
                              <div className="revit-tool compact">
                                <span className="tool-icon">🏠</span>
                                <span className="tool-label">Component</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="revit-section-label">
                          Component <span className="accordion-arrow">▼</span>
                        </div>
                      </div>
                      <div className="revit-section">
                        <div className="revit-section-content">
                          <div className="revit-section-tools">
                            <div className="revit-tool-row">
                              <div className="revit-tool">
                                <span className="tool-icon">🚶</span>
                                <span className="tool-label">Stair</span>
                              </div>
                              <div className="revit-tool">
                                <span className="tool-icon">♿</span>
                                <span className="tool-label">Ramp</span>
                              </div>
                            </div>
                            <div className="revit-tool-row">
                              <div className="revit-tool">
                                <span className="tool-icon">🛡️</span>
                                <span className="tool-label">Railing</span>
                              </div>
                              <div className="revit-tool">
                                <span className="tool-icon">⬆️</span>
                                <span className="tool-label">Shaft</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="revit-section-label">
                          Circulation <span className="accordion-arrow">▼</span>
                        </div>
                      </div>
                      <div className="revit-section">
                        <div className="revit-section-content">
                          <div className="revit-section-tools">
                            <div className="revit-tool-row">
                              <div className="revit-tool compact">
                                <span className="tool-icon">🏗️</span>
                                <span className="tool-label">Room</span>
                              </div>
                              <div className="revit-tool compact">
                                <span className="tool-icon">📐</span>
                                <span className="tool-label">Area</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="revit-section-label">
                          Room & Area <span className="accordion-arrow">▼</span>
                        </div>
                      </div>
                      <div className="revit-section">
                        <div className="revit-section-content">
                          <div className="revit-section-tools">
                            <div className="revit-tool-row">
                              <div className="revit-tool">
                                <span className="tool-icon">📏</span>
                                <span className="tool-label">Model Line</span>
                              </div>
                              <div className="revit-tool">
                                <span className="tool-icon">📝</span>
                                <span className="tool-label">Model Text</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="revit-section-label">
                          Model <span className="accordion-arrow">▼</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
              <div className="app-ribbon" style={{ background: app.theme.ribbon, borderColor: app.theme.border }}>
                <div className="ribbon-tabs" style={{ background: app.theme.border }}>
                  {app.id === 'fusion' && (
                    <>
                      <div className="ribbon-tab active" style={{ background: app.theme.ribbonTabActive, color: app.theme.textActive }}>SOLID</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>SURFACE</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>MESH</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>SHEET METAL</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>PLASTIC</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>UTILITIES</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>MANAGE</div>
                    </>
                  )}
                  {app.id === 'autocad' && (
                    <>
                      <div className="ribbon-tab active" style={{ background: app.theme.ribbonTabActive, color: app.theme.textActive }}>HOME</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>INSERT</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>ANNOTATE</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>PARAMETRIC</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>VIEW</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>MANAGE</div>
                      <div className="ribbon-tab" style={{ background: app.theme.ribbonTab, color: app.theme.text }}>OUTPUT</div>
                    </>
                  )}
                  {app.id === 'revit' && null}
                </div>
                <div className="ribbon-tools" style={{ background: app.theme.ribbon }}>
                  {app.id === 'fusion' && (
                    <div className="fusion-ribbon-tools">
                      <div className="fusion-workspace-dropdown">
                        <select style={{ 
                          background: app.theme.ribbonTabActive, 
                          color: app.theme.textActive, 
                          border: 'none', 
                          padding: '20px 16px', 
                          fontSize: '12px',
                          fontWeight: '600',
                          borderRadius: '0',
                          height: '100%',
                          cursor: 'pointer'
                        }}>
                          <option>DESIGN ∨</option>
                          <option>RENDER ∨</option>
                          <option>ANIMATION ∨</option>
                          <option>SIMULATION ∨</option>
                          <option>MANUFACTURE ∨</option>
                          <option>DRAWING ∨</option>
                        </select>
                      </div>
                      <div className="fusion-tool-groups">
                        <div className="fusion-tool-group">
                          <div className="fusion-group-label">CREATE ∨</div>
                          <div className="fusion-tool-buttons">
                            <div className="fusion-tool-button" style={{ background: app.theme.tools, color: app.theme.text }}>
                              <div className="tool-icon">📦</div>
                              <div className="tool-name">Box</div>
                            </div>
                            <div className="fusion-tool-button" style={{ background: app.theme.tools, color: app.theme.text }}>
                              <div className="tool-icon">🔧</div>
                              <div className="tool-name">Sketch</div>
                            </div>
                          </div>
                        </div>
                        <div className="fusion-tool-group">
                          <div className="fusion-group-label">MODIFY ∨</div>
                          <div className="fusion-tool-buttons">
                            <div className="fusion-tool-button" style={{ background: app.theme.tools, color: app.theme.text }}>
                              <div className="tool-icon">⬆️</div>
                              <div className="tool-name">Extrude</div>
                            </div>
                            <div className="fusion-tool-button" style={{ background: app.theme.tools, color: app.theme.text }}>
                              <div className="tool-icon">🔄</div>
                              <div className="tool-name">Revolve</div>
                            </div>
                          </div>
                        </div>
                        <div className="fusion-tool-group">
                          <div className="fusion-group-label">ASSEMBLE ∨</div>
                          <div className="fusion-tool-buttons">
                            <div className="fusion-tool-button" style={{ background: app.theme.tools, color: app.theme.text }}>
                              <div className="tool-icon">🔗</div>
                              <div className="tool-name">Joint</div>
                            </div>
                          </div>
                        </div>
                        <div className="fusion-tool-group">
                          <div className="fusion-group-label">CONFIGURE ∨</div>
                          <div className="fusion-tool-buttons">
                            <div className="fusion-tool-button" style={{ background: app.theme.tools, color: app.theme.text }}>
                              <div className="tool-icon">⚙️</div>
                              <div className="tool-name">Params</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {app.id === 'autocad' && (
                    <>
                      <div className="tool-section">
                        <div className="section-label">DRAW</div>
                        <div className="tool-group-vertical">
                          <div className="tool-row">
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Line</div>
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Polyline</div>
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Circle</div>
                          </div>
                          <div className="tool-row">
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Arc</div>
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Rectangle</div>
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Polygon</div>
                          </div>
                        </div>
                      </div>
                      <div className="tool-section">
                        <div className="section-label">MODIFY</div>
                        <div className="tool-group-vertical">
                          <div className="tool-row">
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Move</div>
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Copy</div>
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Rotate</div>
                          </div>
                          <div className="tool-row">
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Scale</div>
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Trim</div>
                            <div className="tool-item-text" style={{ background: app.theme.tools, color: app.theme.text }}>Extend</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {app.id === 'revit' && null}
                </div>
              </div>
              )}
              
              {/* Main Content Area */}
              {app.id === 'revit' ? (
                <div className="revit-panels">
                  {/* Left Panel - Project Browser */}
                  <div className="revit-panel" style={{ width: '200px' }}>
                    <div className="revit-panel-titlebar">
                      <span className="revit-panel-title">Project Browser</span>
                      <button className="revit-panel-close">×</button>
                    </div>
                    <div className="revit-panel-content">
                      <div className="revit-browser">
                        <div className="revit-browser-item">
                          <span className="revit-browser-icon">📁</span> Views (all)
                        </div>
                        <div className="revit-browser-item indent">
                          <span className="revit-browser-icon">📐</span> Floor Plans
                        </div>
                        <div className="revit-browser-item indent-2 selected">
                          <span className="revit-browser-icon">📄</span> Level 1
                        </div>
                        <div className="revit-browser-item indent-2">
                          <span className="revit-browser-icon">📄</span> Level 2
                        </div>
                        <div className="revit-browser-item indent-2">
                          <span className="revit-browser-icon">📄</span> Roof
                        </div>
                        <div className="revit-browser-item indent">
                          <span className="revit-browser-icon">📊</span> Elevations
                        </div>
                        <div className="revit-browser-item indent-2">
                          <span className="revit-browser-icon">📄</span> North
                        </div>
                        <div className="revit-browser-item indent-2">
                          <span className="revit-browser-icon">📄</span> South
                        </div>
                        <div className="revit-browser-item indent-2">
                          <span className="revit-browser-icon">📄</span> East
                        </div>
                        <div className="revit-browser-item indent-2">
                          <span className="revit-browser-icon">📄</span> West
                        </div>
                        <div className="revit-browser-item indent">
                          <span className="revit-browser-icon">🏗️</span> 3D Views
                        </div>
                        <div className="revit-browser-item indent-2">
                          <span className="revit-browser-icon">📄</span> {'{3D}'} Default
                        </div>
                        <div className="revit-browser-item indent">
                          <span className="revit-browser-icon">📋</span> Schedules/Quantities
                        </div>
                        <div className="revit-browser-item indent">
                          <span className="revit-browser-icon">🏛️</span> Families
                        </div>
                        <div className="revit-browser-item indent">
                          <span className="revit-browser-icon">🎨</span> Sheets
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Center - Viewport */}
                  <div className="canvas-area" style={{ flex: 1, background: '#f8f8f8' }}>
                    <div className="viewport">
                      <div className="building-preview">
                        <div className="building-model">🏢</div>
                        <div className="viewport-info">Level 1 - Floor Plan</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Panel - Properties */}
                  <div className="revit-panel" style={{ width: '220px' }}>
                    <div className="revit-panel-titlebar">
                      <span className="revit-panel-title">Properties</span>
                      <button className="revit-panel-close">×</button>
                    </div>
                    <div className="revit-panel-content">
                      <div className="revit-properties">
                        <div className="revit-property-category">
                          <div className="revit-property-header">Identity Data</div>
                          <div className="revit-property">
                            <span className="revit-property-label">Type:</span>
                            <select className="revit-property-value">
                              <option>Basic Wall : Generic - 8"</option>
                            </select>
                          </div>
                          <div className="revit-property">
                            <span className="revit-property-label">Family:</span>
                            <input className="revit-property-value" value="Basic Wall" readOnly />
                          </div>
                          <div className="revit-property">
                            <span className="revit-property-label">Type Mark:</span>
                            <input className="revit-property-value" value="" placeholder="<none>" />
                          </div>
                        </div>
                        <div className="revit-property-category">
                          <div className="revit-property-header">Constraints</div>
                          <div className="revit-property">
                            <span className="revit-property-label">Base Constraint:</span>
                            <select className="revit-property-value">
                              <option>Level 1</option>
                              <option>Level 2</option>
                            </select>
                          </div>
                          <div className="revit-property">
                            <span className="revit-property-label">Base Offset:</span>
                            <input className="revit-property-value" value="0' 0&quot;" />
                          </div>
                          <div className="revit-property">
                            <span className="revit-property-label">Top Constraint:</span>
                            <select className="revit-property-value">
                              <option>Up to level: Level 2</option>
                              <option>Unconnected</option>
                            </select>
                          </div>
                          <div className="revit-property">
                            <span className="revit-property-label">Height:</span>
                            <input className="revit-property-value" value="10' 0&quot;" />
                          </div>
                        </div>
                        <div className="revit-property-category">
                          <div className="revit-property-header">Structural</div>
                          <div className="revit-property">
                            <span className="revit-property-label">Structural Usage:</span>
                            <select className="revit-property-value">
                              <option>Non-bearing</option>
                              <option>Bearing</option>
                              <option>Shear</option>
                            </select>
                          </div>
                        </div>
                        <div className="revit-property-category">
                          <div className="revit-property-header">Dimensions</div>
                          <div className="revit-property">
                            <span className="revit-property-label">Length:</span>
                            <input className="revit-property-value" value="45' 6&quot;" readOnly />
                          </div>
                          <div className="revit-property">
                            <span className="revit-property-label">Area:</span>
                            <input className="revit-property-value" value="455 SF" readOnly />
                          </div>
                          <div className="revit-property">
                            <span className="revit-property-label">Volume:</span>
                            <input className="revit-property-value" value="303.33 CF" readOnly />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
              <div className="app-workspace">
                {/* Left Panel - Browser */}
                <div className="left-panel" style={{ background: app.theme.panel, borderColor: app.theme.border }}>
                  <div className="panel-header" style={{ background: app.theme.panelHeader, color: app.theme.text, borderColor: app.theme.border }}>
                    {app.id === 'fusion' && 'Browser'}
                    {app.id === 'autocad' && 'DesignCenter'}
                    {app.id === 'revit' && 'Project Browser'}
                  </div>
                  <div className="file-tree">
                    {app.id === 'fusion' && (
                      <>
                        <div className="tree-item" style={{ color: app.theme.text }}>🗂 Main Assembly v12</div>
                        <div className="tree-item indent" style={{ color: app.theme.text }}>📐 Origin</div>
                        <div className="tree-item indent" style={{ color: app.theme.text }}>📝 Sketches (7)</div>
                        <div className="tree-item indent" style={{ color: app.theme.text }}>🔧 Bodies (3)</div>
                        <div className="tree-item indent" style={{ color: app.theme.text }}>⚙️ Features</div>
                        <div className="tree-item indent-2" style={{ color: app.theme.text }}>  Extrude1</div>
                        <div className="tree-item indent-2" style={{ color: app.theme.text }}>  Hole1</div>
                        <div className="tree-item indent-2" style={{ color: app.theme.text }}>  Fillet1</div>
                        <div className="tree-item indent-2" style={{ color: app.theme.text }}>  Pattern1</div>
                        <div className="tree-item indent" style={{ color: app.theme.text }}>📊 Analysis</div>
                        <div className="tree-item indent" style={{ color: app.theme.text }}>🎨 Appearances</div>
                      </>
                    )}
                    {app.id === 'autocad' && (
                      <div className="autocad-tools-panel">
                        <div className="tool-palette">
                          <div className="tool-palette-row">
                            <div className="palette-tool active" style={{ background: app.theme.toolHover }}>
                              <span style={{ color: app.theme.text }}>⬆️</span>
                            </div>
                            <div className="palette-tool">
                              <span style={{ color: app.theme.text }}>✋</span>
                            </div>
                          </div>
                          <div className="tool-palette-row">
                            <div className="palette-tool">
                              <span style={{ color: app.theme.text }}>📏</span>
                            </div>
                            <div className="palette-tool">
                              <span style={{ color: app.theme.text }}>⭕</span>
                            </div>
                          </div>
                          <div className="tool-palette-row">
                            <div className="palette-tool">
                              <span style={{ color: app.theme.text }}>⬜</span>
                            </div>
                            <div className="palette-tool">
                              <span style={{ color: app.theme.text }}>✏️</span>
                            </div>
                          </div>
                          <div className="tool-palette-row">
                            <div className="palette-tool">
                              <span style={{ color: app.theme.text }}>〰️</span>
                            </div>
                            <div className="palette-tool">
                              <span style={{ color: app.theme.text }}>📐</span>
                            </div>
                          </div>
                          <div className="tool-palette-row">
                            <div className="palette-tool">
                              <span style={{ color: app.theme.text }}>🔤</span>
                            </div>
                            <div className="palette-tool">
                              <span style={{ color: app.theme.text }}>📏</span>
                            </div>
                          </div>
                          <div className="tool-palette-row">
                            <div className="palette-tool">
                              <span style={{ color: app.theme.text }}>🎨</span>
                            </div>
                            <div className="palette-tool">
                              <span style={{ color: app.theme.text }}>🪣</span>
                            </div>
                          </div>
                        </div>
                        <div className="layers-section" style={{ marginTop: '20px' }}>
                          <div className="section-header" style={{ color: app.theme.text }}>Layers</div>
                          <div className="layer-item" style={{ background: app.theme.toolHover }}>
                            <span style={{ color: app.theme.text }}>0</span>
                          </div>
                          <div className="layer-item">
                            <span style={{ color: app.theme.text }}>Walls</span>
                          </div>
                          <div className="layer-item">
                            <span style={{ color: app.theme.text }}>Dimensions</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {app.id === 'revit' && null}
                  </div>
                </div>
                
                {/* Canvas Area */}
                <div className="canvas-area" style={{ background: app.theme.background }}>
                  <div className="viewport">
                    {app.id === 'fusion' && (
                      <div className="model-preview">
                        <div className="model-3d">🔩</div>
                        <div className="viewport-controls">
                          <span>Orbit</span> | <span>Pan</span> | <span>Zoom</span>
                        </div>
                      </div>
                    )}
                    {app.id === 'autocad' && (
                      <div className="drawing-preview">
                        <div className="drawing-grid"></div>
                        <div className="drawing-lines"></div>
                        <div className="viewport-info">Scale: 1:100</div>
                      </div>
                    )}
                    {app.id === 'revit' && (
                      <div className="building-preview">
                        <div className="building-model">🏢</div>
                        <div className="viewport-info">Level 1 - Floor Plan</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Panel - Properties */}
                <div className="right-panel" style={{ background: app.theme.panel, borderColor: app.theme.border }}>
                  <div className="panel-header" style={{ background: app.theme.panelHeader, color: app.theme.text, borderColor: app.theme.border }}>
                    {app.id === 'fusion' && 'Properties'}
                    {app.id === 'autocad' && 'Properties'}
                    {app.id === 'revit' && 'Properties'}
                  </div>
                  <div className="properties-list">
                    {app.id === 'fusion' && (
                      <>
                        <div className="property-group">
                          <div className="property-header" style={{ color: app.theme.text }}>▼ Feature</div>
                          <div className="property-item" style={{ color: app.theme.text }}>
                            <span>Operation:</span>
                            <select style={{ background: app.theme.background, color: app.theme.text, borderColor: app.theme.border }}>
                              <option>Join</option>
                            </select>
                          </div>
                          <div className="property-item" style={{ color: app.theme.text }}>
                            <span>Profile:</span>
                            <input type="text" value="Sketch1" readOnly style={{ background: app.theme.background, color: app.theme.text, borderColor: app.theme.border }} />
                          </div>
                        </div>
                        <div className="property-group">
                          <div className="property-header" style={{ color: app.theme.text }}>▼ Extent</div>
                          <div className="property-item" style={{ color: app.theme.text }}>
                            <span>Type:</span>
                            <select style={{ background: app.theme.background, color: app.theme.text, borderColor: app.theme.border }}>
                              <option>Distance</option>
                            </select>
                          </div>
                          <div className="property-item" style={{ color: app.theme.text }}>
                            <span>Distance:</span>
                            <input type="text" value="25.0 mm" style={{ background: app.theme.background, color: app.theme.text, borderColor: app.theme.border }} />
                          </div>
                        </div>
                        <div className="property-group">
                          <div className="property-header" style={{ color: app.theme.text }}>▼ Physical Material</div>
                          <div className="property-item" style={{ color: app.theme.text }}>
                            <span>Material:</span>
                            <select style={{ background: app.theme.background, color: app.theme.text, borderColor: app.theme.border }}>
                              <option>Steel</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                    {app.id === 'autocad' && (
                      <>
                        <div className="property-group">
                          <div className="property-header" style={{ color: app.theme.text }}>▼ General</div>
                          <div className="property-item" style={{ color: app.theme.text }}>
                            <span>Color:</span>
                            <select style={{ background: app.theme.background, color: app.theme.text, borderColor: app.theme.border }}>
                              <option>ByLayer</option>
                            </select>
                          </div>
                          <div className="property-item" style={{ color: app.theme.text }}>
                            <span>Layer:</span>
                            <select style={{ background: app.theme.background, color: app.theme.text, borderColor: app.theme.border }}>
                              <option>0</option>
                            </select>
                          </div>
                          <div className="property-item" style={{ color: app.theme.text }}>
                            <span>Linetype:</span>
                            <select style={{ background: app.theme.background, color: app.theme.text, borderColor: app.theme.border }}>
                              <option>ByLayer</option>
                            </select>
                          </div>
                        </div>
                        <div className="property-group">
                          <div className="property-header" style={{ color: app.theme.text }}>▼ Geometry</div>
                          <div className="property-item" style={{ color: app.theme.text }}>
                            <span>Start X:</span>
                            <input type="text" value="0.0000" style={{ background: app.theme.background, color: app.theme.text, borderColor: app.theme.border }} />
                          </div>
                          <div className="property-item" style={{ color: app.theme.text }}>
                            <span>Start Y:</span>
                            <input type="text" value="0.0000" style={{ background: app.theme.background, color: app.theme.text, borderColor: app.theme.border }} />
                          </div>
                          <div className="property-item" style={{ color: app.theme.text }}>
                            <span>Length:</span>
                            <input type="text" value="100.0000" readOnly style={{ background: app.theme.background, color: app.theme.text, borderColor: app.theme.border }} />
                          </div>
                        </div>
                      </>
                    )}
                    {app.id === 'revit' && null}
                  </div>
                </div>
              </div>
              )}
              
              {/* Steam-style Overlay for this window */}
              <SteamOverlay 
                activeApp={app.id}
                isActive={overlayActive[app.id]}
                onClose={() => toggleOverlay(app.id)}
              />
            </div>
            
            
            {/* Resize Handles */}
            {!windowState.maximized && (
              <>
                {/* Corner handles */}
                <div 
                  className="resize-handle corner tl"
                  onMouseDown={(e) => handleResize(e, app.id, 'tl', windowState)}
                />
                <div 
                  className="resize-handle corner tr"
                  onMouseDown={(e) => handleResize(e, app.id, 'tr', windowState)}
                />
                <div 
                  className="resize-handle corner bl"
                  onMouseDown={(e) => handleResize(e, app.id, 'bl', windowState)}
                />
                <div 
                  className="resize-handle corner br"
                  onMouseDown={(e) => handleResize(e, app.id, 'br', windowState)}
                />
                
                {/* Edge handles */}
                <div 
                  className="resize-handle edge top"
                  onMouseDown={(e) => handleResize(e, app.id, 't', windowState)}
                />
                <div 
                  className="resize-handle edge right"
                  onMouseDown={(e) => handleResize(e, app.id, 'r', windowState)}
                />
                <div 
                  className="resize-handle edge bottom"
                  onMouseDown={(e) => handleResize(e, app.id, 'b', windowState)}
                />
                <div 
                  className="resize-handle edge left"
                  onMouseDown={(e) => handleResize(e, app.id, 'l', windowState)}
                />
              </>
            )}
          </div>
          );
        })}
      </div>

      {/* Dock */}
      <div className="macos-dock">
        <motion.div
          className={`dock-item ${isDesktopActive ? 'active' : ''}`}
          onClick={() => {
            setActiveApp('finder');
            setIsDesktopActive(true);
          }}
          whileHover={{ scale: 1.2, y: -10 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <img src={finderIcon} alt="Finder" className="dock-icon finder-icon" />
          <span className="dock-label">Finder</span>
          <span className="dock-indicator"></span>
        </motion.div>
        
        <div className="dock-separator"></div>
        
        {applications.map(app => (
          <motion.div
            key={app.id}
            className={`dock-item ${windowStates[app.id].visible || windowStates[app.id].minimized ? 'active' : ''}`}
            onClick={() => toggleWindow(app.id)}
            whileHover={{ scale: 1.2, y: -10 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="dock-icon">{app.icon}</span>
            <span className="dock-label">{app.name}</span>
            {(windowStates[app.id].visible || windowStates[app.id].minimized) && <span className="dock-indicator"></span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default MacOSDesktop;