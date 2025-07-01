import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MacOSDesktop-new.css';
import TWDesignLogo from '../assets/TWDesignLogo.svg';
import overlayWallpaper from '../assets/overlayWallpaper.svg';
import finderIcon from '../assets/finder.png';
import SteamOverlay from './SteamOverlay-new';
import {
  FusionIcon, AutoCADIcon, RevitIcon,
  BoxIcon, SketchIcon, ExtrudeIcon, RevolveIcon, JointIcon, ParamsIcon,
  WallIcon, DoorIcon, WindowIcon, FloorIcon, CeilingIcon, RoofIcon,
  ColumnIcon, BeamIcon, SlabIcon, ComponentIcon, StairIcon, RampIcon,
  RailingIcon, ShaftIcon, RoomIcon, AreaIcon, ModelLineIcon, ModelTextIcon,
  SelectIcon, MoveIcon, LineIcon, CircleIcon, RectangleIcon, PolylineIcon,
  TextIcon, EraserIcon, PaintIcon, BucketIcon,
  FolderIcon, DocumentIcon, ViewIcon, ScheduleIcon, FamilyIcon, SheetIcon,
  UserIcon
} from './icons';

const applications = [
  {
    id: 'fusion',
    name: 'Autodesk Fusion',
    Icon: FusionIcon,
    color: '#FF6B00',
    content: 'CAD/CAM/CAE',
    window: { x: 50, y: 80, width: 900, height: 600 },
    theme: {
      titlebar: '#E5E5E5',
      background: '#1e1e1e',
      ribbon: '#2d2d30',
      ribbonTab: '#3e3e42',
      ribbonTabActive: '#FF6B00',
      tools: '#252526',
      toolHover: '#3e3e42',
      text: '#cccccc',
      textActive: '#ffffff',
      border: '#464647',
      panel: '#1e1e1e',
      panelHeader: '#252526'
    }
  },
  {
    id: 'autocad',
    name: 'AutoCAD 2025',
    filename: 'Drawing1.dwg',
    Icon: AutoCADIcon,
    color: '#E51937',
    content: '2D/3D Design',
    window: { x: 300, y: 150, width: 950, height: 650 },
    theme: {
      titlebar: '#E5E5E5',
      background: '#1e2832',
      ribbon: '#243441',
      ribbonTab: '#2c3e50',
      ribbonTabActive: '#E51937',
      tools: '#34495e',
      toolHover: '#4a5f7a',
      text: '#ecf0f1',
      textActive: '#ffffff',
      border: '#34495e',
      panel: '#1e2832',
      panelHeader: '#243441'
    }
  },
  {
    id: 'revit',
    name: 'Revit 2025',
    Icon: RevitIcon,
    color: '#0696D7',
    content: 'BIM Software',
    window: { x: 150, y: 250, width: 1000, height: 700 },
    theme: {
      titlebar: '#E5E5E5',
      background: '#f8f8f8',
      ribbon: '#ffffff',
      ribbonTab: '#ffffff',
      ribbonTabActive: '#0696D7',
      tools: '#ffffff',
      toolHover: '#e6f2ff',
      text: '#323130',
      textActive: '#ffffff',
      border: '#e1e1e1',
      panel: '#f0f0f0',
      panelHeader: '#e8e8e8'
    }
  }
];

