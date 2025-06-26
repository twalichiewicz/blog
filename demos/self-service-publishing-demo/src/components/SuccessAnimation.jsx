import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const SuccessAnimation = ({ onComplete }) => {
  return (
    <motion.div
      className="success-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '400px'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 15,
            delay: 0.4
          }}
        >
          <CheckCircle 
            size={64} 
            style={{ 
              color: '#28a745',
              marginBottom: '24px'
            }} 
          />
        </motion.div>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2c2c2c',
            marginBottom: '16px'
          }}
        >
          Insight Published!
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '32px',
            lineHeight: '1.5'
          }}
        >
          Your content is now live and will reach users within the next 2 hours.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            padding: '24px',
            background: '#f5f6f7',
            borderRadius: '8px',
            marginBottom: '24px'
          }}
        >
          <div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#0696d7' }}>
              250x
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Faster than before
            </div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#0696d7' }}>
              2 hours
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Time to publish
            </div>
          </div>
        </motion.div>
        
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={onComplete}
          style={{
            background: '#0696d7',
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Another
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SuccessAnimation;