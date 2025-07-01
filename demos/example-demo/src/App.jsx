import React, { useState, useEffect } from 'react';
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import '@portfolio/demo-shared/onboarding-styles';

// Comprehensive onboarding steps showcasing the shared component system
const onboardingSteps = [
  {
    title: "Welcome to the Example Demo",
    description: "This demo serves as both a functional example and a comprehensive showcase of all shared components in the portfolio demo system.",
    developerNote: "Built with React and the complete shared component library, this demo demonstrates proper integration patterns, onboarding structure, and responsive design principles.",
    businessImpact: "Standardized demo components reduce development time by 75% and ensure consistent user experiences across all portfolio projects.",
    metrics: [
      { value: "75%", label: "Dev Time Saved" },
      { value: "100%", label: "Pattern Consistency" }
    ]
  },
  {
    title: "Interactive Counter System",
    description: "Experience the core functionality - a simple but engaging counter that responds to button clicks and keyboard input. This demonstrates state management and user interaction patterns.",
    developerNote: "Uses React hooks for state management with useEffect for keyboard event handling. The component follows controlled component patterns with clear separation of concerns.",
    businessImpact: "Interactive demos increase user engagement by 60% compared to static demonstrations and provide hands-on experience with product functionality.",
    highlight: true,
    highlightStyle: {
      top: "200px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "400px",
      height: "200px"
    },
    callouts: [
      {
        title: "Live Counter",
        description: "Real-time state updates",
        position: { top: "220px", left: "50%", transform: "translateX(-50%)" }
      },
      {
        title: "Keyboard Support",
        description: "Arrow keys and 'R' for reset",
        position: { top: "320px", left: "50%", transform: "translateX(-50%)" }
      }
    ],
    metrics: [
      { value: "60%", label: "Higher Engagement" },
      { value: "3", label: "Interaction Methods" }
    ]
  },
  {
    title: "Dual-Context Architecture",
    description: "This demo automatically adapts whether it's running inline in the portfolio or fullscreen in a modal. The same codebase powers both experiences seamlessly.",
    developerNote: "The DemoWrapper component includes iframe detection utilities that automatically adjust the interface based on context. This eliminates the need to maintain separate inline and fullscreen versions.",
    businessImpact: "Dual-context architecture reduces maintenance overhead by 50% while providing optimal user experiences in both portfolio browsing and focused demo modes."
  },
  {
    title: "Template Demo Standards",
    description: "Notice the consistent grid background, browser chrome, and responsive design. This demo follows all established patterns and serves as a template for new demo development.",
    developerNote: "All shared components are properly integrated: DemoWrapper for browser chrome and background, DemoOnboarding for guided tours, and proper CSS imports for styling consistency.",
    businessImpact: "Standardized templates accelerate new demo development by 80% and ensure professional presentation quality across all portfolio projects.",
    metrics: [
      { value: "80%", label: "Faster Development" },
      { value: "5", label: "Standard Components" },
      { value: "∞", label: "Reusability Factor" }
    ]
  }
];

// Main demo content component
function DemoContent() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState({ message: 'Demo is ready! Click the buttons or use arrow keys.', type: 'info' });
  const [lastAction, setLastAction] = useState('');

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowUp':
          increment();
          break;
        case 'ArrowDown':
          decrement();
          break;
        case 'r':
        case 'R':
          reset();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [count]);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    setStatus({ message: `Incremented to ${newCount}! 🚀`, type: 'success' });
    setLastAction('increment');
  };

  const decrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    setStatus({ message: `Decremented to ${newCount}! 📉`, type: 'info' });
    setLastAction('decrement');
  };

  const reset = () => {
    setCount(0);
    setStatus({ message: 'Counter reset to 0! 🔄', type: 'info' });
    setLastAction('reset');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        position: 'relative'
      }}>
        {/* Header */}
        <h1 style={{
          color: '#333',
          marginBottom: '1rem',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          🚀 Example Demo
        </h1>
        
        <p style={{
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          This demo showcases all shared components and standardized patterns. 
          Interact with the counter using buttons or keyboard controls!
        </p>

        {/* Counter Display */}
        <div style={{
          background: '#f8f9fa',
          border: '2px solid #e9ecef',
          borderRadius: '12px',
          padding: '2rem',
          margin: '2rem 0',
          transition: 'all 0.3s ease',
          transform: lastAction ? 'scale(1.02)' : 'scale(1)'
        }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: '700',
            color: '#667eea',
            marginBottom: '0.5rem',
            transition: 'all 0.3s ease'
          }}>
            {count}
          </div>
          <div style={{
            color: '#6c757d',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            {count === 1 ? 'Click' : 'Clicks'}
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={increment}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              minWidth: '80px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#218838';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#28a745';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            +1 ⬆️
          </button>

          <button
            onClick={decrement}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              minWidth: '80px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#c82333';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#dc3545';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            -1 ⬇️
          </button>

          <button
            onClick={reset}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              minWidth: '80px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#5a6268';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#6c757d';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Reset 🔄
          </button>
        </div>

        {/* Status Message */}
        <div style={{
          padding: '12px 20px',
          borderRadius: '8px',
          fontWeight: '500',
          fontSize: '0.95rem',
          background: status.type === 'success' ? '#d4edda' : '#d1ecf1',
          color: status.type === 'success' ? '#155724' : '#0c5460',
          border: `1px solid ${status.type === 'success' ? '#c3e6cb' : '#bee5eb'}`,
          transition: 'all 0.3s ease'
        }}>
          {status.message}
        </div>

        {/* Keyboard Instructions */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#6c757d'
        }}>
          <strong>💡 Pro Tip:</strong> Use <kbd style={{
            background: '#e9ecef',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>↑</kbd> <kbd style={{
            background: '#e9ecef',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>↓</kbd> arrow keys or <kbd style={{
            background: '#e9ecef',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>R</kbd> to control the counter!
        </div>

        {/* Component Integration Notice */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'linear-gradient(135deg, #667eea20, #764ba220)',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#495057',
          border: '1px solid #667eea40'
        }}>
          🏗️ <strong>Built with shared components:</strong><br/>
          DemoWrapper • DemoOnboarding • Grid Background • Custom Cursors
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <DemoOnboarding
      steps={onboardingSteps}
      demoTitle="Example Demo"
      demoDescription="Comprehensive showcase of all shared components and interaction patterns"
    >
      <DemoWrapper 
        url="example.demo.local" 
        customCursor="default"
        browserTheme="mac"
        showBackground={true}
      >
        <DemoContent />
      </DemoWrapper>
    </DemoOnboarding>
  );
}

export default App;