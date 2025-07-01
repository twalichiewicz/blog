import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './OverlaySystem.css';

const overlayFeatures = {
  assistant: {
    title: 'AI Assistant',
    icon: '🤖',
    description: 'Context-aware help for your current task'
  },
  history: {
    title: 'Project History',
    icon: '📚',
    description: 'Access recent projects across all apps'
  },
  collaborate: {
    title: 'Collaborate',
    icon: '👥',
    description: 'Share and work together in real-time'
  },
  shortcuts: {
    title: 'Smart Shortcuts',
    icon: '⚡',
    description: 'Common actions for current context'
  }
};

const appContexts = {
  fusion: {
    suggestions: ['Extrude feature', 'Create component', 'Apply material', 'Run simulation'],
    recentFiles: ['Gear Assembly v3.f3d', 'Motor Mount.f3d', 'Bracket Design.f3d']
  },
  autocad: {
    suggestions: ['Draw polyline', 'Dimension tool', 'Layer properties', 'Plot layout'],
    recentFiles: ['Floor Plan.dwg', 'Site Layout.dwg', 'Details Sheet.dwg']
  },
  revit: {
    suggestions: ['Place door', 'Create wall', 'Add level', 'Schedule rooms'],
    recentFiles: ['Office Building.rvt', 'Residential Tower.rvt', 'Parking Structure.rvt']
  }
};

function OverlaySystem({ activeApp, appTheme, content = 'assistant', setContent, onClose, isWindowOverlay = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentContent, setCurrentContent] = useState(content);
  const context = appContexts[activeApp] || appContexts.fusion;
  
  const handleContentChange = (newContent) => {
    setCurrentContent(newContent);
    if (setContent) setContent(newContent);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <motion.div
      className={`overlay-system ${isWindowOverlay ? 'window-overlay' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {!isWindowOverlay && <div className="overlay-backdrop" onClick={onClose} />}
      
      <motion.div
        className="overlay-panel"
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        exit={{ x: -400 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="overlay-header">
          <h2>Universal Intelligence Layer</h2>
          <button className="overlay-close" onClick={onClose}>×</button>
        </div>

        <div className="overlay-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search across all Autodesk apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="overlay-nav">
          {Object.entries(overlayFeatures).map(([key, feature]) => (
            <button
              key={key}
              className={`nav-item ${currentContent === key ? 'active' : ''}`}
              onClick={() => handleContentChange(key)}
            >
              <span className="nav-icon">{feature.icon}</span>
              <span className="nav-label">{feature.title}</span>
            </button>
          ))}
        </div>

        <div className="overlay-content">
          {currentContent === 'assistant' && (
            <div className="content-section">
              <h3>Contextual Suggestions for {activeApp.toUpperCase()}</h3>
              <div className="suggestions">
                {context.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    className="suggestion-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="suggestion-icon">💡</span>
                    <span>{suggestion}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {currentContent === 'history' && (
            <div className="content-section">
              <h3>Recent Projects</h3>
              <div className="file-list">
                {context.recentFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    className="file-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <span className="file-icon">📄</span>
                    <div className="file-info">
                      <div className="file-name">{file}</div>
                      <div className="file-meta">Modified 2 hours ago</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {currentContent === 'collaborate' && (
            <div className="content-section">
              <h3>Team Collaboration</h3>
              <div className="collab-features">
                <div className="collab-card">
                  <span className="collab-icon">🎥</span>
                  <h4>Screen Share</h4>
                  <p>Share your viewport with team members</p>
                </div>
                <div className="collab-card">
                  <span className="collab-icon">💬</span>
                  <h4>Comments</h4>
                  <p>Add contextual feedback on designs</p>
                </div>
                <div className="collab-card">
                  <span className="collab-icon">🔄</span>
                  <h4>Live Sync</h4>
                  <p>Real-time collaborative editing</p>
                </div>
              </div>
            </div>
          )}

          {currentContent === 'shortcuts' && (
            <div className="content-section">
              <h3>Smart Shortcuts</h3>
              <div className="shortcuts-grid">
                <div className="shortcut">
                  <kbd>⌘</kbd> + <kbd>K</kbd>
                  <span>Quick search</span>
                </div>
                <div className="shortcut">
                  <kbd>⌘</kbd> + <kbd>.</kbd>
                  <span>Show suggestions</span>
                </div>
                <div className="shortcut">
                  <kbd>⌘</kbd> + <kbd>H</kbd>
                  <span>History panel</span>
                </div>
                <div className="shortcut">
                  <kbd>⌘</kbd> + <kbd>T</kbd>
                  <span>New project</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overlay-footer">
          <div className="status-indicator">
            <span className="status-dot"></span>
            Connected to Autodesk Cloud
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}

export default OverlaySystem;