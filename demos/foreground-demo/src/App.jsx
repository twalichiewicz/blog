import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'fauxdal', label: 'Fauxdal Demo', icon: '📝' },
    { id: 'components', label: 'Component Library', icon: '🧩' }
  ]

  return (
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
  )
}

export default App