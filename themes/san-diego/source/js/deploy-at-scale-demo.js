document.addEventListener('DOMContentLoaded', function() {
  const demo = document.querySelector('.deploy-at-scale-demo');
  if (!demo) return;

  // State management
  const state = {
    view: 'library', // 'library' or 'creator'
    activeTab: 'my-library',
    selectedPackages: new Set(),
    currentStep: 1,
    selectedApps: [],
    customizations: {},
    deploymentSettings: {},
    isFullscreen: false,
    zoom: 1
  };

  // Generate random package data
  function generatePackageData() {
    const products = ['AutoCAD', 'Revit', 'Civil 3D', 'Inventor', 'Navisworks', 'Fusion 360', '3ds Max', 'Maya'];
    const versions = ['2024', '2023', '2022'];
    const types = ['Full', 'LT', 'Pro', 'Standard'];
    const statuses = ['Active', 'Testing', 'Archived'];
    
    return Array(12).fill(null).map((_, i) => {
      const product = products[Math.floor(Math.random() * products.length)];
      const version = versions[Math.floor(Math.random() * versions.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      
      return {
        id: `pkg-${i + 1}`,
        name: `${product} ${version} ${type}`,
        product: product,
        version: version,
        language: ['English', 'French', 'German', 'Spanish'][Math.floor(Math.random() * 4)],
        created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        modified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        deployments: Math.floor(Math.random() * 500) + 10,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      };
    });
  }

  // Initialize demo
  function initDemo() {
    renderView();
    setupEventListeners();
    setupZoomControls();
    setupFullscreenTransitions();
  }

  // Render current view
  function renderView() {
    const container = demo.querySelector('.demo-container');
    
    if (state.view === 'library') {
      container.innerHTML = renderLibraryView();
      setupLibraryInteractions();
    } else {
      container.innerHTML = renderCreatorView();
      setupCreatorInteractions();
    }
  }

  // Library View
  function renderLibraryView() {
    const packages = generatePackageData();
    
    return `
      <div class="library-view">
        <div class="library-header">
          <div class="tabs">
            <button class="tab ${state.activeTab === 'my-library' ? 'active' : ''}" data-tab="my-library">
              My Library
            </button>
            <button class="tab ${state.activeTab === 'team-library' ? 'active' : ''}" data-tab="team-library">
              Team Library
            </button>
          </div>
        </div>
        
        <div class="library-controls">
          <button class="create-package-btn">
            <svg class="icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Create Package
          </button>
          <div class="search-container">
            <input type="text" class="search-input" placeholder="Search packages">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M10 10l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        
        <div class="packages-table">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" class="select-all"></th>
                <th>Package Name</th>
                <th>Product</th>
                <th>Version</th>
                <th>Language</th>
                <th>Created</th>
                <th>Modified</th>
                <th>Deployments</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${packages.map(pkg => `
                <tr data-id="${pkg.id}">
                  <td><input type="checkbox" class="select-package"></td>
                  <td class="editable-name" data-original="${pkg.name}">
                    <span class="package-name">${pkg.name}</span>
                    <input type="text" class="edit-input" value="${pkg.name}" style="display: none;">
                  </td>
                  <td>${pkg.product}</td>
                  <td>${pkg.version}</td>
                  <td>${pkg.language}</td>
                  <td>${pkg.created}</td>
                  <td>${pkg.modified}</td>
                  <td>${pkg.deployments}</td>
                  <td><span class="status status-${pkg.status.toLowerCase()}">${pkg.status}</span></td>
                  <td class="actions">
                    <button class="kebab-menu">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
                        <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                        <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
                      </svg>
                    </button>
                    <div class="menu-options" style="display: none;">
                      <button class="menu-option">Edit</button>
                      <button class="menu-option">Duplicate</button>
                      <button class="menu-option">Deploy</button>
                      <button class="menu-option">Archive</button>
                      <button class="menu-option delete">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="library-footer">
          <button class="btn-secondary" disabled>Deploy Selected</button>
          <button class="btn-primary create-new">Create New Package</button>
        </div>
      </div>
    `;
  }

  // Creator View
  function renderCreatorView() {
    return `
      <div class="creator-view">
        <div class="creator-header">
          <button class="back-btn">← Back to Library</button>
          <h2>Create Deployment Package</h2>
        </div>
        
        <div class="creator-content">
          <div class="left-column">
            <div class="step-card ${state.currentStep === 1 ? 'expanded' : 'collapsed'}" data-step="1">
              <div class="step-header">
                <div class="step-number ${state.currentStep >= 1 ? 'completed' : ''}">1</div>
                <div class="step-info">
                  <h3>Select Applications</h3>
                  <p>Choose products and customize settings</p>
                </div>
                <button class="step-toggle">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <div class="step-content" style="${state.currentStep === 1 ? '' : 'display: none;'}">
                ${renderApplicationSelector()}
              </div>
            </div>
            
            <div class="step-card ${state.currentStep === 2 ? 'expanded' : 'collapsed'}" data-step="2">
              <div class="step-header">
                <div class="step-number ${state.currentStep >= 2 ? 'completed' : ''}">2</div>
                <div class="step-info">
                  <h3>Deployment Settings</h3>
                  <p>Configure installation options</p>
                </div>
                <button class="step-toggle">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <div class="step-content" style="${state.currentStep === 2 ? '' : 'display: none;'}">
                ${renderDeploymentSettings()}
              </div>
            </div>
          </div>
          
          <div class="right-column">
            ${state.currentStep === 1 ? renderProductDetails() : renderCheckoutSummary()}
          </div>
        </div>
        
        ${state.currentStep === 2 ? `
          <div class="creator-footer">
            <button class="btn-secondary save-btn">Save Package</button>
            <button class="btn-primary download-btn">Download Installer</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderApplicationSelector() {
    const apps = [
      { id: 'autocad', name: 'AutoCAD 2024', icon: '🔧' },
      { id: 'revit', name: 'Revit 2024', icon: '🏗️' },
      { id: 'civil3d', name: 'Civil 3D 2024', icon: '🛣️' },
      { id: 'inventor', name: 'Inventor 2024', icon: '⚙️' },
      { id: 'navisworks', name: 'Navisworks 2024', icon: '🔍' },
      { id: 'fusion360', name: 'Fusion 360', icon: '🔄' }
    ];
    
    return `
      <div class="app-selector">
        <div class="app-grid">
          ${apps.map(app => `
            <div class="app-card ${state.selectedApps.includes(app.id) ? 'selected' : ''}" data-app="${app.id}">
              <div class="app-icon">${app.icon}</div>
              <div class="app-name">${app.name}</div>
              <div class="app-checkbox">
                <input type="checkbox" ${state.selectedApps.includes(app.id) ? 'checked' : ''}>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="btn-primary next-btn" ${state.selectedApps.length === 0 ? 'disabled' : ''}>
          Next: Configure Deployment →
        </button>
      </div>
    `;
  }

  function renderDeploymentSettings() {
    return `
      <div class="deployment-settings">
        <div class="setting-group">
          <h4>Deployment Type</h4>
          <label class="radio-option">
            <input type="radio" name="deploy-type" value="install" checked>
            <span>User Install</span>
            <small>Users can run installer with customizations</small>
          </label>
          <label class="radio-option">
            <input type="radio" name="deploy-type" value="deploy">
            <span>Admin Deployment</span>
            <small>Silent installation via SCCM/network</small>
          </label>
        </div>
        
        <div class="setting-group">
          <h4>Installation Options</h4>
          <label class="checkbox-option">
            <input type="checkbox" checked>
            <span>Create desktop shortcuts</span>
          </label>
          <label class="checkbox-option">
            <input type="checkbox" checked>
            <span>Add to Start menu</span>
          </label>
          <label class="checkbox-option">
            <input type="checkbox">
            <span>Create system restore point</span>
          </label>
        </div>
        
        <div class="setting-group">
          <h4>Log Settings</h4>
          <label>
            <span>Log file location</span>
            <input type="text" class="input-field" value="%TEMP%\\Autodesk\\Install.log">
          </label>
          <label>
            <span>Network share path</span>
            <input type="text" class="input-field" placeholder="\\\\server\\deployments">
          </label>
        </div>
      </div>
    `;
  }

  function renderProductDetails() {
    if (state.selectedApps.length === 0) {
      return `
        <div class="details-card">
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
              <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" stroke-width="2"/>
              <path d="M16 20h16M16 28h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p>Select an application to view details</p>
          </div>
        </div>
      `;
    }
    
    const selectedApp = state.selectedApps[0]; // Show first selected
    
    return `
      <div class="details-card">
        <h3>AutoCAD 2024 Details</h3>
        
        <div class="detail-row">
          <span>Version:</span>
          <strong>2024.1.2</strong>
        </div>
        <div class="detail-row">
          <span>Language:</span>
          <strong>English</strong>
        </div>
        <div class="detail-row">
          <span>License Type:</span>
          <strong>Network</strong>
        </div>
        
        <div class="customization-accordions">
          <div class="accordion expanded">
            <button class="accordion-header">
              <span>App Customization</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="accordion-content">
              <label class="checkbox-option">
                <input type="checkbox" checked>
                <span>Express Tools</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox">
                <span>Batch Standards Checker</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" checked>
                <span>Reference Manager</span>
              </label>
            </div>
          </div>
          
          <div class="accordion">
            <button class="accordion-header">
              <span>Extensions</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="accordion-content" style="display: none;">
              <label class="checkbox-option">
                <input type="checkbox">
                <span>Advance Steel</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox">
                <span>MEP Toolkit</span>
              </label>
            </div>
          </div>
          
          <div class="accordion">
            <button class="accordion-header">
              <span>Language Packs</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="accordion-content" style="display: none;">
              <label class="checkbox-option">
                <input type="checkbox">
                <span>French</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox">
                <span>German</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox">
                <span>Spanish</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCheckoutSummary() {
    return `
      <div class="checkout-card">
        <h3>Package Summary</h3>
        
        <div class="selected-apps">
          ${state.selectedApps.map(appId => `
            <div class="app-summary-item">
              <div class="app-info">
                <strong>AutoCAD 2024</strong>
                <small>3 customizations, 2 extensions</small>
              </div>
              <button class="view-details-btn" data-app="${appId}">
                View Details
              </button>
            </div>
          `).join('')}
        </div>
        
        <div class="summary-stats">
          <div class="stat">
            <span>Total Size:</span>
            <strong>4.2 GB</strong>
          </div>
          <div class="stat">
            <span>Install Time:</span>
            <strong>~45 min</strong>
          </div>
          <div class="stat">
            <span>Applications:</span>
            <strong>${state.selectedApps.length}</strong>
          </div>
        </div>
      </div>
    `;
  }

  // Setup event listeners
  function setupEventListeners() {
    // Delegation for dynamic content
    demo.addEventListener('click', (e) => {
      // Tab switching
      if (e.target.matches('.tab')) {
        state.activeTab = e.target.dataset.tab;
        renderView();
      }
      
      // Create new package
      if (e.target.matches('.create-new, .create-package-btn')) {
        state.view = 'creator';
        state.currentStep = 1;
        renderView();
      }
      
      // Back to library
      if (e.target.matches('.back-btn')) {
        state.view = 'library';
        renderView();
      }
      
      // Step navigation
      if (e.target.matches('.next-btn')) {
        state.currentStep = 2;
        renderView();
      }
      
      // Save/Download
      if (e.target.matches('.save-btn, .download-btn')) {
        handleSaveDownload(e.target.classList.contains('download-btn'));
      }
    });
  }

  function setupLibraryInteractions() {
    const table = demo.querySelector('.packages-table');
    if (!table) return;
    
    // Package name editing
    table.addEventListener('click', (e) => {
      if (e.target.matches('.package-name')) {
        const cell = e.target.closest('.editable-name');
        const span = cell.querySelector('.package-name');
        const input = cell.querySelector('.edit-input');
        
        span.style.display = 'none';
        input.style.display = 'block';
        input.focus();
        input.select();
      }
    });
    
    // Save on blur or enter
    table.addEventListener('blur', (e) => {
      if (e.target.matches('.edit-input')) {
        savePackageName(e.target);
      }
    }, true);
    
    table.addEventListener('keydown', (e) => {
      if (e.target.matches('.edit-input') && e.key === 'Enter') {
        e.preventDefault();
        savePackageName(e.target);
      }
    });
    
    // Hover menu expansion
    table.addEventListener('mouseenter', (e) => {
      if (e.target.matches('tr')) {
        const menu = e.target.querySelector('.menu-options');
        if (menu) {
          menu.style.display = 'flex';
        }
      }
    }, true);
    
    table.addEventListener('mouseleave', (e) => {
      if (e.target.matches('tr')) {
        const menu = e.target.querySelector('.menu-options');
        if (menu) {
          menu.style.display = 'none';
        }
      }
    }, true);
  }

  function setupCreatorInteractions() {
    const creator = demo.querySelector('.creator-view');
    if (!creator) return;
    
    // App selection
    creator.addEventListener('click', (e) => {
      const appCard = e.target.closest('.app-card');
      if (appCard) {
        const appId = appCard.dataset.app;
        if (state.selectedApps.includes(appId)) {
          state.selectedApps = state.selectedApps.filter(id => id !== appId);
        } else {
          state.selectedApps.push(appId);
        }
        renderView();
      }
      
      // Accordion toggles
      if (e.target.closest('.accordion-header')) {
        const accordion = e.target.closest('.accordion');
        const content = accordion.querySelector('.accordion-content');
        const isExpanded = accordion.classList.contains('expanded');
        
        accordion.classList.toggle('expanded');
        content.style.display = isExpanded ? 'none' : 'block';
      }
      
      // Step card toggles
      if (e.target.closest('.step-toggle')) {
        const stepCard = e.target.closest('.step-card');
        const stepNum = parseInt(stepCard.dataset.step);
        state.currentStep = stepNum;
        renderView();
      }
    });
  }

  function savePackageName(input) {
    const cell = input.closest('.editable-name');
    const span = cell.querySelector('.package-name');
    
    span.textContent = input.value;
    span.style.display = 'inline';
    input.style.display = 'none';
  }

  function setupZoomControls() {
    const controls = demo.querySelector('.zoom-controls');
    if (!controls) return;
    
    controls.addEventListener('click', (e) => {
      if (e.target.matches('.zoom-in')) {
        state.zoom = Math.min(state.zoom + 0.1, 2);
        updateZoom();
      } else if (e.target.matches('.zoom-out')) {
        state.zoom = Math.max(state.zoom - 0.1, 0.5);
        updateZoom();
      } else if (e.target.matches('.zoom-reset')) {
        state.zoom = 1;
        updateZoom();
      }
    });
  }

  function updateZoom() {
    const container = demo.querySelector('.demo-container');
    container.style.transform = `scale(${state.zoom})`;
    container.style.transformOrigin = 'center center';
  }

  function setupFullscreenTransitions() {
    const fullscreenBtn = demo.querySelector('.fullscreen-btn');
    if (!fullscreenBtn) return;
    
    fullscreenBtn.addEventListener('click', () => {
      state.isFullscreen = !state.isFullscreen;
      demo.classList.toggle('fullscreen');
      
      // Update button icon
      fullscreenBtn.innerHTML = state.isFullscreen ? 
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 2h4v4M6 14H2v-4M14 10v4h-4M2 6V2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    });
  }

  function handleSaveDownload(isDownload) {
    const btn = event.target;
    const originalText = btn.textContent;
    
    btn.disabled = true;
    btn.textContent = isDownload ? 'Preparing Download...' : 'Saving...';
    
    setTimeout(() => {
      if (isDownload) {
        showDownloadModal();
      } else {
        // Return to library
        state.view = 'library';
        renderView();
      }
      
      btn.disabled = false;
      btn.textContent = originalText;
    }, 2000);
  }

  function showDownloadModal() {
    const modal = document.createElement('div');
    modal.className = 'walkthrough-modal';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <h2>Download Process</h2>
        <div class="modal-steps">
          <div class="step">
            <div class="step-icon">📦</div>
            <h3>Package Created</h3>
            <p>Your deployment package has been compiled with all selected applications and customizations.</p>
          </div>
          <div class="step">
            <div class="step-icon">⬇️</div>
            <h3>Download Ready</h3>
            <p>The installer kernel (DeploymentPackage.exe) would normally download to your system.</p>
          </div>
          <div class="step">
            <div class="step-icon">🚀</div>
            <h3>Next Steps</h3>
            <p>Deploy via SCCM, network share, or distribute to users for self-service installation.</p>
          </div>
        </div>
        <button class="btn-primary close-modal">Got it!</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.remove();
      state.view = 'library';
      renderView();
    });
    
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
      modal.remove();
      state.view = 'library';
      renderView();
    });
  }

  // Initialize
  initDemo();
});