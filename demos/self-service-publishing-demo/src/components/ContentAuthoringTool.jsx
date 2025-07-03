import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check,
  Image,
  PlusCircle,
  Save,
  RotateCcw,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import clsx from 'clsx';
import { Button } from './ui/button';
import SuccessAnimation from './SuccessAnimation';

const ContentAuthoringTool = () => {
  const [insightName, setInsightName] = useState('');
  const [triggerUrl, setTriggerUrl] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [contentType, setContentType] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showExpandedOptions, setShowExpandedOptions] = useState(false);
  const [versionType, setVersionType] = useState('specific');
  const [startVersion, setStartVersion] = useState('');
  const [endVersion, setEndVersion] = useState('');
  const [distributionPlatforms, setDistributionPlatforms] = useState({
    inProduct: true,
    appHome: false,
    email: false
  });
  
  const [urlValid, setUrlValid] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Accordion states
  const [expandedAccordions, setExpandedAccordions] = useState({
    version: false,
    timing: false,
    audience: false,
    platforms: false
  });
  
  // Custom values for accordions
  const [customValues, setCustomValues] = useState({
    version: null,
    timing: null,
    audience: null,
    platforms: null
  });
  
  // Preview theme
  const [previewTheme, setPreviewTheme] = useState('dark');

  const validateUrl = (url) => {
    const pattern = /^https:\/\/wiki\.autodesk\.com\/[a-zA-Z0-9\/_-]+$/;
    return pattern.test(url);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setTriggerUrl(url);
    if (url) {
      setUrlValid(validateUrl(url));
    } else {
      setUrlValid(null);
    }
  };

  const products = [
    'AutoCAD',
    'Revit',
    'Fusion 360',
    'Maya',
    '3ds Max',
    'Inventor',
    'Civil 3D'
  ];

  // Content types are conditional based on selected product
  const getContentTypesForProduct = (product) => {
    switch(product) {
      case 'AutoCAD':
        return ['Command Recommendation', 'Feature Tip', 'Workflow Guide'];
      case 'Revit':
        return ['BIM Best Practice', 'Family Tips', 'Collaboration Guide'];
      case 'Fusion 360':
        return ['Design Tip', 'Manufacturing Guide', 'Simulation Insight'];
      case 'Maya':
        return ['Animation Technique', 'Rendering Tip', 'Workflow Enhancement'];
      case '3ds Max':
        return ['Modeling Tip', 'Visualization Guide', 'Plugin Recommendation'];
      case 'Inventor':
        return ['Assembly Best Practice', 'Drawing Standard', 'Part Design Tip'];
      case 'Civil 3D':
        return ['Survey Workflow', 'Corridor Design', 'Grading Best Practice'];
      default:
        return [];
    }
  };
  
  const contentTypes = getContentTypesForProduct(selectedProduct);

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    // Reset form
    setInsightName('');
    setTriggerUrl('');
    setAdditionalNotes('');
    setUrlValid(null);
    setSelectedProduct('');
  };
  
  // Progressive disclosure checks
  const isTriggerSectionEnabled = selectedProduct !== '';
  const isContentSectionEnabled = isTriggerSectionEnabled && (triggerUrl || additionalNotes);
  const isDeliverySectionEnabled = isContentSectionEnabled && contentType;
  
  // Accordion handlers
  const toggleAccordion = (key) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const resetAccordion = (key) => {
    setCustomValues(prev => ({
      ...prev,
      [key]: null
    }));
    setExpandedAccordions(prev => ({
      ...prev,
      [key]: false
    }));
  };
  
  // Helper to update platforms label
  const updatePlatformsLabel = () => {
    const selected = [];
    if (distributionPlatforms.inProduct) selected.push('In-product');
    if (distributionPlatforms.appHome) selected.push('App Home');
    if (distributionPlatforms.email) selected.push('Email');
    
    if (selected.length === 0) {
      setCustomValues(prev => ({...prev, platforms: 'No platforms selected'}));
    } else if (selected.length === 3) {
      setCustomValues(prev => ({...prev, platforms: null})); // Use default
    } else {
      setCustomValues(prev => ({...prev, platforms: selected.join(', ')}));
    }
  };

  return (
    <div className="content-authoring-tool">
      <AnimatePresence>
        {showSuccess && (
          <SuccessAnimation onComplete={handleSuccessComplete} />
        )}
      </AnimatePresence>
      {/* Header */}
      <header className="cat-header">
        <div className="cat-header-top">
          <h1 className="cat-title">Content Authoring Tool</h1>
        </div>
        <div className="cat-header-bottom">
          <div className="cat-insight-name">
            <input
              type="text"
              className="insight-name-input"
              placeholder="Untitled insight"
              value={insightName}
              onChange={(e) => setInsightName(e.target.value)}
            />
          </div>
          <div className="cat-header-actions">
            <button className="btn-outline">
              <span>Edit in Contentful</span>
              <ExternalLink size={14} />
            </button>
            <button className="btn-outline">
              <Save size={14} />
              <span>Save Draft</span>
            </button>
            <button 
              className="btn-primary"
              onClick={handleSubmit}
            >
              <span>Submit Request</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="cat-main">
        {/* Content Area */}
        <main className="cat-content">
          {/* Three Column Layout */}
          <div className="three-column-layout">
                  {/* When the user of... */}
                  <div className="column-section">
                    <h3 className="column-title">When the user of...</h3>
                    
                    <div className="form-group">
                      <label className="form-label">Autodesk product</label>
                      <select 
                        className="form-select"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                      >
                        <option value="">Select a product</option>
                        {products.map(product => (
                          <option key={product} value={product}>{product}</option>
                        ))}
                      </select>
                    </div>

                    <div className={`form-group ${!isTriggerSectionEnabled ? 'disabled' : ''}`}>
                      <label className="form-label">Trigger logic documentation URL</label>
                      <div className="url-input-wrapper">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="https://wiki.autodesk.com/autocad/insights"
                          value={triggerUrl}
                          onChange={handleUrlChange}
                          disabled={!isTriggerSectionEnabled}
                        />
                        {urlValid !== null && (
                          <div className={`url-validation-icon ${urlValid ? '' : 'invalid'}`}>
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                      <p className="helper-text">
                        Provide a link to your existing documentation (Operations Summary, wiki, etc.) to share trigger and success logic.
                      </p>
                    </div>

                    <div className={`form-group ${!isTriggerSectionEnabled ? 'disabled' : ''}`}>
                      <label className="form-label">Additional notes</label>
                      <textarea
                        className="form-textarea"
                        placeholder="This insight should trigger when the user completes a drawing manually. We want it to..."
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        disabled={!isTriggerSectionEnabled}
                      />
                      <p className="helper-text">
                        This message will be pasted directly to XAPA Operations, who will parse your intent and work with you to ensure the triggers are built out correctly.
                      </p>
                    </div>
                  </div>

                  {/* Then send them... */}
                  <div className={`column-section ${!isContentSectionEnabled ? 'disabled' : ''}`}>
                    <h3 className="column-title">Then send them...</h3>
                    
                    <div className="column-content">
                      <div className="form-group">
                        {contentTypes.length > 0 ? (
                          <select 
                            className="form-select"
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value)}
                            disabled={!isContentSectionEnabled}
                          >
                            <option value="">Select an insight type</option>
                            {contentTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="skeleton-select"></div>
                        )}
                      </div>

                      <div className="content-section">
                        <label className="content-label">With this content...</label>
                      {contentType ? (
                        <div className={`content-preview ${previewTheme === 'light' ? 'content-preview--light' : ''}`}>
                          <div className="preview-header">
                            {contentType.toUpperCase()}
                          </div>
                          <input
                            type="text"
                            className="preview-title"
                            placeholder="Lorem ipsum dolor sit amet"
                            disabled={!isContentSectionEnabled}
                          />
                          <div className="preview-media-area">
                            <Button variant="ghost" size="sm" disabled={!isContentSectionEnabled}>
                              <Image size={16} />
                              Add media
                            </Button>
                          </div>
                          <Button variant="outline" size="sm" disabled={!isContentSectionEnabled}>
                            <PlusCircle size={16} />
                            Add button
                          </Button>
                          <div className="preview-helpful">
                            <span>Is this insight helpful? 😊 😔</span>
                          </div>
                        </div>
                      ) : (
                        <div className="content-preview-placeholder"></div>
                      )}
                      
                      {/* High density action buttons - only show when content type is selected */}
                      {contentType && (
                        <div className="preview-actions">
                          <div className="preview-actions-left">
                            <select 
                              className="channel-select"
                              disabled={!isContentSectionEnabled}
                            >
                              <option value="app-home">App Home</option>
                              <option value="in-product">In-Product</option>
                              <option value="email">Email</option>
                            </select>
                          </div>
                          <div className="preview-actions-right">
                            <Button 
                              variant="outline"
                              size="sm"
                              title="Undo"
                              disabled={!isContentSectionEnabled}
                            >
                              <RotateCcw size={14} />
                              <span>Undo</span>
                            </Button>
                            <Button 
                              size="sm"
                              title="Save"
                              disabled={!isContentSectionEnabled}
                            >
                              <Save size={14} />
                              <span>Save</span>
                            </Button>
                          </div>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>

                  {/* And use these delivery instructions... */}
                  <div className={`column-section ${!isDeliverySectionEnabled ? 'disabled' : ''}`}>
                    <h3 className="column-title">And use these delivery instructions...</h3>
                    
                    <div className="delivery-section">
                      {/* Version Accordion */}
                      <div className="accordion-item">
                        <div className={`accordion-header ${expandedAccordions.version ? 'expanded' : ''}`}>
                          <span className="accordion-label">
                            {customValues.version || "Latest version onward"}
                          </span>
                          {expandedAccordions.version ? (
                            <button 
                              className="accordion-reset-btn"
                              onClick={() => resetAccordion('version')}
                              disabled={!isDeliverySectionEnabled}
                            >
                              Reset
                            </button>
                          ) : (
                            <button 
                              className="accordion-edit-btn"
                              onClick={() => toggleAccordion('version')}
                              disabled={!isDeliverySectionEnabled}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                        <AnimatePresence>
                          {expandedAccordions.version && (
                            <motion.div
                              className="accordion-content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="form-group">
                                <label className="form-label">Version targeting</label>
                                <div className="radio-group">
                                  <label className="radio-label">
                                    <input
                                      type="radio"
                                      name="version"
                                      checked={versionType === 'latest'}
                                      onChange={() => {
                                        setVersionType('latest');
                                        setCustomValues(prev => ({...prev, version: 'Latest version onward'}));
                                      }}
                                    />
                                    Latest version onward
                                  </label>
                                  <label className="radio-label">
                                    <input
                                      type="radio"
                                      name="version"
                                      checked={versionType === 'specific'}
                                      onChange={() => {
                                        setVersionType('specific');
                                        setCustomValues(prev => ({...prev, version: 'Specific version'}));
                                      }}
                                    />
                                    Specific version
                                  </label>
                                  <label className="radio-label">
                                    <input
                                      type="radio"
                                      name="version"
                                      checked={versionType === 'range'}
                                      onChange={() => setVersionType('range')}
                                    />
                                    Version range
                                  </label>
                                </div>
                              </div>
                              {versionType === 'range' && (
                                <div className="version-range-inputs">
                                  <select 
                                    className="form-select"
                                    value={startVersion}
                                    onChange={(e) => {
                                      setStartVersion(e.target.value);
                                      if (e.target.value && endVersion) {
                                        setCustomValues(prev => ({...prev, version: `${e.target.value} - ${endVersion}`}));
                                      }
                                    }}
                                  >
                                    <option value="">Start version</option>
                                    <option value="2023.1">2023.1</option>
                                    <option value="2023.2">2023.2</option>
                                    <option value="2024.1">2024.1</option>
                                  </select>
                                  <span className="range-separator">to</span>
                                  <select 
                                    className="form-select"
                                    value={endVersion}
                                    onChange={(e) => {
                                      setEndVersion(e.target.value);
                                      if (startVersion && e.target.value) {
                                        setCustomValues(prev => ({...prev, version: `${startVersion} - ${e.target.value}`}));
                                      }
                                    }}
                                  >
                                    <option value="">End version</option>
                                    <option value="2024.1">2024.1</option>
                                    <option value="2024.2">2024.2</option>
                                    <option value="2025.1">2025.1</option>
                                  </select>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Timing Accordion */}
                      <div className="accordion-item">
                        <div className={`accordion-header ${expandedAccordions.timing ? 'expanded' : ''}`}>
                          <span className="accordion-label">
                            {customValues.timing || "Circulate immediately"}
                          </span>
                          {expandedAccordions.timing ? (
                            <button 
                              className="accordion-reset-btn"
                              onClick={() => resetAccordion('timing')}
                              disabled={!isDeliverySectionEnabled}
                            >
                              Reset
                            </button>
                          ) : (
                            <button 
                              className="accordion-edit-btn"
                              onClick={() => toggleAccordion('timing')}
                              disabled={!isDeliverySectionEnabled}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                        <AnimatePresence>
                          {expandedAccordions.timing && (
                            <motion.div
                              className="accordion-content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="form-group">
                                <label className="form-label">Schedule delivery</label>
                                <input 
                                  type="datetime-local" 
                                  className="form-input"
                                  onChange={(e) => {
                                    const date = new Date(e.target.value);
                                    setCustomValues(prev => ({
                                      ...prev, 
                                      timing: `Scheduled for ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
                                    }));
                                  }}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Audience Accordion */}
                      <div className="accordion-item">
                        <div className={`accordion-header ${expandedAccordions.audience ? 'expanded' : ''}`}>
                          <span className="accordion-label">
                            {customValues.audience || "All applicable users"}
                          </span>
                          {expandedAccordions.audience ? (
                            <button 
                              className="accordion-reset-btn"
                              onClick={() => resetAccordion('audience')}
                              disabled={!isDeliverySectionEnabled}
                            >
                              Reset
                            </button>
                          ) : (
                            <button 
                              className="accordion-edit-btn"
                              onClick={() => toggleAccordion('audience')}
                              disabled={!isDeliverySectionEnabled}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                        <AnimatePresence>
                          {expandedAccordions.audience && (
                            <motion.div
                              className="accordion-content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="form-group">
                                <label className="form-label">Target audience</label>
                                <select 
                                  className="form-select"
                                  onChange={(e) => setCustomValues(prev => ({...prev, audience: e.target.value}))}
                                >
                                  <option value="">Select audience</option>
                                  <option value="New users (< 30 days)">New users (&lt; 30 days)</option>
                                  <option value="Active users">Active users</option>
                                  <option value="Power users">Power users</option>
                                  <option value="Subscription admins">Subscription admins</option>
                                  <option value="Custom segment">Custom segment</option>
                                </select>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Platforms Accordion */}
                      <div className="accordion-item">
                        <div className={`accordion-header ${expandedAccordions.platforms ? 'expanded' : ''}`}>
                          <span className="accordion-label">
                            {customValues.platforms || "Across all distribution platforms"}
                          </span>
                          {expandedAccordions.platforms ? (
                            <button 
                              className="accordion-reset-btn"
                              onClick={() => resetAccordion('platforms')}
                              disabled={!isDeliverySectionEnabled}
                            >
                              Reset
                            </button>
                          ) : (
                            <button 
                              className="accordion-edit-btn"
                              onClick={() => toggleAccordion('platforms')}
                              disabled={!isDeliverySectionEnabled}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                        <AnimatePresence>
                          {expandedAccordions.platforms && (
                            <motion.div
                              className="accordion-content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="form-group">
                                <label className="form-label">Select platforms</label>
                                <div className="checkbox-group">
                                  <label className="checkbox-label">
                                    <input
                                      type="checkbox"
                                      checked={distributionPlatforms.inProduct}
                                      onChange={(e) => {
                                        setDistributionPlatforms({
                                          ...distributionPlatforms,
                                          inProduct: e.target.checked
                                        });
                                        updatePlatformsLabel();
                                      }}
                                    />
                                    In-product
                                  </label>
                                  <label className="checkbox-label">
                                    <input
                                      type="checkbox"
                                      checked={distributionPlatforms.appHome}
                                      onChange={(e) => {
                                        setDistributionPlatforms({
                                          ...distributionPlatforms,
                                          appHome: e.target.checked
                                        });
                                        updatePlatformsLabel();
                                      }}
                                    />
                                    App Home
                                  </label>
                                  <label className="checkbox-label">
                                    <input
                                      type="checkbox"
                                      checked={distributionPlatforms.email}
                                      onChange={(e) => {
                                        setDistributionPlatforms({
                                          ...distributionPlatforms,
                                          email: e.target.checked
                                        });
                                        updatePlatformsLabel();
                                      }}
                                    />
                                    Email
                                  </label>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
        </main>
      </div>
    </div>
  );
};

export default ContentAuthoringTool;