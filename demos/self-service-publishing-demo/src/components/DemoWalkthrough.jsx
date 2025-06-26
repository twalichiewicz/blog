import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

const walkthroughSteps = [
  {
    title: "Welcome to LINO",
    content: "This is the Content Authoring Tool that transformed Autodesk's publishing from 3-4 weeks to just 2 hours.",
    highlight: null
  },
  {
    title: "Three-Column Workflow",
    content: "The interface guides you through: 1) When to show content, 2) What content to show, 3) How to deliver it.",
    highlight: "three-column"
  },
  {
    title: "Behavioral Targeting",
    content: "Define triggers using simple dropdowns and wiki links instead of complex code queries.",
    highlight: "behavioral"
  },
  {
    title: "Visual Content Editor",
    content: "See exactly how your content will appear to users with our WYSIWYG preview.",
    highlight: "preview"
  },
  {
    title: "Smart Distribution",
    content: "Control versions, platforms, and user segments with intuitive controls.",
    highlight: "distribution"
  }
];

const DemoWalkthrough = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWalkthrough, setShowWalkthrough] = useState(true);

  const handleNext = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setShowWalkthrough(false);
    onComplete();
  };

  if (!showWalkthrough) return null;

  const step = walkthroughSteps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        className="walkthrough-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 999,
          pointerEvents: 'all'
        }}
      >
        <motion.div
          className="walkthrough-tooltip"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          <button
            onClick={handleComplete}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} color="#999" />
          </button>

          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#2c2c2c',
            marginBottom: '12px'
          }}>
            {step.title}
          </h3>

          <p style={{
            fontSize: '16px',
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '24px'
          }}>
            {step.content}
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              gap: '6px'
            }}>
              {walkthroughSteps.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: index === currentStep ? '#0696d7' : '#ddd',
                    transition: 'background 0.3s'
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              style={{
                background: '#0696d7',
                color: 'white',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {currentStep === walkthroughSteps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Highlight areas based on current step */}
        {step.highlight && (
          <motion.div
            className={`walkthrough-highlight walkthrough-highlight--${step.highlight}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              border: '3px solid #0696d7',
              borderRadius: '8px',
              pointerEvents: 'none',
              boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.5)'
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoWalkthrough;