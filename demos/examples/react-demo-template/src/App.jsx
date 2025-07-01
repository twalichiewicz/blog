import React, { useState } from 'react';
import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import '@portfolio/demo-shared/onboarding-styles';

// Comprehensive onboarding steps showcasing the shared component capabilities
const onboardingSteps = [
  {
    title: "Welcome to the Demo Template",
    description: "This template showcases all shared components and patterns used across portfolio demos. It demonstrates the standard grid background, browser chrome, and onboarding system.",
    developerNote: "This template uses the DemoWrapper component which provides consistent browser chrome, grid background patterns, and custom cursor support across all demos.",
    businessImpact: "Standardized components reduce development time by 75% and ensure visual consistency across all portfolio demos.",
    metrics: [
      { value: "75%", label: "Dev Time Saved" },
      { value: "100%", label: "Visual Consistency" }
    ]
  },
  {
    title: "Interactive Features",
    description: "Experience the interactive elements with custom cursor behavior. The demo automatically detects if it's running inline or in fullscreen mode.",
    developerNote: "The dual-context system automatically adapts the UI based on iframe detection. Custom cursors provide app-like feel without overwhelming the portfolio browsing experience.",
    highlight: true,
    highlightStyle: {
      top: "180px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "400px",
      height: "300px"
    },
    callouts: [
      {
        title: "Custom Cursor",
        description: "Enterprise-style cursor enhances UX",
        position: { top: "200px", left: "50%", transform: "translateX(-50%)" }
      },
      {
        title: "Responsive Design",
        description: "Adapts to all screen sizes",
        position: { top: "350px", left: "50%", transform: "translateX(-50%)" }
      }
    ]
  },
  {
    title: "Grid Background System",
    description: "The signature grid background creates a professional maker's mark pattern that's consistent across all demos while supporting both light and dark themes.",
    developerNote: "The grid is generated with CSS repeating-linear-gradient for optimal performance. It includes subtle border treatment and automatic dark mode support.",
    businessImpact: "Professional visual treatment elevates portfolio presentation and creates memorable brand consistency."
  },
  {
    title: "Component Integration",
    description: "This template demonstrates proper integration of DemoWrapper and DemoOnboarding components with all configuration options.",
    developerNote: "All shared components are imported from @portfolio/demo-shared and include TypeScript-like prop validation for reliability.",
    metrics: [
      { value: "6", label: "Shared Components" },
      { value: "3", label: "Browser Themes" },
      { value: "4", label: "Background Patterns" },
      { value: "∞", label: "Customization Options" }
    ]
  }
];

