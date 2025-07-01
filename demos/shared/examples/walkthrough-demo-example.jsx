// Example: How to add walkthrough support to your demo
import React, { useEffect, useRef } from 'react';
import { DemoWrapper, WalkthroughSupport, createWalkthroughSteps } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';

function WalkthroughDemoExample() {
  const walkthroughRef = useRef(null);
  const highlightRef = useRef(null);
  
  useEffect(() => {
    // Define your walkthrough steps
    const steps = createWalkthroughSteps({
      welcome: {
        title: 'Welcome to Custom Install Demo',
        description: 'This demo showcases a seamless installation experience'
      },
      features: [
        {
          title: 'Smart Detection',
          description: 'The system automatically detects your Autodesk products',
          highlight: '.product-list',
          duration: 4000
        },
        {
          title: 'One-Click Installation',
          description: 'Install multiple add-ins with a single click',
          highlight: '.install-button',
          interaction: 'click',
          duration: 5000
        },
        {
          title: 'Real-time Progress',
          description: 'Track installation progress for each product',
          highlight: '.progress-bars',
          duration: 4000
        }
      ],
      conclusion: {
        title: 'Ready to Explore',
        description: 'Try installing some add-ins yourself!'
      }
    });
    
    // Initialize walkthrough support
    walkthroughRef.current = new WalkthroughSupport(steps);
    
    // Handle step changes
    walkthroughRef.current.on('stepStart', (stepIndex, step) => {
      console.log('Starting step:', step.title);
      
      // Highlight elements if specified
      if (step.highlight && highlightRef.current) {
        const element = document.querySelector(step.highlight);
        if (element) {
          // Add highlight class or overlay
          element.classList.add('walkthrough-highlight');
        }
      }
      
      // Handle interactions
      if (step.interaction === 'click') {
        const element = document.querySelector(step.highlight);
        if (element) {
          element.addEventListener('click', handleInteraction);
        }
      }
    });
    
    walkthroughRef.current.on('stepEnd', (stepIndex) => {
      // Clean up highlights
      document.querySelectorAll('.walkthrough-highlight').forEach(el => {
        el.classList.remove('walkthrough-highlight');
      });
    });
    
    const handleInteraction = () => {
      // Complete the current step when user performs the action
      walkthroughRef.current.completeStep();
    };
    
    // Cleanup
    return () => {
      if (walkthroughRef.current) {
        walkthroughRef.current.end();
      }
    };
  }, []);
  
  return (
    <DemoWrapper url="install.autodesk.com">
      <div className="demo-content">
        <div className="product-list">
          <h2>Detected Products</h2>
          <ul>
            <li>AutoCAD 2024</li>
            <li>Revit 2024</li>
            <li>3ds Max 2024</li>
          </ul>
        </div>
        
        <button className="install-button">
          Install All Add-ins
        </button>
        
        <div className="progress-bars">
          <div className="progress-item">
            <span>AutoCAD Add-in</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .demo-content {
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .product-list {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .product-list h2 {
          margin: 0 0 15px 0;
          font-size: 20px;
        }
        
        .product-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .product-list li {
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .product-list li:last-child {
          border-bottom: none;
        }
        
        .install-button {
          background: #0696d7;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          margin-bottom: 30px;
        }
        
        .install-button:hover {
          background: #0584c2;
          transform: translateY(-2px);
        }
        
        .progress-bars {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
        }
        
        .progress-item {
          margin-bottom: 15px;
        }
        
        .progress-item:last-child {
          margin-bottom: 0;
        }
        
        .progress-item span {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .progress-bar {
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: #0696d7;
          transition: width 0.3s ease;
        }
        
        /* Walkthrough highlight style */
        .walkthrough-highlight {
          position: relative;
          box-shadow: 0 0 0 4px #0696d7, 0 0 20px rgba(6, 150, 215, 0.5);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 4px #0696d7, 0 0 20px rgba(6, 150, 215, 0.5);
          }
          50% {
            box-shadow: 0 0 0 6px #0696d7, 0 0 30px rgba(6, 150, 215, 0.7);
          }
          100% {
            box-shadow: 0 0 0 4px #0696d7, 0 0 20px rgba(6, 150, 215, 0.5);
          }
        }
      `}</style>
    </DemoWrapper>
  );
}

export default WalkthroughDemoExample;