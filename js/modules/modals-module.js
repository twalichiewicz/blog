/**
 * Modals Module for San Diego Theme
 * Handles all modal functionality
 */
(function(SD) {
  'use strict';

  class ModalsModule {
    constructor() {
      this.activeModals = new Set();
      this.keyboardListeners = new Map();
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;

      // Set up modal close on backdrop click
      this.setupBackdropListeners();
      
      this.initialized = true;
      SD.events.emit('modals:initialized');
    }

    setupBackdropListeners() {
      document.addEventListener('click', (event) => {
        // Check if click is on a modal backdrop
        if (event.target.classList.contains('modal') && event.target === event.currentTarget) {
          const modalId = event.target.id;
          if (modalId === 'impact-modal') {
            this.closeImpact();
          } else if (modalId === 'contact-modal') {
            this.closeContact();
          }
        }
      });
    }

    openModal(modalId, options = {}) {
      const modal = document.getElementById(modalId);
      if (!modal) {
        return;
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Show modal
      modal.style.display = 'flex';
      
      // Add to active modals
      this.activeModals.add(modalId);

      // Set up keyboard listener
      const keyboardHandler = (event) => {
        if (event.key === 'Escape') {
          this.closeModal(modalId);
        }
      };
      this.keyboardListeners.set(modalId, keyboardHandler);
      document.addEventListener('keydown', keyboardHandler);

      // Trigger animation after a brief delay
      setTimeout(() => {
        modal.classList.add('active');
      }, 10);

      // Play sound effect if available
      if (SD.utils.sound && SD.utils.sound.isEnabled()) {
        SD.utils.sound.playSmallClick();
      }

      SD.events.emit('modal:opened', { modalId });
    }

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;

      // Remove active class for animation
      modal.classList.remove('active');

      // Remove keyboard listener
      const keyboardHandler = this.keyboardListeners.get(modalId);
      if (keyboardHandler) {
        document.removeEventListener('keydown', keyboardHandler);
        this.keyboardListeners.delete(modalId);
      }

      // Hide modal after animation
      setTimeout(() => {
        modal.style.display = 'none';
        
        // Remove from active modals
        this.activeModals.delete(modalId);
        
        // Restore body scroll if no modals are active
        if (this.activeModals.size === 0) {
          document.body.style.overflow = '';
        }
      }, 300);

      SD.events.emit('modal:closed', { modalId });
    }

    // Specific modal methods for backward compatibility
    openImpact(event) {
      if (event) {
        event.stopPropagation();
      }
      this.openModal('impact-modal');
    }

    closeImpact() {
      this.closeModal('impact-modal');
    }

    openContact(event) {
      if (event) {
        event.stopPropagation();
      }
      this.openModal('contact-modal');
    }

    closeContact() {
      this.closeModal('contact-modal');
    }

    // Check if a modal is open
    isModalOpen(modalId) {
      return this.activeModals.has(modalId);
    }

    // Get all active modals
    getActiveModals() {
      return Array.from(this.activeModals);
    }

    // Close all modals
    closeAll() {
      this.activeModals.forEach(modalId => {
        this.closeModal(modalId);
      });
    }
  }

  // Create and register the module
  const modalsModule = new ModalsModule();
  
  // Register with SD namespace
  SD.ui.modals = modalsModule;
  SD.registerModule('modals', modalsModule);

  // Bind methods to maintain context
  SD.ui.modals.openImpact = modalsModule.openImpact.bind(modalsModule);
  SD.ui.modals.closeImpact = modalsModule.closeImpact.bind(modalsModule);
  SD.ui.modals.openContact = modalsModule.openContact.bind(modalsModule);
  SD.ui.modals.closeContact = modalsModule.closeContact.bind(modalsModule);

})(window.SD || (window.SD = {}));