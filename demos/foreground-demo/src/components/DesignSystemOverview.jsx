import React from 'react'
import { motion } from 'framer-motion'
import './DesignSystemOverview.css'

function DesignSystemOverview({ persona }) {
  const features = [
    {
      title: 'The Fauxdal Pattern',
      description: 'Full-screen interface with centered modal and vertical progress indicator',
      icon: '🎯',
      details: [
        'Transforms complex 401(k) paperwork into guided digital experiences',
        'Progressive disclosure shows only relevant fields',
        'Step-by-step validation prevents errors',
        'Clear progress builds user confidence'
      ]
    },
    {
      title: 'Adaptive Sophistication',
      description: 'Three-tier system serving different user needs',
      icon: '🎨',
      details: [
        'Employee: Maximum whitespace and simplicity',
        'Administrator: Balanced data and accessibility',
        'Operations: Bloomberg Terminal-style efficiency'
      ]
    },
    {
      title: 'Financial Iconography',
      description: 'Custom icons for 401(k)-specific concepts',
      icon: '💼',
      details: [
        'Vesting schedules visualization',
        'Employer matching indicators',
        'Distribution types',
        'Compliance requirements'
      ]
    },
    {
      title: 'Engineering Autonomy',
      description: 'Design system that enables independent implementation',
      icon: '⚡',
      details: [
        'High-level components with smart defaults',
        'Mixins for complex styling patterns',
        'Variables for consistent theming',
        'Self-documenting component API'
      ]
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="design-system-overview">
      <motion.div 
        className="overview-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="overview-title">Foreground Design System</h2>
        <p className="overview-subtitle">
          Built for Human Interest to unify experiences across three distinct user types 
          while enabling engineering autonomy. Currently viewing in <strong>{persona}</strong> mode.
        </p>
      </motion.div>

      <motion.div 
        className="feature-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="feature-card card"
            variants={item}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            <ul className="feature-details">
              {feature.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="impact-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h3 className="impact-title">Business Impact</h3>
        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-number">90%</div>
            <div className="impact-label">Reduction in UI confusion support calls</div>
          </div>
          <div className="impact-card">
            <div className="impact-number">50% → 10%</div>
            <div className="impact-label">Engineering time spent on UI implementation</div>
          </div>
          <div className="impact-card">
            <div className="impact-number">3 User Types</div>
            <div className="impact-label">Unified under one design system</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="context-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <h3 className="context-title">The Challenge</h3>
        <p className="context-text">
          As Human Interest's first designer, I joined when the company was struggling with 
          technical debt consuming 50% of engineering time. Three completely different user 
          types required vastly different sophistication levels: plan administrators needed 
          Bloomberg Terminal-level data density, employees wanted simple retirement guidance, 
          and operations teams required comprehensive dashboards. The Foreground Design System 
          unified these experiences while enabling engineers to implement designs independently.
        </p>
      </motion.div>
    </div>
  )
}

export default DesignSystemOverview