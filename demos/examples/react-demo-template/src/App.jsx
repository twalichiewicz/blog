import React, { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        color: '#333',
        marginBottom: '1rem',
        fontSize: '2rem' 
      }}>
        Demo Template
      </h1>
      
      <p style={{ 
        color: '#666', 
        marginBottom: '2rem',
        lineHeight: '1.5'
      }}>
        This is a React demo template. Replace this content with your actual demo.
      </p>
      
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#0056b3'}
          onMouseOut={(e) => e.target.style.background = '#007bff'}
        >
          Count: {count}
        </button>
      </div>
      
      <p style={{ 
        color: '#888', 
        fontSize: '14px',
        fontStyle: 'italic'
      }}>
        Edit src/App.jsx to customize this demo
      </p>
    </div>
  )
}

export default App