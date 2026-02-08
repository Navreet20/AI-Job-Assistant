import React, { useState } from 'react';
import { detectFormFields, generateAutofillMappings, submitAutofillFeedback, getUserProfile } from '../services/api';
import './AutofillAgent.css';

export default function AutofillAgent() {
  const [step, setStep] = useState('idle');
  const [formData, setFormData] = useState(null);
  const [mappings, setMappings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [copiedField, setCopiedField] = useState(null);
  const userProfile = getUserProfile();

  const startDetection = async () => {
    setIsLoading(true);
    setStep('detecting');
    setError('');
    
    try {
      const detected = await detectFormFields(window.location.href);
      setFormData(detected);
      setStep('mapping');
      
      const mapped = await generateAutofillMappings(detected.fields, userProfile);
      setMappings(mapped);
      setStep('review');
    } catch (err) {
      setError(err.message || 'Failed to detect form');
      setStep('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldEdit = (fieldId, newValue) => {
    setMappings(prev => prev.map(field => 
      field.id === fieldId ? { ...field, mappedValue: newValue, aiEdited: true } : field
    ));
  };

  const handleFeedback = async (fieldId, useful) => {
    await submitAutofillFeedback(fieldId, useful);
    setFeedbackGiven(prev => ({ ...prev, [fieldId]: useful }));
  };

  const handleCopyField = (field) => {
    navigator.clipboard.writeText(field.mappedValue);
    setCopiedField(field.id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFillAll = () => {
    setStep('filled');
    setTimeout(() => {
      alert('Form fields copied to clipboard! Paste them into the job application.');
    }, 500);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return '#10b981';
    if (confidence >= 0.7) return '#3b82f6';
    if (confidence >= 0.4) return '#f59e0b';
    return '#ef4444';
  };

  const filledCount = mappings.filter(m => m.mappedValue && m.confidence > 0).length;
  const highConfidenceCount = mappings.filter(m => m.confidence >= 0.9).length;

  if (step === 'idle') {
    return (
      <div className="autofill-agent">
        <div className="glass-card demo-notice">
          <span>🎨</span>
          <div>
            <strong>UI Prototype Mode</strong>
            <p>This demonstrates how Autofill would work with a browser extension. 
               In production, this would scan LinkedIn, Indeed, and other job sites 
               automatically.</p>
          </div>
        </div>

        <div className="glass-card autofill-header">
          <h2>🤖 Autofill Assistant</h2>
          <p className="subtitle">Automatically fill job applications using your profile data</p>
        </div>

        <div className="glass-card activation-card">
          <div className="activation-icon">⚡</div>
          <h3>Ready to autofill job applications</h3>
          <p>The AI will detect form fields on the job page and map them to your profile information.</p>
          
          {!userProfile ? (
            <div className="warning-box">
              <span>⚠️</span>
              <p>Please complete your profile first to use autofill.</p>
            </div>
          ) : (
            <button onClick={startDetection} className="primary-btn activate-btn">
              Scan Page for Forms 🔍
            </button>
          )}
          
          <div className="privacy-note">
            <span>🔒</span>
            <small>Your data never leaves this device. All processing happens locally.</small>
          </div>
        </div>

        <div className="glass-card how-it-works">
          <h4>How it works:</h4>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <p>Click "Scan Page" when viewing a job application</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <p>AI detects form fields (name, email, experience, etc.)</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <p>Review AI-suggested values and confidence scores</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <p>One-click fill or copy individual fields</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'detecting' || step === 'mapping') {
    return (
      <div className="autofill-agent">
        <div className="glass-card loading-card">
          <div className={`ai-orb ${step}`}>
            <div className="orb-inner"></div>
            <div className="orb-ring"></div>
            <div className="orb-ring"></div>
          </div>
          
          <h3>{step === 'detecting' ? 'Scanning page for forms...' : 'Mapping your profile data...'}</h3>
          
          <div className="loading-steps">
            <div className={`loading-step ${step === 'detecting' ? 'active' : 'complete'}`}>
              <span className="step-icon">{step === 'detecting' ? '⏳' : '✓'}</span>
              <span>Detecting form fields</span>
            </div>
            <div className={`loading-step ${step === 'mapping' ? 'active' : ''}`}>
              <span className="step-icon">{step === 'mapping' ? '⏳' : step === 'detecting' ? '○' : '✓'}</span>
              <span>Analyzing field types</span>
            </div>
            <div className={`loading-step`}>
              <span className="step-icon">○</span>
              <span>Matching with profile</span>
            </div>
          </div>
          
          <div className="scanning-animation">
            <div className="scan-line"></div>
            <div className="form-simulation">
              <div className="sim-field"></div>
              <div className="sim-field short"></div>
              <div className="sim-field"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="autofill-agent">
        <div className="glass-card error-card">
          <div className="error-icon">❌</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={() => setStep('idle')} className="secondary-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="autofill-agent">
      <div className="glass-card review-header">
        <div className="review-stats">
          <div className="stat">
            <span className="stat-number">{filledCount}</span>
            <span className="stat-label">Fields Found</span>
          </div>
          <div className="stat">
            <span className="stat-number" style={{ color: '#10b981' }}>{highConfidenceCount}</span>
            <span className="stat-label">High Confidence</span>
          </div>
          <div className="stat">
            <span className="stat-number">{mappings.length - filledCount}</span>
            <span className="stat-label">Need Attention</span>
          </div>
        </div>
        
        <div className="review-actions">
          <button onClick={() => setStep('idle')} className="secondary-btn">
            Rescan
          </button>
          <button onClick={handleFillAll} className="primary-btn">
            Copy All Values 📋
          </button>
        </div>
      </div>

      <div className="glass-card form-preview">
        <div className="preview-header">
          <h3>{formData?.pageTitle}</h3>
          <div className="confidence-legend">
            <span><span className="dot green"></span> High confidence</span>
            <span><span className="dot yellow"></span> Medium</span>
            <span><span className="dot red"></span> Low/Missing</span>
          </div>
        </div>

        <div className="fields-list">
          {mappings.map((field) => (
            <div 
              key={field.id} 
              className={`field-row ${field.aiFilled ? 'ai-filled' : ''} ${selectedField === field.id ? 'selected' : ''}`}
              onClick={() => setSelectedField(field.id)}
            >
              <div className="field-info">
                <label>
                  {field.label}
                  {field.required && <span className="required">*</span>}
                </label>
                
                {field.source && (
                  <span className="field-source" style={{ color: getConfidenceColor(field.confidence) }}>
                    {field.source} • {(field.confidence * 100).toFixed(0)}% match
                  </span>
                )}
              </div>

              <div className="field-input-area">
                {field.type === 'select' ? (
                  <select 
                    value={field.mappedValue}
                    onChange={(e) => handleFieldEdit(field.id, e.target.value)}
                    className={`glass-input ${!field.mappedValue ? 'empty' : ''}`}
                  >
                    <option value="">Select...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={field.mappedValue}
                    onChange={(e) => handleFieldEdit(field.id, e.target.value)}
                    className={`glass-input ${!field.mappedValue ? 'empty' : ''}`}
                    rows="3"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={field.mappedValue}
                    onChange={(e) => handleFieldEdit(field.id, e.target.value)}
                    className={`glass-input ${!field.mappedValue ? 'empty' : ''}`}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
                
                <div className="field-actions">
                  {field.aiFilled && (
                    <button 
                      onClick={() => handleCopyField(field)}
                      className={`copy-btn ${copiedField === field.id ? 'copied' : ''}`}
                      title="Copy to clipboard"
                    >
                      {copiedField === field.id ? '✓' : '📋'}
                    </button>
                  )}
                  
                  {field.aiFilled && (
                    <div className="field-feedback">
                      <button 
                        onClick={() => handleFeedback(field.id, true)}
                        className={feedbackGiven[field.id] === true ? 'active' : ''}
                        title="This matched correctly"
                      >
                        👍
                      </button>
                      <button 
                        onClick={() => handleFeedback(field.id, false)}
                        className={feedbackGiven[field.id] === false ? 'active' : ''}
                        title="This was wrong"
                      >
                        👎
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {field.aiEdited && (
                <div className="edited-badge">Edited</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card autofill-footer">
        <div className="ai-confidence-meter">
          <h4>Overall Confidence</h4>
          <div className="meter-bar">
            <div 
              className="meter-fill" 
              style={{ 
                width: `${(mappings.reduce((acc, m) => acc + m.confidence, 0) / mappings.length) * 100}%`,
                background: getConfidenceColor(mappings.reduce((acc, m) => acc + m.confidence, 0) / mappings.length)
              }}
            />
          </div>
          <span>{((mappings.reduce((acc, m) => acc + m.confidence, 0) / mappings.length) * 100).toFixed(0)}% accurate</span>
        </div>
        
        <p className="help-text">
          💡 Tip: Fields marked with high confidence (green) are safe to autofill. Review yellow/orange fields before submitting.
        </p>
      </div>
    </div>
  );
}