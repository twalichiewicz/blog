import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import './FauxdalEnrollment.css'

const enrollmentSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Your 401(k)',
    description: 'Let\'s get your retirement savings started',
    fields: []
  },
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'We need some basic information',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'birthDate', label: 'Date of Birth', type: 'date', required: true },
      { name: 'ssn', label: 'Social Security Number', type: 'text', placeholder: 'XXX-XX-XXXX', required: true }
    ]
  },
  {
    id: 'contribution',
    title: 'Contribution Amount',
    description: 'How much would you like to contribute?',
    fields: [
      { 
        name: 'contributionPercent', 
        label: 'Contribution Percentage', 
        type: 'range', 
        min: 1, 
        max: 50, 
        default: 6,
        suffix: '%',
        help: 'Your employer matches up to 6%'
      },
      {
        name: 'increaseAnnually',
        label: 'Automatically increase by 1% each year',
        type: 'checkbox',
        default: true
      }
    ]
  },
  {
    id: 'investments',
    title: 'Investment Selection',
    description: 'Choose how to invest your contributions',
    fields: [
      {
        name: 'investmentStrategy',
        label: 'Investment Strategy',
        type: 'radio',
        options: [
          { value: 'targetdate', label: 'Target Date Fund (Recommended)', description: 'Automatically adjusts as you near retirement' },
          { value: 'moderate', label: 'Moderate Portfolio', description: 'Balanced mix of stocks and bonds' },
          { value: 'aggressive', label: 'Aggressive Portfolio', description: 'Higher risk, higher potential returns' },
          { value: 'custom', label: 'Custom Selection', description: 'Choose your own investments' }
        ],
        default: 'targetdate'
      }
    ]
  },
  {
    id: 'beneficiary',
    title: 'Beneficiary Information',
    description: 'Who should receive your account if something happens to you?',
    fields: [
      { name: 'beneficiaryName', label: 'Beneficiary Name', type: 'text', required: true },
      { name: 'beneficiaryRelation', label: 'Relationship', type: 'select', options: ['Spouse', 'Child', 'Parent', 'Other'], required: true },
      { name: 'beneficiaryPercent', label: 'Percentage', type: 'number', default: 100, suffix: '%', required: true }
    ]
  },
  {
    id: 'review',
    title: 'Review & Confirm',
    description: 'Please review your selections',
    fields: []
  }
]

