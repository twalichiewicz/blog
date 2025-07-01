---
title: UI Style Demo Sheet
layout: page
---

<style>
/* Demo Container Styling */
.style-demo-container {
  padding: 40px;
  background: #f9fafb;
  border-radius: 12px;
  margin: 20px 0;
}

@media (prefers-color-scheme: dark) {
  .style-demo-container {
    background: #1f2937;
  }
}

.demo-section {
  margin-bottom: 40px;
}

.demo-section h3 {
  margin-bottom: 20px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.6;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

/* Subtle Skeuomorphic Button Styles */
.ske-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
}

/* Primary Button - Warm terracotta */
.ske-button-primary {
  background: #b45f4d;
  color: white;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.ske-button-primary:hover {
  background: #a04d3b;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.ske-button-primary:active {
  background: #8c4130;
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 -0.5px 0 rgba(255, 255, 255, 0.1);
}

/* Secondary Button - Warm stone */
.ske-button-secondary {
  background: #e8e0d8;
  color: #524b44;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.ske-button-secondary:hover {
  background: #d9cfc5;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.ske-button-secondary:active {
  background: #c5b8aa;
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.1),
    inset 0 -0.5px 0 rgba(255, 255, 255, 0.3);
}

/* Success Button - Natural sage */
.ske-button-success {
  background: #8b9a7b;
  color: white;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.ske-button-success:hover {
  background: #7a8a6a;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Small Button Variant */
.ske-button-small {
  padding: 4px 12px;
  font-size: 12px;
}

/* Large Button Variant */
.ske-button-large {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 6px;
}

/* Icon Button */
.ske-button-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.ske-button-icon:hover {
  background: #f9fafb;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* Input Fields */
.ske-input {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.05),
    0 0.5px 0 rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
  width: 100%;
}

.ske-input:focus {
  outline: none;
  border-color: #b45f4d;
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.05),
    0 0 0 3px rgba(180, 95, 77, 0.1);
}

/* Select Dropdown */
.ske-select {
  padding: 8px 32px 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.05),
    0 0.5px 0 rgba(255, 255, 255, 0.5);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1L5 5L9 1' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

/* Checkbox */
.ske-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.ske-checkbox input {
  position: absolute;
  opacity: 0;
}

.ske-checkbox-box {
  width: 18px;
  height: 18px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background: white;
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.05),
    0 0.5px 0 rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ske-checkbox input:checked + .ske-checkbox-box {
  background: #b45f4d;
  border-color: #b45f4d;
}

.ske-checkbox input:checked + .ske-checkbox-box::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* Radio Button */
.ske-radio {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.ske-radio input {
  position: absolute;
  opacity: 0;
}

.ske-radio-circle {
  width: 18px;
  height: 18px;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  background: white;
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.05),
    0 0.5px 0 rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ske-radio input:checked + .ske-radio-circle::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b45f4d;
}

/* Card Component */
.ske-card {
  background: white;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 0.5px 0 rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Progress Bar */
.ske-progress {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.1),
    0 0.5px 0 rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

.ske-progress-fill {
  height: 100%;
  background: #b45f4d;
  width: 60%;
  transition: width 0.3s ease;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

/* Tab Component */
.ske-tabs {
  display: flex;
  gap: 2px;
  background: #e5e7eb;
  padding: 2px;
  border-radius: 6px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ske-tab {
  padding: 6px 16px;
  background: transparent;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.ske-tab.active {
  background: white;
  color: #111827;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* Badge */
.ske-badge {
  display: inline-flex;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
  background: #e8e0d8;
  color: #524b44;
  box-shadow: 
    0 0.5px 1px rgba(0, 0, 0, 0.05),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.5);
}

.ske-badge-primary {
  background: #f5d9d4;
  color: #8c4130;
}

.ske-badge-success {
  background: #e2e9db;
  color: #526443;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .ske-button-secondary {
    background: #374151;
    color: #e5e7eb;
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
  
  .ske-button-icon {
    background: #374151;
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
  
  .ske-input, .ske-select {
    background: #374151;
    border-color: #4b5563;
    color: #e5e7eb;
  }
  
  .ske-card {
    background: #1f2937;
    border-color: rgba(255, 255, 255, 0.05);
  }
  
  .ske-checkbox-box, .ske-radio-circle {
    background: #374151;
    border-color: #4b5563;
  }
  
  .ske-tabs {
    background: #374151;
  }
  
  .ske-tab.active {
    background: #1f2937;
    color: #e5e7eb;
  }
}
</style>

<div class="style-demo-container">
  <h2>Subtle Skeuomorphic UI Components</h2>
  <p style="opacity: 0.7; margin-bottom: 40px;">Extending the code sandbox toggle aesthetic to other UI elements</p>

  <div class="demo-section">
    <h3>Buttons</h3>
    <div class="demo-grid">
      <button class="ske-button ske-button-primary">Primary Button</button>
      <button class="ske-button ske-button-secondary">Secondary Button</button>
      <button class="ske-button ske-button-success">Success Button</button>
    </div>
    <div class="demo-grid" style="margin-top: 10px;">
      <button class="ske-button ske-button-primary ske-button-small">Small Button</button>
      <button class="ske-button ske-button-primary ske-button-large">Large Button</button>
      <button class="ske-button ske-button-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 4v16m8-8H4"/>
        </svg>
      </button>
    </div>
  </div>

  <div class="demo-section">
    <h3>Form Elements</h3>
    <div class="demo-grid">
      <input type="text" class="ske-input" placeholder="Text input">
      <select class="ske-select">
        <option>Select option</option>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
    </div>
    <div style="display: flex; gap: 20px; margin-top: 20px;">
      <label class="ske-checkbox">
        <input type="checkbox" checked>
        <span class="ske-checkbox-box"></span>
        <span style="margin-left: 8px;">Checkbox</span>
      </label>
      <label class="ske-radio">
        <input type="radio" name="radio-demo" checked>
        <span class="ske-radio-circle"></span>
        <span style="margin-left: 8px;">Radio 1</span>
      </label>
      <label class="ske-radio">
        <input type="radio" name="radio-demo">
        <span class="ske-radio-circle"></span>
        <span style="margin-left: 8px;">Radio 2</span>
      </label>
    </div>
  </div>

  <div class="demo-section">
    <h3>Tabs</h3>
    <div class="ske-tabs">
      <button class="ske-tab active">Tab 1</button>
      <button class="ske-tab">Tab 2</button>
      <button class="ske-tab">Tab 3</button>
    </div>
  </div>

  <div class="demo-section">
    <h3>Cards & Containers</h3>
    <div class="ske-card">
      <h4 style="margin: 0 0 8px 0;">Card Title</h4>
      <p style="margin: 0; opacity: 0.7;">This is a card component with subtle depth and clean styling.</p>
    </div>
  </div>

  <div class="demo-section">
    <h3>Progress & Badges</h3>
    <div class="ske-progress" style="margin-bottom: 20px;">
      <div class="ske-progress-fill"></div>
    </div>
    <div style="display: flex; gap: 10px;">
      <span class="ske-badge">Default</span>
      <span class="ske-badge ske-badge-primary">Primary</span>
      <span class="ske-badge ske-badge-success">Success</span>
    </div>
  </div>

  <div class="demo-section">
    <h3>Design Principles</h3>
    <div class="ske-card">
      <ul style="margin: 0; padding-left: 20px;">
        <li><strong>Subtle depth:</strong> Single inset shadow for recessed elements, minimal drop shadow for raised</li>
        <li><strong>Minimal gradients:</strong> Solid colors preferred, gradients only when necessary</li>
        <li><strong>Restrained effects:</strong> No glows, no multiple shadows, no heavy borders</li>
        <li><strong>Consistent lighting:</strong> Light source from top (inset highlight on top edge)</li>
        <li><strong>Fast transitions:</strong> 0.2s ease for snappy interactions</li>
        <li><strong>Muted colors:</strong> Lower saturation, focus on grays and subtle accents</li>
      </ul>
    </div>
  </div>
</div>