function MacOSDesktop({ activeApp, setActiveApp, overlayActive, toggleOverlay }) {
  const [windowStates, setWindowStates] = React.useState({
    fusion: { 
      visible: false, 
      minimized: false,
      maximized: false,
      position: { x: 50, y: 100 }, 
      size: { width: 900, height: 600 },
      previousPosition: null,
      previousSize: null
    },
    autocad: { 
      visible: true, 
      minimized: false,
      maximized: false,
      position: { x: 300, y: 150 }, 
      size: { width: 950, height: 650 },
      previousPosition: null,
      previousSize: null
    },
    revit: { 
      visible: true, 
      minimized: false,
      maximized: false,
      position: { x: 150, y: 250 }, 
      size: { width: 1000, height: 700 },
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
          newWidth = Math.max(600, startWidth + deltaX);
          newHeight = Math.max(400, startHeight + deltaY);
          break;
        case 'bl': // bottom-left
          newWidth = Math.max(600, startWidth - deltaX);
          newHeight = Math.max(400, startHeight + deltaY);
          newX = startPosX + deltaX;
          break;
        case 'tr': // top-right
          newWidth = Math.max(600, startWidth + deltaX);
          newHeight = Math.max(400, startHeight - deltaY);
          newY = startPosY + deltaY;
          break;
        case 'tl': // top-left
          newWidth = Math.max(600, startWidth - deltaX);
          newHeight = Math.max(400, startHeight - deltaY);
          newX = startPosX + deltaX;
          newY = startPosY + deltaY;
          break;
        case 't': // top
          newHeight = Math.max(400, startHeight - deltaY);
          newY = startPosY + deltaY;
          break;
        case 'b': // bottom
          newHeight = Math.max(400, startHeight + deltaY);
          break;
        case 'l': // left
          newWidth = Math.max(600, startWidth - deltaX);
          newX = startPosX + deltaX;
          break;
        case 'r': // right
          newWidth = Math.max(600, startWidth + deltaX);
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
              <span className="menubar-item">Manage</span>
              <span className="menubar-item">Add-Ins</span>
            </>
          ) : (
            <>
              <span className="menubar-item">File</span>
              <span className="menubar-item">Edit</span>
              <span className="menubar-item">View</span>
              <span className="menubar-item">Design</span>
              <span className="menubar-item">Tools</span>
              <span className="menubar-item">Window</span>
              <span className="menubar-item">Help</span>
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
                    
                    // Apply constraints
                    const maxX = currentDesktopRect.width - windowState.size.width;
                    const maxY = currentDesktopRect.height - 38;
                    
                    newX = Math.max(0, Math.min(newX, maxX));
                    newY = Math.max(0, Math.min(newY, maxY));
                    
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
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                    Overlay
                  </button>
                  {app.id === 'autocad' && (
                    <button className="profile-button" onClick={(e) => e.stopPropagation()}>
                      <span className="profile-avatar">
                        <UserIcon />
                      </span>
                      <span className="profile-name">User</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="window-content" style={{ background: app.theme.background, position: 'relative' }}>
                {/* Application Content */}
                {app.id === 'fusion' && <FusionContent theme={app.theme} />}
                {app.id === 'autocad' && <AutoCADContent theme={app.theme} />}
                {app.id === 'revit' && <RevitContent theme={app.theme} />}
                
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
            <span className="dock-icon app-icon">
              <app.Icon />
            </span>
            <span className="dock-label">{app.name}</span>
            {(windowStates[app.id].visible || windowStates[app.id].minimized) && <span className="dock-indicator"></span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Fusion Content Component
function FusionContent({ theme }) {
  return (
    <>
      {/* Fusion Ribbon */}
      <div className="app-ribbon" style={{ background: theme.ribbon, borderColor: theme.border }}>
        <div className="ribbon-tabs" style={{ background: theme.border }}>
          <div className="ribbon-tab active" style={{ background: theme.ribbonTabActive, color: theme.textActive }}>SOLID</div>
          <div className="ribbon-tab" style={{ background: theme.ribbonTab, color: theme.text }}>SURFACE</div>
          <div className="ribbon-tab" style={{ background: theme.ribbonTab, color: theme.text }}>MESH</div>
          <div className="ribbon-tab" style={{ background: theme.ribbonTab, color: theme.text }}>SHEET METAL</div>
          <div className="ribbon-tab" style={{ background: theme.ribbonTab, color: theme.text }}>UTILITIES</div>
        </div>
        <div className="fusion-ribbon-tools">
          <div className="fusion-workspace-dropdown">
            <select style={{ 
              background: theme.ribbonTabActive, 
              color: theme.textActive
            }}>
              <option>DESIGN</option>
              <option>RENDER</option>
              <option>ANIMATION</option>
              <option>SIMULATION</option>
              <option>MANUFACTURE</option>
            </select>
          </div>
          <div className="fusion-tool-groups">
            <div className="fusion-tool-group">
              <div className="fusion-group-label">CREATE</div>
              <div className="fusion-tool-buttons">
                <div className="fusion-tool-button" style={{ background: theme.tools, color: theme.text }}>
                  <BoxIcon />
                  <div className="tool-name">Box</div>
                </div>
                <div className="fusion-tool-button" style={{ background: theme.tools, color: theme.text }}>
                  <SketchIcon />
                  <div className="tool-name">Sketch</div>
                </div>
              </div>
            </div>
            <div className="fusion-tool-group">
              <div className="fusion-group-label">MODIFY</div>
              <div className="fusion-tool-buttons">
                <div className="fusion-tool-button" style={{ background: theme.tools, color: theme.text }}>
                  <ExtrudeIcon />
                  <div className="tool-name">Extrude</div>
                </div>
                <div className="fusion-tool-button" style={{ background: theme.tools, color: theme.text }}>
                  <RevolveIcon />
                  <div className="tool-name">Revolve</div>
                </div>
              </div>
            </div>
            <div className="fusion-tool-group">
              <div className="fusion-group-label">ASSEMBLE</div>
              <div className="fusion-tool-buttons">
                <div className="fusion-tool-button" style={{ background: theme.tools, color: theme.text }}>
                  <JointIcon />
                  <div className="tool-name">Joint</div>
                </div>
              </div>
            </div>
            <div className="fusion-tool-group">
              <div className="fusion-group-label">CONFIGURE</div>
              <div className="fusion-tool-buttons">
                <div className="fusion-tool-button" style={{ background: theme.tools, color: theme.text }}>
                  <ParamsIcon />
                  <div className="tool-name">Parameters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="app-workspace">
        {/* Left Panel - Browser */}
        <div className="left-panel" style={{ background: theme.panel, borderColor: theme.border }}>
          <div className="panel-header" style={{ background: theme.panelHeader, color: theme.text, borderColor: theme.border }}>
            Browser
          </div>
          <div className="file-tree">
            <div className="tree-item" style={{ color: theme.text }}>
              <FolderIcon /> Main Assembly v12
            </div>
            <div className="tree-item indent" style={{ color: theme.text }}>
              <DocumentIcon /> Origin
            </div>
            <div className="tree-item indent" style={{ color: theme.text }}>
              <FolderIcon /> Sketches (7)
            </div>
            <div className="tree-item indent" style={{ color: theme.text }}>
              <FolderIcon /> Bodies (3)
            </div>
            <div className="tree-item indent" style={{ color: theme.text }}>
              <FolderIcon /> Features
            </div>
            <div className="tree-item indent-2" style={{ color: theme.text }}>
              <ExtrudeIcon /> Extrude1
            </div>
            <div className="tree-item indent-2" style={{ color: theme.text }}>
              <CircleIcon /> Hole1
            </div>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="canvas-area" style={{ background: theme.background }}>
          <div className="viewport">
            <div className="model-preview">
              <div className="model-3d">
                <BoxIcon />
              </div>
              <div className="viewport-controls">
                <span>Orbit</span> | <span>Pan</span> | <span>Zoom</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Properties */}
        <div className="right-panel" style={{ background: theme.panel, borderColor: theme.border }}>
          <div className="panel-header" style={{ background: theme.panelHeader, color: theme.text, borderColor: theme.border }}>
            Properties
          </div>
          <div className="properties-list">
            <div className="property-group">
              <div className="property-header" style={{ color: theme.text }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
                Feature
              </div>
              <div className="property-item" style={{ color: theme.text }}>
                <span>Operation:</span>
                <select style={{ background: theme.background, color: theme.text, borderColor: theme.border }}>
                  <option>Join</option>
                  <option>Cut</option>
                  <option>Intersect</option>
                </select>
              </div>
              <div className="property-item" style={{ color: theme.text }}>
                <span>Profile:</span>
                <input type="text" value="Sketch1" readOnly style={{ background: theme.background, color: theme.text, borderColor: theme.border }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// AutoCAD Content Component
function AutoCADContent({ theme }) {
  return (
    <>
      {/* AutoCAD Ribbon */}
      <div className="app-ribbon" style={{ background: theme.ribbon, borderColor: theme.border }}>
        <div className="ribbon-tabs" style={{ background: theme.border }}>
          <div className="ribbon-tab active" style={{ background: theme.ribbonTabActive, color: theme.textActive }}>HOME</div>
          <div className="ribbon-tab" style={{ background: theme.ribbonTab, color: theme.text }}>INSERT</div>
          <div className="ribbon-tab" style={{ background: theme.ribbonTab, color: theme.text }}>ANNOTATE</div>
          <div className="ribbon-tab" style={{ background: theme.ribbonTab, color: theme.text }}>VIEW</div>
          <div className="ribbon-tab" style={{ background: theme.ribbonTab, color: theme.text }}>MANAGE</div>
        </div>
        <div className="ribbon-tools" style={{ background: theme.ribbon }}>
          <div className="tool-section">
            <div className="section-label">DRAW</div>
            <div className="tool-group-vertical">
              <div className="tool-row">
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <LineIcon /> Line
                </div>
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <PolylineIcon /> Polyline
                </div>
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <CircleIcon /> Circle
                </div>
              </div>
              <div className="tool-row">
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <CircleIcon /> Arc
                </div>
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <RectangleIcon /> Rectangle
                </div>
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <PolylineIcon /> Polygon
                </div>
              </div>
            </div>
          </div>
          <div className="tool-section">
            <div className="section-label">MODIFY</div>
            <div className="tool-group-vertical">
              <div className="tool-row">
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <MoveIcon /> Move
                </div>
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <MoveIcon /> Copy
                </div>
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <MoveIcon /> Rotate
                </div>
              </div>
              <div className="tool-row">
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <MoveIcon /> Scale
                </div>
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <LineIcon /> Trim
                </div>
                <div className="tool-item-text" style={{ background: theme.tools, color: theme.text }}>
                  <LineIcon /> Extend
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="app-workspace">
        {/* Left Panel - Tool Palette */}
        <div className="left-panel" style={{ background: theme.panel, borderColor: theme.border }}>
          <div className="autocad-tools-panel">
            <div className="tool-palette">
              <div className="tool-palette-row">
                <div className="palette-tool active">
                  <SelectIcon />
                </div>
                <div className="palette-tool">
                  <MoveIcon />
                </div>
              </div>
              <div className="tool-palette-row">
                <div className="palette-tool">
                  <LineIcon />
                </div>
                <div className="palette-tool">
                  <CircleIcon />
                </div>
              </div>
              <div className="tool-palette-row">
                <div className="palette-tool">
                  <RectangleIcon />
                </div>
                <div className="palette-tool">
                  <PolylineIcon />
                </div>
              </div>
              <div className="tool-palette-row">
                <div className="palette-tool">
                  <TextIcon />
                </div>
                <div className="palette-tool">
                  <EraserIcon />
                </div>
              </div>
              <div className="tool-palette-row">
                <div className="palette-tool">
                  <PaintIcon />
                </div>
                <div className="palette-tool">
                  <BucketIcon />
                </div>
              </div>
            </div>
            <div className="layers-section">
              <div className="section-header" style={{ color: theme.text }}>LAYERS</div>
              <div className="layer-item" style={{ background: theme.toolHover }}>
                <span style={{ color: theme.text }}>0 (Current)</span>
              </div>
              <div className="layer-item">
                <span style={{ color: theme.text }}>Walls</span>
              </div>
              <div className="layer-item">
                <span style={{ color: theme.text }}>Dimensions</span>
              </div>
              <div className="layer-item">
                <span style={{ color: theme.text }}>Text</span>
              </div>
              <div className="layer-item">
                <span style={{ color: theme.text }}>Hatches</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="canvas-area" style={{ background: theme.background }}>
          <div className="viewport">
            <div className="drawing-preview">
              <div className="drawing-grid"></div>
              <div className="viewport-info">Scale: 1:100 | Units: mm</div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Properties */}
        <div className="right-panel" style={{ background: theme.panel, borderColor: theme.border }}>
          <div className="panel-header" style={{ background: theme.panelHeader, color: theme.text, borderColor: theme.border }}>
            Properties
          </div>
          <div className="properties-list">
            <div className="property-group">
              <div className="property-header" style={{ color: theme.text }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
                General
              </div>
              <div className="property-item" style={{ color: theme.text }}>
                <span>Color:</span>
                <select style={{ background: theme.background, color: theme.text, borderColor: theme.border }}>
                  <option>ByLayer</option>
                  <option>Red</option>
                  <option>Yellow</option>
                  <option>Green</option>
                </select>
              </div>
              <div className="property-item" style={{ color: theme.text }}>
                <span>Layer:</span>
                <select style={{ background: theme.background, color: theme.text, borderColor: theme.border }}>
                  <option>0</option>
                  <option>Walls</option>
                  <option>Dimensions</option>
                </select>
              </div>
              <div className="property-item" style={{ color: theme.text }}>
                <span>Linetype:</span>
                <select style={{ background: theme.background, color: theme.text, borderColor: theme.border }}>
                  <option>ByLayer</option>
                  <option>Continuous</option>
                  <option>Dashed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Revit Content Component
function RevitContent({ theme }) {
  return (
    <>
      {/* Revit Tab Bar */}
      <div className="revit-tabs">
        <div className="revit-tab">File</div>
        <div className="revit-tab active">Architecture</div>
        <div className="revit-tab">Structure</div>
        <div className="revit-tab">Systems</div>
        <div className="revit-tab">Insert</div>
        <div className="revit-tab">Annotate</div>
        <div className="revit-tab">Analyze</div>
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
                  <div className="revit-tool">
                    <WallIcon />
                    <span className="tool-label">Wall</span>
                  </div>
                  <div className="revit-tool">
                    <DoorIcon />
                    <span className="tool-label">Door</span>
                  </div>
                  <div className="revit-tool">
                    <WindowIcon />
                    <span className="tool-label">Window</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="revit-section-label">Build</div>
          </div>
          
          <div className="revit-section">
            <div className="revit-section-content">
              <div className="revit-section-tools">
                <div className="revit-tool-row">
                  <div className="revit-tool">
                    <FloorIcon />
                    <span className="tool-label">Floor</span>
                  </div>
                  <div className="revit-tool">
                    <CeilingIcon />
                    <span className="tool-label">Ceiling</span>
                  </div>
                  <div className="revit-tool">
                    <RoofIcon />
                    <span className="tool-label">Roof</span>
                  </div>
                </div>
                <div className="revit-tool-row">
                  <div className="revit-tool">
                    <ColumnIcon />
                    <span className="tool-label">Column</span>
                  </div>
                  <div className="revit-tool">
                    <BeamIcon />
                    <span className="tool-label">Beam</span>
                  </div>
                  <div className="revit-tool">
                    <SlabIcon />
                    <span className="tool-label">Slab</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="revit-section-label">Structure</div>
          </div>
          
          <div className="revit-section">
            <div className="revit-section-content">
              <div className="revit-section-tools">
                <div className="revit-tool-row">
                  <div className="revit-tool">
                    <ComponentIcon />
                    <span className="tool-label">Component</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="revit-section-label">Component</div>
          </div>
          
          <div className="revit-section">
            <div className="revit-section-content">
              <div className="revit-section-tools">
                <div className="revit-tool-row">
                  <div className="revit-tool">
                    <StairIcon />
                    <span className="tool-label">Stair</span>
                  </div>
                  <div className="revit-tool">
                    <RampIcon />
                    <span className="tool-label">Ramp</span>
                  </div>
                </div>
                <div className="revit-tool-row">
                  <div className="revit-tool">
                    <RailingIcon />
                    <span className="tool-label">Railing</span>
                  </div>
                  <div className="revit-tool">
                    <ShaftIcon />
                    <span className="tool-label">Shaft</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="revit-section-label">Circulation</div>
          </div>
          
          <div className="revit-section">
            <div className="revit-section-content">
              <div className="revit-section-tools">
                <div className="revit-tool-row">
                  <div className="revit-tool">
                    <RoomIcon />
                    <span className="tool-label">Room</span>
                  </div>
                  <div className="revit-tool">
                    <AreaIcon />
                    <span className="tool-label">Area</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="revit-section-label">Room & Area</div>
          </div>
          
          <div className="revit-section">
            <div className="revit-section-content">
              <div className="revit-section-tools">
                <div className="revit-tool-row">
                  <div className="revit-tool">
                    <ModelLineIcon />
                    <span className="tool-label">Model Line</span>
                  </div>
                  <div className="revit-tool">
                    <ModelTextIcon />
                    <span className="tool-label">Model Text</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="revit-section-label">Model</div>
          </div>
        </div>
      </div>
      
      {/* Revit Workspace */}
      <div className="revit-panels">
        {/* Left Panel - Project Browser */}
        <div className="revit-panel">
          <div className="revit-panel-titlebar">
            <span className="revit-panel-title">Project Browser</span>
            <button className="revit-panel-close">×</button>
          </div>
          <div className="revit-panel-content">
            <div className="revit-browser">
              <div className="revit-browser-item">
                <span className="revit-browser-icon"><FolderIcon /></span> Views (all)
              </div>
              <div className="revit-browser-item indent">
                <span className="revit-browser-icon"><ViewIcon /></span> Floor Plans
              </div>
              <div className="revit-browser-item indent-2 selected">
                <span className="revit-browser-icon"><DocumentIcon /></span> Level 1
              </div>
              <div className="revit-browser-item indent-2">
                <span className="revit-browser-icon"><DocumentIcon /></span> Level 2
              </div>
              <div className="revit-browser-item indent-2">
                <span className="revit-browser-icon"><DocumentIcon /></span> Roof
              </div>
              <div className="revit-browser-item indent">
                <span className="revit-browser-icon"><ViewIcon /></span> Elevations
              </div>
              <div className="revit-browser-item indent-2">
                <span className="revit-browser-icon"><DocumentIcon /></span> North
              </div>
              <div className="revit-browser-item indent-2">
                <span className="revit-browser-icon"><DocumentIcon /></span> South
              </div>
              <div className="revit-browser-item indent-2">
                <span className="revit-browser-icon"><DocumentIcon /></span> East
              </div>
              <div className="revit-browser-item indent-2">
                <span className="revit-browser-icon"><DocumentIcon /></span> West
              </div>
              <div className="revit-browser-item indent">
                <span className="revit-browser-icon"><ViewIcon /></span> 3D Views
              </div>
              <div className="revit-browser-item indent-2">
                <span className="revit-browser-icon"><DocumentIcon /></span> {'{3D}'} Default
              </div>
              <div className="revit-browser-item indent">
                <span className="revit-browser-icon"><ScheduleIcon /></span> Schedules/Quantities
              </div>
              <div className="revit-browser-item indent">
                <span className="revit-browser-icon"><FamilyIcon /></span> Families
              </div>
              <div className="revit-browser-item indent">
                <span className="revit-browser-icon"><SheetIcon /></span> Sheets
              </div>
            </div>
          </div>
        </div>
        
        {/* Center - Viewport */}
        <div className="canvas-area" style={{ flex: 1, background: '#f8f8f8' }}>
          <div className="viewport">
            <div className="building-preview">
              <div className="building-model">
                <RevitIcon />
              </div>
              <div className="viewport-info">Level 1 - Floor Plan</div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Properties */}
        <div className="revit-panel">
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
                    <option>Basic Wall : Generic - 6"</option>
                    <option>Basic Wall : Generic - 12"</option>
                  </select>
                </div>
                <div className="revit-property">
                  <span className="revit-property-label">Family:</span>
                  <input className="revit-property-value" value="Basic Wall" readOnly />
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
                  <span className="revit-property-label">Height:</span>
                  <input className="revit-property-value" value="10' 0&quot;" />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MacOSDesktop;