function FauxdalEnrollment({ persona, onComplete, isComplete, onReset }) {
  const [currentStep, setCurrentStep] = useState(0)
  const { register, handleSubmit, watch, formState: { errors }, getValues } = useForm()
  const [formData, setFormData] = useState({})

  const currentStepData = enrollmentSteps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === enrollmentSteps.length - 1
  const contributionPercent = watch('contributionPercent', 6)

  const handleNext = (data) => {
    const newFormData = { ...formData, ...data }
    setFormData(newFormData)
    
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setFormData({})
    onReset()
  }

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'date':
      case 'number':
        return (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <input
              {...register(field.name, { required: field.required })}
              type={field.type}
              className="form-input"
              placeholder={field.placeholder}
              defaultValue={formData[field.name] || field.default}
            />
            {field.suffix && <span className="field-suffix">{field.suffix}</span>}
            {field.help && <p className="field-help">{field.help}</p>}
            {errors[field.name] && <p className="form-error">This field is required</p>}
          </div>
        )
      
      case 'select':
        return (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <select
              {...register(field.name, { required: field.required })}
              className="form-input"
              defaultValue={formData[field.name] || field.default}
            >
              <option value="">Select...</option>
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors[field.name] && <p className="form-error">This field is required</p>}
          </div>
        )
      
      case 'range':
        return (
          <div key={field.name} className="form-group">
            <label className="form-label">
              {field.label}: <strong>{contributionPercent}%</strong>
            </label>
            <div className="range-container">
              <input
                {...register(field.name)}
                type="range"
                className="form-range"
                min={field.min}
                max={field.max}
                defaultValue={formData[field.name] || field.default}
              />
              <div className="range-labels">
                <span>{field.min}%</span>
                <span>{field.max}%</span>
              </div>
            </div>
            {field.help && <p className="field-help">{field.help}</p>}
          </div>
        )
      
      case 'checkbox':
        return (
          <div key={field.name} className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                {...register(field.name)}
                type="checkbox"
                defaultChecked={formData[field.name] !== undefined ? formData[field.name] : field.default}
              />
              <span>{field.label}</span>
            </label>
          </div>
        )
      
      case 'radio':
        return (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <div className="radio-group">
              {field.options.map(option => (
                <label key={option.value} className="radio-label">
                  <input
                    {...register(field.name, { required: field.required })}
                    type="radio"
                    value={option.value}
                    defaultChecked={formData[field.name] === option.value || (!formData[field.name] && field.default === option.value)}
                  />
                  <div className="radio-content">
                    <span className="radio-title">{option.label}</span>
                    {option.description && (
                      <span className="radio-description">{option.description}</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors[field.name] && <p className="form-error">Please select an option</p>}
          </div>
        )
      
      default:
        return null
    }
  }

  if (isComplete) {
    return (
      <div className="fauxdal-container">
        <motion.div 
          className="completion-screen"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="completion-icon">🎉</div>
          <h2 className="completion-title">Enrollment Complete!</h2>
          <p className="completion-message">
            You're now enrolled in your 401(k) plan. Your contributions will start
            with your next paycheck.
          </p>
          <div className="completion-summary">
            <h3>Your Selections:</h3>
            <ul>
              <li>Contribution: {formData.contributionPercent || 6}%</li>
              <li>Investment: {formData.investmentStrategy || 'Target Date Fund'}</li>
              <li>Annual Increase: {formData.increaseAnnually ? 'Yes' : 'No'}</li>
            </ul>
          </div>
          <button className="button" onClick={handleRestart}>
            Start New Demo
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fauxdal-container">
      {/* Progress Indicator */}
      <div className="fauxdal-progress">
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / enrollmentSteps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="progress-steps">
          {enrollmentSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`progress-step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
            >
              <div className="step-dot" />
              <span className="step-label">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Content */}
      <div className="fauxdal-modal">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="fauxdal-content"
          >
            <div className="fauxdal-header">
              <h2 className="fauxdal-title">{currentStepData.title}</h2>
              <p className="fauxdal-description">{currentStepData.description}</p>
            </div>

            <form onSubmit={handleSubmit(handleNext)} className="fauxdal-form">
              {currentStep === 0 && (
                <div className="welcome-content">
                  <div className="welcome-illustration">💰</div>
                  <p className="welcome-text">
                    {persona === 'employee' 
                      ? "Setting up your 401(k) is easy! We'll guide you through each step."
                      : persona === 'admin'
                      ? "Let's configure your 401(k) settings. This process takes about 5 minutes."
                      : "401(k) enrollment process initiated. Complete all required fields to proceed."}
                  </p>
                </div>
              )}

              {currentStep === enrollmentSteps.length - 1 ? (
                <div className="review-content">
                  <h3>Your Selections</h3>
                  <div className="review-grid">
                    <div className="review-item">
                      <span className="review-label">Name:</span>
                      <span className="review-value">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Contribution:</span>
                      <span className="review-value">{formData.contributionPercent || 6}%</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Investment:</span>
                      <span className="review-value">{formData.investmentStrategy || 'Target Date Fund'}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Beneficiary:</span>
                      <span className="review-value">{formData.beneficiaryName || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="form-fields">
                  {currentStepData.fields.map(renderField)}
                </div>
              )}

              <div className="fauxdal-actions">
                {!isFirstStep && (
                  <button
                    type="button"
                    className="button secondary"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                )}
                <button type="submit" className="button">
                  {isLastStep ? 'Complete Enrollment' : 'Continue'}
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FauxdalEnrollment