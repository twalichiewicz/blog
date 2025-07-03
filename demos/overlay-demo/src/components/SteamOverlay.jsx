import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SteamOverlay.css';

// Available overlay apps
const overlayApps = {
  assistant: {
    id: 'assistant',
    title: 'AI Assistant',
    icon: '🤖',
    description: 'Context-aware help',
    defaultSize: { width: 320, height: 400 },
    defaultPosition: { x: 100, y: 100 }
  },
  browser: {
    id: 'browser',
    title: 'Web Browser',
    icon: '🌐',
    description: 'Built-in browser',
    defaultSize: { width: 600, height: 450 },
    defaultPosition: { x: 150, y: 120 }
  },
  chat: {
    id: 'chat',
    title: 'Team Chat',
    icon: '💬',
    description: 'Collaborate with team',
    defaultSize: { width: 280, height: 400 },
    defaultPosition: { x: 200, y: 140 }
  },
  files: {
    id: 'files',
    title: 'Recent Files',
    icon: '📁',
    description: 'Project history',
    defaultSize: { width: 400, height: 320 },
    defaultPosition: { x: 250, y: 160 }
  },
  notes: {
    id: 'notes',
    title: 'Notes',
    icon: '📝',
    description: 'Quick notes',
    defaultSize: { width: 320, height: 300 },
    defaultPosition: { x: 300, y: 180 }
  },
  media: {
    id: 'media',
    title: 'Media Player',
    icon: '🎵',
    description: 'Music & videos',
    defaultSize: { width: 360, height: 280 },
    defaultPosition: { x: 350, y: 200 }
  }
};

