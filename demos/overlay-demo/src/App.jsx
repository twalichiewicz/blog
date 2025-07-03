import React, { useState, useEffect } from 'react';
import { DemoOnboarding } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import { motion, AnimatePresence } from 'framer-motion';
import MacOSDesktop from './components/MacOSDesktop-new';
import './App.css';

const onboardingSteps = [
  {
    title: "Welcome to the Universal Intelligence Layer",
    description: "This demo showcases how a unified overlay system can enhance all Autodesk desktop applications with cloud-connected intelligence.",
    developerNote: "Designed as a singleton React application that runs across all desktop products",
    businessImpact: "$10M+ in potential savings by eliminating duplicate feature development",
    metrics: [
      { value: "60+", label: "Applications" },
      { value: "1", label: "Codebase" }
    ]
  },
  {
    title: "Cross-Application Context",
    description: "Click on different CAD applications to see how the overlay maintains context and provides relevant tools across your entire workflow.",
    developerNote: "Bidirectional communication with host applications through standardized API",
    metrics: [
      { value: "100%", label: "Context Retention" },
      { value: "0ms", label: "Switch Time" }
    ]
  },
  {
    title: "Intelligent Assistance",
    description: "Press Shift+Space to activate the overlay and see contextual AI assistance, project history, and collaborative tools.",
    developerNote: "React-based overlay with cloud state synchronization and real-time collaboration features",
    businessImpact: "Transform fragmented workflows into cohesive experiences, reducing project completion time by 35% and eliminating 80% of tool-switching delays.",
    metrics: [
      { value: "35%", label: "Faster Projects" },
      { value: "80%", label: "Less Tool Switching" }
    ]
  }
];

function App() {
  const [overlayActive, setOverlayActive] = useState({
    fusion: false,
    autocad: false,
    revit: false
  });
  const [activeApp, setActiveApp] = useState('fusion');
  const [overlayContent, setOverlayContent] = useState('assistant');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        setOverlayActive(prev => ({
          ...prev,
          [activeApp]: !prev[activeApp]
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeApp]);

  return (
    <DemoOnboarding steps={onboardingSteps}>
      <div className="overlay-demo">
        <MacOSDesktop 
          activeApp={activeApp}
          setActiveApp={setActiveApp}
          overlayActive={overlayActive}
          toggleOverlay={(appId) => setOverlayActive(prev => ({
            ...prev,
            [appId]: !prev[appId]
          }))}
        />
      </div>
    </DemoOnboarding>
  );
}

export default App;