// Demo content component showcasing various interaction patterns
function DemoContent() {
  const [activeTab, setActiveTab] = useState('features');
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCount(count + 1);
    setIsLoading(false);
  };

  const tabs = [
    { id: 'features', label: 'Features', icon: '⚡' },
    { id: 'components', label: 'Components', icon: '🧩' },
    { id: 'patterns', label: 'Patterns', icon: '🎨' }
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: '0 0 0.5rem 0',
            fontSize: '2.5rem',
            fontWeight: '700'
          }}>
            Portfolio Demo Template
          </h1>
          <p style={{ 
            margin: 0,
            fontSize: '1.2rem',
            opacity: 0.9
          }}>
            Showcasing shared components and interaction patterns
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #f1f5f9',
          background: '#fafbfc'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '1rem 2rem',
                border: 'none',
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#4f46e5' : '#64748b',
                fontSize: '1rem',
                fontWeight: '600',
                borderBottom: activeTab === tab.id ? '2px solid #4f46e5' : '2px solid transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ padding: '3rem' }}>
          {activeTab === 'features' && (
            <div>
              <h2 style={{ color: '#1e293b', marginBottom: '1.5rem' }}>
                Interactive Features
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  padding: '2rem',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ color: '#334155', marginBottom: '1rem' }}>
                    🎯 Action Counter
                  </h3>
                  <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                    Demonstrate async actions with loading states and user feedback.
                  </p>
                  <button
                    onClick={handleAction}
                    disabled={isLoading}
                    style={{
                      background: isLoading ? '#94a3b8' : '#4f46e5',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      opacity: isLoading ? 0.7 : 1,
                      transform: isLoading ? 'scale(0.98)' : 'scale(1)'
                    }}
                  >
                    {isLoading ? '⏳ Processing...' : `🚀 Take Action (${count})`}
                  </button>
                </div>

                <div style={{
                  padding: '2rem',
                  background: '#f0fdf4',
                  borderRadius: '12px',
                  border: '1px solid #bbf7d0'
                }}>
                  <h3 style={{ color: '#166534', marginBottom: '1rem' }}>
                    📊 Real-time Metrics
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '2rem', 
                        fontWeight: '700', 
                        color: '#059669' 
                      }}>
                        {count * 42}
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: '#065f46',
                        fontWeight: '500'
                      }}>
                        Events Processed
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '2rem', 
                        fontWeight: '700', 
                        color: '#059669' 
                      }}>
                        {Math.round(count * 1.5)}s
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: '#065f46',
                        fontWeight: '500'
                      }}>
                        Response Time
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div>
              <h2 style={{ color: '#1e293b', marginBottom: '1.5rem' }}>
                Shared Components
              </h2>
              <div style={{
                display: 'grid',
                gap: '1.5rem'
              }}>
                {[
                  {
                    name: 'DemoWrapper',
                    description: 'Provides browser chrome, background patterns, and custom cursors',
                    features: ['Mac/Windows/Minimal themes', 'Grid background patterns', 'Custom cursor system', 'Responsive design']
                  },
                  {
                    name: 'DemoOnboarding',
                    description: 'Rich guided tour system with highlights and callouts',
                    features: ['Step-by-step navigation', 'Highlight overlays', 'Business metrics display', 'Developer commentary']
                  },
                  {
                    name: 'BrowserChrome',
                    description: 'Realistic browser window chrome for authentic feel',
                    features: ['Platform-specific styling', 'Functional address bar', 'Window controls', 'Secure connection indicator']
                  }
                ].map((component, index) => (
                  <div key={index} style={{
                    padding: '2rem',
                    background: 'white',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.2s ease'
                  }}>
                    <h3 style={{ 
                      color: '#4f46e5', 
                      marginBottom: '0.5rem',
                      fontSize: '1.25rem',
                      fontWeight: '700'
                    }}>
                      {component.name}
                    </h3>
                    <p style={{ 
                      color: '#64748b', 
                      marginBottom: '1rem',
                      lineHeight: '1.6'
                    }}>
                      {component.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      {component.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          style={{
                            background: '#ede9fe',
                            color: '#6b46c1',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'patterns' && (
            <div>
              <h2 style={{ color: '#1e293b', marginBottom: '1.5rem' }}>
                Design Patterns
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem'
              }}>
                {[
                  { pattern: 'Dual-Context UI', description: 'Automatically adapts for inline vs fullscreen viewing', color: '#ef4444' },
                  { pattern: 'Progressive Disclosure', description: 'Complex features revealed when needed', color: '#f59e0b' },
                  { pattern: 'Loading States', description: 'Clear feedback during async operations', color: '#10b981' },
                  { pattern: 'Responsive Design', description: 'Optimized for all screen sizes', color: '#3b82f6' },
                  { pattern: 'Cursor Context', description: 'App-appropriate cursor styling', color: '#8b5cf6' },
                  { pattern: 'Dark Mode Support', description: 'Automatic theme adaptation', color: '#6b7280' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '12px',
                    border: '2px solid #f1f5f9',
                    borderLeft: `4px solid ${item.color}`,
                    transition: 'all 0.2s ease'
                  }}>
                    <h3 style={{ 
                      color: item.color, 
                      marginBottom: '0.5rem',
                      fontSize: '1.125rem',
                      fontWeight: '600'
                    }}>
                      {item.pattern}
                    </h3>
                    <p style={{ 
                      color: '#64748b', 
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          background: '#f8fafc',
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{ 
            color: '#64748b', 
            margin: 0,
            fontSize: '0.875rem'
          }}>
            🎨 Replace this content with your actual demo implementation<br/>
            📚 All shared components are documented and ready to use
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <DemoOnboarding
      steps={onboardingSteps}
      demoTitle="Portfolio Demo Template"
      demoDescription="Comprehensive template showcasing all shared components and best practices"
    >
      <DemoWrapper 
        url="demo.template.local" 
        customCursor="enterprise"
        browserTheme="mac"
        showBackground={true}
      >
        <DemoContent />
      </DemoWrapper>
    </DemoOnboarding>
  );
}

export default App;