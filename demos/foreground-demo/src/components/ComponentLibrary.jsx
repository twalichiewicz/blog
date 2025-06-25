import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './ComponentLibrary.css'

// Sample data for charts
const performanceData = [
  { month: 'Jan', returns: 4.2, benchmark: 3.8 },
  { month: 'Feb', returns: 5.1, benchmark: 4.5 },
  { month: 'Mar', returns: 3.8, benchmark: 4.0 },
  { month: 'Apr', returns: 6.2, benchmark: 5.2 },
  { month: 'May', returns: 7.1, benchmark: 6.0 },
  { month: 'Jun', returns: 5.9, benchmark: 5.5 }
]

const allocationData = [
  { name: 'Stocks', value: 60, color: '#2563eb' },
  { name: 'Bonds', value: 30, color: '#10b981' },
  { name: 'Cash', value: 10, color: '#f59e0b' }
]

const contributionData = [
  { type: 'Employee', amount: 850 },
  { type: 'Employer Match', amount: 500 },
  { type: 'Profit Sharing', amount: 200 }
]

function ComponentLibrary({ persona }) {
  const [activeComponent, setActiveComponent] = useState('buttons')

  const components = [
    { id: 'buttons', label: 'Buttons', icon: '🔘' },
    { id: 'forms', label: 'Form Elements', icon: '📝' },
    { id: 'cards', label: 'Cards', icon: '🃏' },
    { id: 'icons', label: 'Financial Icons', icon: '💰' },
    { id: 'charts', label: 'Data Visualization', icon: '📊' },
    { id: 'tables', label: 'Tables', icon: '📋' }
  ]

  const renderButtons = () => (
    <div className="component-section">
      <h3 className="component-title">Button Variants</h3>
      <div className="component-demo">
        <div className="button-grid">
          <button className="button">Primary Button</button>
          <button className="button secondary">Secondary Button</button>
          <button className="button success">Success Button</button>
          <button className="button danger">Danger Button</button>
          <button className="button" disabled>Disabled Button</button>
          <button className="button icon-button">
            <span>With Icon</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="component-code">
        <pre>{`<button class="button">Primary Button</button>
<button class="button secondary">Secondary Button</button>
<button class="button success">Success Button</button>`}</pre>
      </div>
    </div>
  )

  const renderForms = () => (
    <div className="component-section">
      <h3 className="component-title">Form Elements</h3>
      <div className="component-demo">
        <div className="form-demo">
          <div className="form-group">
            <label className="form-label">Text Input</label>
            <input type="text" className="form-input" placeholder="Enter text..." />
          </div>
          
          <div className="form-group">
            <label className="form-label">Select Input</label>
            <select className="form-input">
              <option>Choose an option...</option>
              <option>Traditional IRA</option>
              <option>Roth IRA</option>
              <option>401(k)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Amount Input</label>
            <div className="input-group">
              <span className="input-prefix">$</span>
              <input type="number" className="form-input" placeholder="0.00" />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Toggle Switch</label>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Enable automatic rebalancing</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCards = () => (
    <div className="component-section">
      <h3 className="component-title">Card Components</h3>
      <div className="component-demo">
        <div className="cards-grid">
          <div className="card stat-card">
            <div className="stat-icon">💵</div>
            <div className="stat-content">
              <div className="stat-value">$125,450</div>
              <div className="stat-label">Total Balance</div>
              <div className="stat-change positive">+12.5%</div>
            </div>
          </div>
          
          <div className="card info-card">
            <h4>Vesting Schedule</h4>
            <div className="vesting-progress">
              <div className="vesting-bar">
                <div className="vesting-fill" style={{width: '60%'}}></div>
              </div>
              <p>60% Vested • $75,270</p>
            </div>
          </div>
          
          <div className="card action-card">
            <h4>Quick Actions</h4>
            <div className="action-buttons">
              <button className="action-btn">Change Contribution</button>
              <button className="action-btn">Rebalance Portfolio</button>
              <button className="action-btn">Update Beneficiary</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderIcons = () => (
    <div className="component-section">
      <h3 className="component-title">Financial Iconography</h3>
      <div className="component-demo">
        <div className="icons-grid">
          <div className="icon-item">
            <div className="icon-display">📈</div>
            <span className="icon-label">Growth</span>
          </div>
          <div className="icon-item">
            <div className="icon-display">🎯</div>
            <span className="icon-label">Target Date</span>
          </div>
          <div className="icon-item">
            <div className="icon-display">⚖️</div>
            <span className="icon-label">Rebalance</span>
          </div>
          <div className="icon-item">
            <div className="icon-display">🔄</div>
            <span className="icon-label">Rollover</span>
          </div>
          <div className="icon-item">
            <div className="icon-display">🏛️</div>
            <span className="icon-label">Traditional</span>
          </div>
          <div className="icon-item">
            <div className="icon-display">💎</div>
            <span className="icon-label">Roth</span>
          </div>
          <div className="icon-item">
            <div className="icon-display">🤝</div>
            <span className="icon-label">Employer Match</span>
          </div>
          <div className="icon-item">
            <div className="icon-display">📊</div>
            <span className="icon-label">Performance</span>
          </div>
        </div>
      </div>
      <p className="component-note">
        Custom iconography designed specifically for 401(k) concepts that don't exist 
        in standard icon libraries.
      </p>
    </div>
  )

  const renderCharts = () => (
    <div className="component-section">
      <h3 className="component-title">Data Visualization</h3>
      <div className="component-demo">
        <div className="charts-grid">
          <div className="chart-container">
            <h4>Portfolio Performance</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="returns" stroke="#2563eb" strokeWidth={2} name="Your Returns" />
                <Line type="monotone" dataKey="benchmark" stroke="#10b981" strokeWidth={2} name="Benchmark" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-container">
            <h4>Asset Allocation</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}%`}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-container">
            <h4>Monthly Contributions</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={contributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="type" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="amount" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTables = () => (
    <div className="component-section">
      <h3 className="component-title">Table Components</h3>
      <div className="component-demo">
        <div className={`table-container ${persona === 'operations' ? 'dense' : ''}`}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Investment</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Value</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vanguard Target 2055</td>
                <td>1,234.56</td>
                <td>$45.67</td>
                <td>$56,391.78</td>
                <td className="positive">+2.4%</td>
              </tr>
              <tr>
                <td>Total Bond Market</td>
                <td>890.12</td>
                <td>$10.23</td>
                <td>$9,105.93</td>
                <td className="negative">-0.8%</td>
              </tr>
              <tr>
                <td>S&P 500 Index</td>
                <td>234.56</td>
                <td>$123.45</td>
                <td>$28,957.33</td>
                <td className="positive">+3.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="component-note">
        Tables adapt based on persona - {persona === 'operations' ? 'dense mode for maximum data visibility' : 'comfortable spacing for readability'}.
      </p>
    </div>
  )

  const componentRenderers = {
    buttons: renderButtons,
    forms: renderForms,
    cards: renderCards,
    icons: renderIcons,
    charts: renderCharts,
    tables: renderTables
  }

  return (
    <div className="component-library">
      <div className="library-header">
        <h2 className="library-title">Component Library</h2>
        <p className="library-subtitle">
          Adaptive components that adjust complexity based on user persona
        </p>
      </div>

      <div className="component-nav">
        {components.map(component => (
          <button
            key={component.id}
            className={`component-nav-btn ${activeComponent === component.id ? 'active' : ''}`}
            onClick={() => setActiveComponent(component.id)}
          >
            <span className="component-icon">{component.icon}</span>
            <span className="component-label">{component.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={activeComponent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="component-content"
      >
        {componentRenderers[activeComponent]()}
      </motion.div>
    </div>
  )
}

export default ComponentLibrary