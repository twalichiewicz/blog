import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared'
import '@portfolio/demo-shared/styles'
import './App.css'

// Components
import FauxdalEnrollment from './components/FauxdalEnrollment'
import ComponentLibrary from './components/ComponentLibrary'
import PersonaSwitcher from './components/PersonaSwitcher'
import DesignSystemOverview from './components/DesignSystemOverview'

// Persona configurations
const personas = {
  employee: {
    name: 'Employee',
    description: 'Simple, approachable interface',
    density: 'comfortable',
    complexity: 'basic'
  },
  admin: {
    name: 'Administrator',
    description: 'Balanced data and usability',
    density: 'standard',
    complexity: 'intermediate'
  },
  operations: {
    name: 'Operations',
    description: 'Bloomberg Terminal efficiency',
    density: 'compact',
    complexity: 'advanced'
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [activePersona, setActivePersona] = useState('employee')
  const [enrollmentComplete, setEnrollmentComplete] = useState(false)

  // Handle postMessage for demo reinitialization
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'reinitialize') {
        console.log('[Foreground Demo] Received reinitialize message:', event.data.reason)
        // Reset demo to initial state
        setActiveTab('overview')
        setActivePersona('employee')
        setEnrollmentComplete(false)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'fauxdal', label: 'Fauxdal Demo', icon: '📝' },
    { id: 'components', label: 'Component Library', icon: '🧩' }
  ]

  const onboardingSteps = [
    {
      title: "Welcome to Foreground",
      description: "Explore the design system that unified Human Interest's product ecosystem across three distinct user types.",
      developerNote: "Built with React, this demo showcases adaptive components that change complexity based on user persona.",
      businessImpact: "Reduced UI confusion support calls by 90% and engineering implementation time from 50% to 10%.",
      metrics: [
        { value: "90%", label: "Fewer Support Calls" },
        { value: "50%→10%", label: "Engineering Time" }
      ]
    },
    {
      title: "Persona Switching",
      description: "Use the persona switcher in the top-right to see how the same components adapt for Employee, Administrator, and Operations users.",
      developerNote: "CSS custom properties and density classes dynamically adjust information density and interaction complexity.",
      businessImpact: "Single component library served users ranging from first-time 401(k) savers to financial professionals.",
      metrics: [
        { value: "3", label: "User Types" },
        { value: "1", label: "Component Library" }
      ]
    },
    {
      title: "The Fauxdal Pattern",
      description: "Experience our signature 'fauxdal' innovation that transforms complex 401(k) paperwork into guided digital experiences.",
      developerNote: "Progressive disclosure pattern with step validation, similar to DocuSign but without showing actual forms until completion.",
      businessImpact: "Reduced form abandonment by 75% while maintaining full compliance with financial regulations.",
      metrics: [
        { value: "75%", label: "Less Abandonment" },
        { value: "100%", label: "Regulatory Compliance" }
      ]
    },
    {
      title: "Component Library",
      description: "Browse the adaptive component system that enabled autonomous engineering implementation without designer oversight.",
      developerNote: "Three abstraction levels: high-level components, mixins, and design tokens for different implementation needs.",
      businessImpact: "Enabled company growth from startup to unicorn status with a lean design team.",
      metrics: [
        { value: "3", label: "Abstraction Levels" },
        { value: "Startup→Unicorn", label: "Growth Enabled" }
      ]
    }
  ]

  return (
    <DemoOnboarding steps={onboardingSteps} demoTitle="Foreground Design System">
      <DemoWrapper url="foreground.design/system" browserTheme="minimal" customCursor="design-system">
        <div className={`app persona-${activePersona} density-${personas[activePersona].density}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">Foreground Design System</h1>
            <p className="app-subtitle">Financial complexity made simple</p>
          </div>
          <PersonaSwitcher
            activePersona={activePersona}
            personas={personas}
            onPersonaChange={setActivePersona}
          />
        </div>
      </header>

      {/* Navigation */}
      <nav className="tab-navigation">
        <div className="tab-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DesignSystemOverview persona={activePersona} />
            </motion.div>
          )}

          {activeTab === 'fauxdal' && (
            <motion.div
              key="fauxdal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FauxdalEnrollment
                persona={activePersona}
                onComplete={() => setEnrollmentComplete(true)}
                isComplete={enrollmentComplete}
                onReset={() => setEnrollmentComplete(false)}
              />
            </motion.div>
          )}

          {activeTab === 'components' && (
            <motion.div
              key="components"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ComponentLibrary persona={activePersona} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="impact-metrics">
            <div className="metric">
              <strong>90%</strong>
              <span>Reduction in UI confusion</span>
            </div>
            <div className="metric">
              <strong>50% → 10%</strong>
              <span>Engineering time on UI</span>
            </div>
            <div className="metric">
              <strong>External Recognition</strong>
              <span>Brand New - Under Consideration</span>
            </div>
          </div>
        </div>
      </footer>
        </div>
      </DemoWrapper>
    </DemoOnboarding>
  )
}

export default App