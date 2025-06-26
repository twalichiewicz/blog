import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  FileText, 
  Link2, 
  BarChart2, 
  Check,
  Image,
  PlusCircle,
  Save,
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import clsx from 'clsx';
import SuccessAnimation from './SuccessAnimation';

const ContentAuthoringTool = () => {
  const [insightName, setInsightName] = useState('');
  const [triggerUrl, setTriggerUrl] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [contentType, setContentType] = useState('Command Recommendation');
  const [selectedProduct, setSelectedProduct] = useState('AutoCAD');
  const [showExpandedOptions, setShowExpandedOptions] = useState(false);
  const [versionType, setVersionType] = useState('specific');
  const [startVersion, setStartVersion] = useState('');
  const [endVersion, setEndVersion] = useState('');
  const [distributionPlatforms, setDistributionPlatforms] = useState({
    inProduct: true,
    appHome: false,
    email: false
  });
  
  const [activeTab, setActiveTab] = useState('create');
  const [urlValid, setUrlValid] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const contentTypes = [
    'Command Recommendation',
    'Feature Tip',
    'Best Practice',
    'Workflow Guide',
    'Quick Start'
  ];

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
        <h1 className="cat-title">Content Authoring Tool</h1>
        <div className="cat-header-actions">
          <button className="button button-secondary">
            Edit in Contentful →
          </button>
          <button className="button button-secondary">
            Save Draft
          </button>
          <button 
            className="button button-primary"
            onClick={handleSubmit}
          >
            Submit Request →
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="cat-main">
        {/* Sidebar */}
        <aside className="cat-sidebar">
          <Lightbulb 
            className={clsx('sidebar-icon', { active: activeTab === 'create' })}
            onClick={() => setActiveTab('create')}
          />
          <FileText 
            className={clsx('sidebar-icon', { active: activeTab === 'library' })}
            onClick={() => setActiveTab('library')}
          />
          <Link2 
            className={clsx('sidebar-icon', { active: activeTab === 'connections' })}
            onClick={() => setActiveTab('connections')}
          />
          <BarChart2 
            className={clsx('sidebar-icon', { active: activeTab === 'analytics' })}
            onClick={() => setActiveTab('analytics')}
          />
        </aside>

        {/* Content Area */}
        <main className="cat-content">
          <AnimatePresence mode="wait">
            {activeTab === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Insight Name */}
                <div className="cat-form">
                  <div className="form-group">
                    <label className="form-label">Insight name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="New insight"
                      value={insightName}
                      onChange={(e) => setInsightName(e.target.value)}
                    />
                  </div>
                </div>

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
                        {products.map(product => (
                          <option key={product} value={product}>{product}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Does this...</label>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                        Trigger logic documentation URL
                      </p>
                      <div className="url-input-wrapper">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="https://wiki.autodesk.com/autocad/insights"
                          value={triggerUrl}
                          onChange={handleUrlChange}
                        />
                        {urlValid !== null && (
                          <Check 
                            className="url-validation-icon" 
                            style={{ color: urlValid ? '#28a745' : '#dc3545' }}
                          />
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                        Provide a link to your existing documentation (Operations Summary, wiki, etc.) to share trigger and success logic.
                      </p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Additional notes</label>
                      <textarea
                        className="form-textarea"
                        placeholder="This insight should trigger when the user completes a drawing manually. We want it to..."
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                      />
                      <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                        This message will be pasted directly to XAPA Operations, who will parse your intent and work with you to ensure the triggers are built out correctly.
                      </p>
                    </div>
                  </div>

                  {/* Then send them... */}
                  <div className="column-section">
                    <h3 className="column-title">Then send them...</h3>
                    
                    <div className="form-group">
                      <select 
                        className="form-select"
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                      >
                        {contentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">With this content...</label>
                      <div className="content-preview">
                        <div className="preview-header">{contentType.toUpperCase()}</div>
                        <input
                          type="text"
                          className="preview-title"
                          placeholder="Lorem ipsum dolor sit amet"
                        />
                        <div className="preview-media-area">
                          <button className="add-media-button">
                            <Image size={16} />
                            Add media
                          </button>
                        </div>
                        <button className="add-button-secondary">
                          <PlusCircle size={16} />
                          Add button
                        </button>
                        <div className="preview-helpful">
                          <span>Is this insight helpful? 😊 😔</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <select className="form-select">
                        <option>App Home (dark)</option>
                        <option>App Home (light)</option>
                        <option>In-Product</option>
                        <option>Email</option>
                      </select>
                    </div>
                  </div>

                  {/* And use these delivery instructions... */}
                  <div className="column-section">
                    <h3 className="column-title">And use these delivery instructions...</h3>
                    
                    <div className="delivery-section">
                      <div className="delivery-item">
                        <span className="delivery-label">Latest version onward</span>
                        <button 
                          className="button-link"
                          onClick={() => setShowExpandedOptions(!showExpandedOptions)}
                        >
                          Edit
                        </button>
                      </div>
                      <div className="delivery-item">
                        <span className="delivery-label">Circulate immediately</span>
                        <button className="button-link">Edit</button>
                      </div>
                      <div className="delivery-item">
                        <span className="delivery-label">All applicable users</span>
                        <button className="button-link">Edit</button>
                      </div>
                      <div className="delivery-item">
                        <span className="delivery-label">Across all distribution platforms</span>
                        <button 
                          className="button-link"
                          onClick={() => setShowExpandedOptions(!showExpandedOptions)}
                        >
                          {showExpandedOptions ? 'Reset' : 'Edit'}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Options */}
                    <AnimatePresence>
                      {showExpandedOptions && (
                        <motion.div
                          className="expanded-options"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="form-group">
                            <label className="form-label">Specific versions:</label>
                            <div className="radio-group">
                              <label className="radio-label">
                                <input
                                  type="radio"
                                  name="version"
                                  checked={versionType === 'specific'}
                                  onChange={() => setVersionType('specific')}
                                />
                                Specific version...
                              </label>
                              <label className="radio-label">
                                <input
                                  type="radio"
                                  name="version"
                                  checked={versionType === 'range'}
                                  onChange={() => setVersionType('range')}
                                />
                                Range
                              </label>
                            </div>
                          </div>

                          {versionType === 'range' && (
                            <div className="dropdown-group">
                              <div className="form-group">
                                <label className="form-label">Starting version</label>
                                <select 
                                  className="form-select"
                                  value={startVersion}
                                  onChange={(e) => setStartVersion(e.target.value)}
                                >
                                  <option value="">Select version</option>
                                  <option value="2023.1">2023.1</option>
                                  <option value="2023.2">2023.2</option>
                                  <option value="2024.1">2024.1</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <label className="form-label">through</label>
                                <select 
                                  className="form-select"
                                  value={endVersion}
                                  onChange={(e) => setEndVersion(e.target.value)}
                                >
                                  <option value="">Ending version</option>
                                  <option value="2024.1">2024.1</option>
                                  <option value="2024.2">2024.2</option>
                                  <option value="2025.1">2025.1</option>
                                </select>
                              </div>
                            </div>
                          )}

                          <div className="form-group">
                            <label className="form-label">Specific distribution platforms:</label>
                            <div className="checkbox-group">
                              <label className="checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={distributionPlatforms.inProduct}
                                  onChange={(e) => setDistributionPlatforms({
                                    ...distributionPlatforms,
                                    inProduct: e.target.checked
                                  })}
                                />
                                In-product
                              </label>
                              <label className="checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={distributionPlatforms.appHome}
                                  onChange={(e) => setDistributionPlatforms({
                                    ...distributionPlatforms,
                                    appHome: e.target.checked
                                  })}
                                />
                                App Home
                              </label>
                              <label className="checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={distributionPlatforms.email}
                                  onChange={(e) => setDistributionPlatforms({
                                    ...distributionPlatforms,
                                    email: e.target.checked
                                  })}
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
              </motion.div>
            )}

            {activeTab === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="cat-form"
                style={{ textAlign: 'center', padding: '80px 40px' }}
              >
                <FileText size={48} style={{ color: '#999', marginBottom: '16px' }} />
                <h2 style={{ color: '#2c2c2c', marginBottom: '8px' }}>Content Library</h2>
                <p style={{ color: '#666' }}>Access your saved insights and templates</p>
              </motion.div>
            )}

            {activeTab === 'connections' && (
              <motion.div
                key="connections"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="cat-form"
                style={{ textAlign: 'center', padding: '80px 40px' }}
              >
                <Link2 size={48} style={{ color: '#999', marginBottom: '16px' }} />
                <h2 style={{ color: '#2c2c2c', marginBottom: '8px' }}>Connections</h2>
                <p style={{ color: '#666' }}>Manage integrations and data sources</p>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="cat-form"
                style={{ textAlign: 'center', padding: '80px 40px' }}
              >
                <BarChart2 size={48} style={{ color: '#999', marginBottom: '16px' }} />
                <h2 style={{ color: '#2c2c2c', marginBottom: '8px' }}>Analytics</h2>
                <p style={{ color: '#666' }}>Track performance and engagement metrics</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="cat-footer">
        <div className="footer-left">
          <select className="form-select" style={{ width: 'auto' }}>
            <option>App Home (dark)</option>
            <option>App Home (light)</option>
            <option>In-Product</option>
            <option>Email</option>
          </select>
        </div>
        <div className="footer-actions">
          <button className="button button-secondary">
            Undo
          </button>
          <button className="button button-primary">
            <Save size={16} />
            Save
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ContentAuthoringTool;