function SteamOverlay({ activeApp, isActive, onClose }) {
  // Load saved state from localStorage for this specific app
  const loadSavedState = () => {
    const saved = localStorage.getItem(`overlayWindows-${activeApp}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return {};
  };

  const [windows, setWindows] = useState(loadSavedState);
  const [activeWindow, setActiveWindow] = useState(null);
  const [windowZOrder, setWindowZOrder] = useState([]);
  const [assistantMode, setAssistantMode] = useState('listening'); // 'listening', 'suggesting', 'active'
  const [currentSuggestion, setCurrentSuggestion] = useState(null);

  // Save state to localStorage whenever windows change
  useEffect(() => {
    localStorage.setItem(`overlayWindows-${activeApp}`, JSON.stringify(windows));
  }, [windows, activeApp]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isActive) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isActive, onClose]);

  const openWindow = (appId) => {
    const app = overlayApps[appId];
    if (!app) return;

    const windowId = `${appId}-${Date.now()}`;
    
    // Calculate position to avoid overlaps
    const existingWindows = Object.values(windows).filter(w => !w.minimized);
    let position = { ...app.defaultPosition };
    
    // Offset position if there are existing windows
    if (existingWindows.length > 0) {
      const offset = existingWindows.length * 30;
      position.x += offset;
      position.y += offset;
    }
    
    const newWindow = {
      ...app,
      id: windowId,
      appId: appId,
      activeApp: activeApp, // Store which app this overlay belongs to
      position: position,
      size: { ...app.defaultSize },
      minimized: false,
      pinned: false
    };

    setWindows(prev => ({
      ...prev,
      [windowId]: newWindow
    }));
    setWindowZOrder(prev => [...prev, windowId]);
    setActiveWindow(windowId);
  };

  const closeWindow = (windowId) => {
    setWindows(prev => {
      const newWindows = { ...prev };
      delete newWindows[windowId];
      return newWindows;
    });
    setWindowZOrder(prev => prev.filter(id => id !== windowId));
    if (activeWindow === windowId) {
      setActiveWindow(null);
    }
  };

  const minimizeWindow = (windowId) => {
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        minimized: true
      }
    }));
  };

  const restoreWindow = (windowId) => {
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        minimized: false
      }
    }));
    bringToFront(windowId);
  };

  const togglePin = (windowId) => {
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        pinned: !prev[windowId].pinned
      }
    }));
  };

  const bringToFront = (windowId) => {
    setWindowZOrder(prev => {
      const filtered = prev.filter(id => id !== windowId);
      return [...filtered, windowId];
    });
    setActiveWindow(windowId);
  };
  
  const arrangeWindows = () => {
    const visibleWindows = Object.values(windows).filter(w => !w.minimized && !w.pinned);
    if (visibleWindows.length === 0) return;
    
    const container = document.querySelector('.steam-overlay');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const cols = Math.ceil(Math.sqrt(visibleWindows.length));
    const rows = Math.ceil(visibleWindows.length / cols);
    
    const windowWidth = Math.max(300, (containerRect.width - 80) / cols);
    const windowHeight = Math.max(200, (containerRect.height - 120) / rows);
    
    visibleWindows.forEach((window, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = 20 + col * (windowWidth + 10);
      const y = 80 + row * (windowHeight + 10);
      
      setWindows(prev => ({
        ...prev,
        [window.id]: {
          ...prev[window.id],
          position: { x, y },
          size: { width: windowWidth, height: windowHeight }
        }
      }));
    });
  };

  const updatePosition = (windowId, position) => {
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        position
      }
    }));
  };

  const updateSize = (windowId, size) => {
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        size
      }
    }));
  };

  // Render pinned windows even when overlay is closed
  const pinnedWindows = Object.values(windows).filter(w => w.pinned);
  const overlayWindows = Object.values(windows).filter(w => !w.pinned && !w.minimized);
  const minimizedWindows = Object.values(windows).filter(w => !w.pinned && w.minimized);

  // Simulate intelligent suggestions based on app context
  useEffect(() => {
    if (isActive && assistantMode === 'listening') {
      // Simulate detecting user needs after a delay
      const timer = setTimeout(() => {
        if (activeApp === 'autocad') {
          setCurrentSuggestion({
            text: "I noticed you're working on dimensions. Would you like me to help align them?",
            action: 'align-dimensions'
          });
          setAssistantMode('suggesting');
        } else if (activeApp === 'revit') {
          setCurrentSuggestion({
            text: "I can help you place doors and windows more efficiently. Want me to show you?",
            action: 'smart-placement'
          });
          setAssistantMode('suggesting');
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, activeApp, assistantMode]);

  return (
    <>
      {/* Pinned windows (always visible) */}
      <AnimatePresence>
        {pinnedWindows.map(window => (
          <OverlayWindow
            key={window.id}
            window={window}
            isActive={activeWindow === window.id}
            zIndex={1000 + windowZOrder.indexOf(window.id)}
            onClose={() => closeWindow(window.id)}
            onTogglePin={() => togglePin(window.id)}
            onFocus={() => bringToFront(window.id)}
            onUpdatePosition={(pos) => updatePosition(window.id, pos)}
            onUpdateSize={(size) => updateSize(window.id, size)}
            isPinned={true}
          />
        ))}
      </AnimatePresence>

      {/* Main overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className={`steam-overlay ${assistantMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Siri-like border effect when listening */}
            {assistantMode === 'listening' && (
              <motion.div 
                className="assistant-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
            
            {/* Suggestion bubble */}
            {assistantMode === 'suggesting' && currentSuggestion && (
              <motion.div
                className="suggestion-bubble"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                <div className="suggestion-content">
                  <div className="suggestion-text">{currentSuggestion.text}</div>
                  <div className="suggestion-actions">
                    <button 
                      className="suggestion-accept"
                      onClick={() => {
                        setAssistantMode('active');
                        openWindow('assistant');
                      }}
                    >
                      Yes, help me
                    </button>
                    <button 
                      className="suggestion-dismiss"
                      onClick={() => {
                        setAssistantMode('listening');
                        setCurrentSuggestion(null);
                      }}
                    >
                      Not now
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className={`overlay-backdrop ${assistantMode === 'active' ? 'active' : ''}`} onClick={onClose} />

            {/* Launcher bar */}
            <motion.div
              className="launcher-bar"
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="launcher-section">
                <div className="launcher-apps">
                  {Object.values(overlayApps).map(app => (
                    <button
                      key={app.id}
                      className="launcher-app"
                      onClick={() => openWindow(app.id)}
                      data-tooltip={app.title}
                    >
                      <span className="app-icon">{app.icon}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="launcher-section launcher-right">
                <button 
                  className="launcher-arrange" 
                  onClick={arrangeWindows}
                  data-tooltip="Arrange"
                >
                  ⚏
                </button>
                <button 
                  className="launcher-close" 
                  onClick={onClose}
                  data-tooltip="Close"
                >
                  ✕
                </button>
              </div>
            </motion.div>

            {/* Minimized windows dock */}
            {minimizedWindows.length > 0 && (
              <motion.div
                className="minimized-dock"
                initial={{ x: -200 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                {minimizedWindows.map(window => (
                  <button
                    key={window.id}
                    className="minimized-window"
                    onClick={() => restoreWindow(window.id)}
                    data-tooltip={window.title}
                  >
                    <span className="window-icon">{window.icon}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Overlay windows */}
            {overlayWindows.map(window => (
              <OverlayWindow
                key={window.id}
                window={window}
                isActive={activeWindow === window.id}
                zIndex={100 + windowZOrder.indexOf(window.id)}
                onClose={() => closeWindow(window.id)}
                    onTogglePin={() => togglePin(window.id)}
                onFocus={() => bringToFront(window.id)}
                onUpdatePosition={(pos) => updatePosition(window.id, pos)}
                onUpdateSize={(size) => updateSize(window.id, size)}
                isPinned={false}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Individual overlay window component
function OverlayWindow({ 
  window, 
  isActive, 
  zIndex, 
  onClose, 
 
  onTogglePin, 
  onFocus,
  onUpdatePosition,
  onUpdateSize,
  isPinned
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e) => {
    // Don't drag if clicking on controls
    if (e.target.closest('.window-controls')) {
      return;
    }
    
    // Prevent text selection during drag
    e.preventDefault();
    
    setIsDragging(true);
    onFocus();
    
    const rect = e.currentTarget.closest('.overlay-window').getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    const handleMouseMove = (moveEvent) => {
      // Calculate new position relative to the overlay container
      const container = document.querySelector('.steam-overlay');
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      let newX = moveEvent.clientX - containerRect.left - startX;
      let newY = moveEvent.clientY - containerRect.top - startY;
      
      // Apply constraints - allow widget to be dragged mostly off screen
      const maxX = containerRect.width - window.size.width;
      const maxY = containerRect.height - 28; // Only titlebar (28px) needs to stay visible
      
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY)); // No top padding, only titlebar needs to stay visible
      
      onUpdatePosition({
        x: newX,
        y: newY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResize = (e, direction) => {
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = window.size.width;
    const startHeight = window.size.height;
    const startPosX = window.position.x;
    const startPosY = window.position.y;
    
    // Get container bounds
    const container = e.target.closest('.steam-overlay');
    const containerRect = container ? container.getBoundingClientRect() : null;

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
          newWidth = Math.max(200, startWidth + deltaX);
          newHeight = Math.max(150, startHeight + deltaY);
          break;
        case 'bl': // bottom-left
          newWidth = Math.max(200, startWidth - deltaX);
          newHeight = Math.max(150, startHeight + deltaY);
          newX = startPosX + deltaX;
          break;
        case 'tr': // top-right
          newWidth = Math.max(200, startWidth + deltaX);
          newHeight = Math.max(150, startHeight - deltaY);
          newY = startPosY + deltaY;
          break;
        case 'tl': // top-left
          newWidth = Math.max(200, startWidth - deltaX);
          newHeight = Math.max(150, startHeight - deltaY);
          newX = startPosX + deltaX;
          newY = startPosY + deltaY;
          break;
      }
      
      if (containerRect) {
        // Constrain to container bounds
        if (newX < 0) {
          newWidth += newX;
          newX = 0;
        }
        if (newY < 0) {
          newHeight += newY;
          newY = 0;
        }
        
        const maxWidth = containerRect.width - newX;
        const maxHeight = containerRect.height - newY;
        
        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);
      }
      
      onUpdateSize({
        width: newWidth,
        height: newHeight
      });
      
      if (newX !== startPosX || newY !== startPosY) {
        onUpdatePosition({
          x: newX,
          y: newY
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <motion.div
      className={`overlay-window ${isActive ? 'active' : ''} ${isPinned ? 'pinned' : ''} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      onClick={onFocus}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <div className="window-title">
          <span className="window-icon">{window.icon}</span>
          {window.title}
          {isPinned && <span className="pin-indicator">📌</span>}
        </div>
        <div className="window-controls">
          <button className="control-close" onClick={onClose}>×</button>
          <button className="control-pin" onClick={onTogglePin} title={isPinned ? "Unpin" : "Pin to app"}>
            📌
          </button>
        </div>
      </div>
      
      <div className="window-content">
        {window.appId === 'assistant' && <AssistantContent />}
        {window.appId === 'browser' && <BrowserContent />}
        {window.appId === 'chat' && <ChatContent />}
        {window.appId === 'files' && <FilesContent />}
        {window.appId === 'notes' && <NotesContent activeApp={window.activeApp} />}
        {window.appId === 'media' && <MediaContent />}
      </div>
      
      <div className="resize-handle br" onMouseDown={(e) => handleResize(e, 'br')} />
      <div className="resize-handle bl" onMouseDown={(e) => handleResize(e, 'bl')} />
      <div className="resize-handle tr" onMouseDown={(e) => handleResize(e, 'tr')} />
      <div className="resize-handle tl" onMouseDown={(e) => handleResize(e, 'tl')} />
    </motion.div>
  );
}

// Content components for each app type
function AssistantContent() {
  const [messages, setMessages] = useState([
    { type: 'ai', text: "I'm here to help! I noticed you were working on dimensions. Would you like me to:" },
    { type: 'options', options: [
      '📐 Auto-align selected dimensions',
      '📏 Standardize dimension spacing',
      '🔧 Fix overlapping annotations',
      '💡 Show dimension best practices'
    ]},
  ]);
  
  return (
    <div className="assistant-content">
      <div className="assistant-header">
        <span className="assistant-status">
          <span className="status-dot"></span>
          AI Assistant - Active
        </span>
        <span className="assistant-context">Context: AutoCAD Drawing</span>
      </div>
      <div className="assistant-chat">
        {messages.map((message, index) => (
          <div key={index}>
            {message.type === 'ai' && (
              <div className="message ai">
                <div className="message-avatar">🤖</div>
                <div className="message-content">{message.text}</div>
              </div>
            )}
            {message.type === 'user' && (
              <div className="message user">
                <div className="message-content">{message.text}</div>
              </div>
            )}
            {message.type === 'options' && (
              <div className="message-options">
                {message.options.map((option, i) => (
                  <button key={i} className="option-button">
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="assistant-input">
        <input 
          type="text" 
          placeholder="Type a command or question..." 
          className="assistant-text-input"
        />
        <button className="assistant-send">
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

function BrowserContent() {
  return (
    <div className="browser-content">
      <div className="browser-toolbar">
        <button>←</button>
        <button>→</button>
        <input type="text" defaultValue="https://help.autodesk.com" />
        <button>⟳</button>
      </div>
      <div className="browser-frame">
        <p>Embedded web browser content</p>
      </div>
    </div>
  );
}

function ChatContent() {
  return (
    <div className="chat-content">
      <div className="chat-rooms">
        <div className="room active"># general</div>
        <div className="room"># design-review</div>
        <div className="room"># engineering</div>
      </div>
      <div className="chat-messages">
        <div className="chat-message">
          <strong>Sarah:</strong> Has anyone reviewed the latest assembly?
        </div>
        <div className="chat-message">
          <strong>Mike:</strong> Looking at it now, nice work on the tolerances
        </div>
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type a message..." />
      </div>
    </div>
  );
}

function FilesContent() {
  return (
    <div className="files-content">
      <div className="files-filter">
        <button className="active">Recent</button>
        <button>Starred</button>
        <button>Shared</button>
      </div>
      <div className="files-list">
        <div className="file-item">
          <span className="file-icon">📄</span>
          <div className="file-details">
            <div className="file-name">Gear Assembly v3.f3d</div>
            <div className="file-meta">Modified 2 hours ago</div>
          </div>
        </div>
        <div className="file-item">
          <span className="file-icon">📄</span>
          <div className="file-details">
            <div className="file-name">Motor Mount.f3d</div>
            <div className="file-meta">Modified yesterday</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesContent({ activeApp }) {
  const [notes, setNotes] = useState(localStorage.getItem(`overlayNotes-${activeApp}`) || '');
  
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    localStorage.setItem(`overlayNotes-${activeApp}`, e.target.value);
  };
  
  return (
    <div className="notes-content">
      <textarea 
        value={notes}
        onChange={handleNotesChange}
        placeholder="Type your notes here..."
      />
    </div>
  );
}

function MediaContent() {
  return (
    <div className="media-content">
      <div className="media-player">
        <div className="now-playing">
          <span className="media-icon">🎵</span>
          <div className="track-info">
            <div className="track-name">Lofi Study Beats</div>
            <div className="track-artist">Chill Vibes</div>
          </div>
        </div>
        <div className="media-controls">
          <button>⏮</button>
          <button className="play-pause">▶️</button>
          <button>⏭</button>
        </div>
        <div className="media-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '35%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SteamOverlay;