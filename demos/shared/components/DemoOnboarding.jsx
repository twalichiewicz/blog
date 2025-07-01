import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronRight, ChevronLeft, Maximize2, Info, Code, Lightbulb } from 'lucide-react';
import { useDemoContext } from './utils/iframe-detection.js';
import './demo-onboarding.css';

/**
 * DemoOnboarding - Reusable onboarding system for portfolio demos
 * 
 * @param {Object} props
 * @param {Array} props.steps - Array of onboarding steps with highlights and commentary
 * @param {Function} props.onComplete - Callback when onboarding completes
 * @param {Function} props.onStart - Callback when onboarding starts
 * @param {string} props.demoTitle - Title of the demo
 * @param {string} props.demoDescription - Brief description of the demo
 * @param {React.ReactNode} props.children - Demo content
 */
const DemoOnboarding = ({ 
  steps = [], 
  onComplete, 
  onStart,
  demoTitle = "Interactive Demo",
  demoDescription = "Click the demo button to start the guided tour",
  children 
}) => {
  const demoContext = useDemoContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCommentary, setShowCommentary] = useState(true);

  // If we're in an iframe, don't show any onboarding UI - just render children
  if (demoContext.isIframe) {
    return <>{children}</>;
  }

  // Handle fullscreen expansion
  const enterFullscreen = useCallback(() => {
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
    
    // Find and expand blog-content
    const blogContent = document.querySelector('.blog-content');
    if (blogContent) {
      blogContent.classList.add('demo-fullscreen');
    }

    // Notify parent
    if (onStart) onStart();
  }, [onStart]);

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
    setIsOnboarding(false);
    document.body.style.overflow = '';
    
    // Remove fullscreen class
    const blogContent = document.querySelector('.blog-content');
    if (blogContent) {
      blogContent.classList.remove('demo-fullscreen');
    }

    // Reset to first step
    setCurrentStep(0);
    
    // Notify parent
    if (onComplete) onComplete();
  }, [onComplete]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOnboarding) return;
      
      switch(e.key) {
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'Escape':
          exitFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOnboarding, currentStep, exitFullscreen]);

  const startOnboarding = () => {
    enterFullscreen();
    setIsOnboarding(true);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      exitFullscreen();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep] || {};

  return (
    <>
      {/* Main Demo Content - Always visible */}
      <div className={`demo-container ${isFullscreen ? 'fullscreen' : ''}`}>
        {children}
        
        {/* Floating Demo Button - Only show when not in fullscreen */}
        {!isFullscreen && (
          <motion.div 
            className="demo-start-floating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
          >
            <button className="demo-start-button" onClick={startOnboarding}>
              <Play size={20} />
              Start Demo Tour
            </button>
          </motion.div>
        )}
      </div>

      {/* Onboarding Overlay */}
      <AnimatePresence>
        {isFullscreen && isOnboarding && (
          <motion.div
            className="onboarding-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close Button */}
            <button className="onboarding-close" onClick={exitFullscreen}>
              <X size={24} />
            </button>

            {/* Progress Bar */}
            <div className="onboarding-progress">
              <div 
                className="onboarding-progress-bar"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="onboarding-steps">
              {steps.map((_, index) => (
                <button
                  key={index}
                  className={`step-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                  onClick={() => setCurrentStep(index)}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="onboarding-navigation">
              <button 
                className="nav-button prev"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className="nav-button next"
                onClick={handleNext}
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Highlight Area */}
            {currentStepData.highlight && (
              <motion.div
                className="onboarding-highlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={currentStepData.highlightStyle || {}}
              />
            )}

            {/* Commentary Panel */}
            <motion.div
              className={`commentary-panel ${showCommentary ? 'open' : 'closed'}`}
              initial={{ x: -400 }}
              animate={{ x: showCommentary ? 0 : -350 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button 
                className="commentary-toggle"
                onClick={() => setShowCommentary(!showCommentary)}
              >
                <Info size={20} />
              </button>

              <div className="commentary-content">
                <h3>{currentStepData.title}</h3>
                
                <div className="commentary-section">
                  <Lightbulb size={16} className="commentary-icon" />
                  <div>
                    <h4>What You're Seeing</h4>
                    <p>{currentStepData.description}</p>
                  </div>
                </div>

                {currentStepData.developerNote && (
                  <div className="commentary-section developer-note">
                    <Code size={16} className="commentary-icon" />
                    <div>
                      <h4>Developer Commentary</h4>
                      <p>{currentStepData.developerNote}</p>
                    </div>
                  </div>
                )}

                {currentStepData.businessImpact && (
                  <div className="commentary-section business-impact">
                    <Info size={16} className="commentary-icon" />
                    <div>
                      <h4>Business Impact</h4>
                      <p>{currentStepData.businessImpact}</p>
                    </div>
                  </div>
                )}

                {currentStepData.metrics && (
                  <div className="metrics-grid">
                    {currentStepData.metrics.map((metric, index) => (
                      <div key={index} className="metric-card">
                        <div className="metric-value">{metric.value}</div>
                        <div className="metric-label">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Feature Callouts */}
            {currentStepData.callouts && (
              <div className="feature-callouts">
                {currentStepData.callouts.map((callout, index) => (
                  <motion.div
                    key={index}
                    className="feature-callout"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      position: 'absolute',
                      ...callout.position
                    }}
                  >
                    <div className="callout-dot" />
                    <div className="callout-line" />
                    <div className="callout-content">
                      <h5>{callout.title}</h5>
                      <p>{callout.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DemoOnboarding;