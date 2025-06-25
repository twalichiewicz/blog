import React from 'react'
import { motion } from 'framer-motion'
import './PersonaSwitcher.css'

function PersonaSwitcher({ activePersona, personas, onPersonaChange }) {
  return (
    <div className="persona-switcher">
      <label className="persona-label">Viewing as:</label>
      <div className="persona-buttons">
        {Object.entries(personas).map(([key, persona]) => (
          <button
            key={key}
            className={`persona-button ${activePersona === key ? 'active' : ''}`}
            onClick={() => onPersonaChange(key)}
            title={persona.description}
          >
            {activePersona === key && (
              <motion.div
                className="active-indicator"
                layoutId="activePersona"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35
                }}
              />
            )}
            <span className="persona-name">{persona.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PersonaSwitcher