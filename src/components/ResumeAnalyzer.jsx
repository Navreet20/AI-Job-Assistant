import React, { useState } from 'react';
import { analyzeResumeWithSteps, submitFeedback } from '../services/api';
import './ResumeAnalyzer.css';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResults(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    setProgress(0);
    
    try {
      const result = await analyzeResumeWithSteps(file, (step) => {
        setCurrentStep(step.message);
        setProgress(step.progress);
      });
      setResults(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFeedback = async (contentId, type) => {
    await submitFeedback(contentId, type);
    setFeedbackGiven(prev => ({ ...prev, [contentId]: type }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#00ffd5';
    if (score >= 60) return '#ffd700';
    return '#ff6b6b';
  };

  return (
    <div className="resume-analyzer">
      <div className="glass-card analyzer-header">
        <h2>📄 Resume Analyzer</h2>
        <p className="subtitle">AI-powered analysis and optimization suggestions</p>
      </div>

      {!results && !analyzing && (
        <div className="glass-card upload-section">
          <div className="drop-zone" onClick={() => document.getElementById('resume-upload').click()}>
            <input 
              type="file" 
              id="resume-upload" 
              accept=".pdf,.docx" 
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">📁</div>
            <p className="upload-text">{file ? file.name : 'Drop your resume here or click to browse'}</p>
            <span className="upload-hint">PDF or DOCX up to 5MB</span>
          </div>
          
          {file && (
            <button onClick={handleAnalyze} className="primary-btn analyze-btn">
              🔍 Analyze Resume
            </button>
          )}
        </div>
      )}

      {analyzing && (
        <div className="glass-card analyzing-state">
          <div className="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle className="progress-bg" cx="50" cy="50" r="45" />
              <circle 
                className="progress-fill" 
                cx="50" 
                cy="50" 
                r="45" 
                style={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
              />
            </svg>
            <div className="progress-text">{progress}%</div>
          </div>
          <h3>AI is analyzing your resume...</h3>
          <p className="step-indicator">{currentStep}</p>
          <div className="step-dots">
            {[1, 2, 3, 4, 5].map((dot) => (
              <span 
                key={dot} 
                className={`dot ${progress >= dot * 20 ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {results && (
        <div className="results-container">
          {/* Score Card */}
          <div className="glass-card score-card">
            <div className="score-header">
              <h3>Match Score</h3>
              <div className="confidence-badge">
                Confidence: {(results.confidence * 100).toFixed(0)}%
              </div>
            </div>
            
            <div className="score-circle" style={{ color: getScoreColor(results.score) }}>
              <span className="score-number">{results.score}</span>
              <span className="score-label">/100</span>
            </div>
            
            <div className="score-breakdown">
              {Object.entries(results.breakdown).map(([key, value]) => (
                <div key={key} className="breakdown-item">
                  <div className="breakdown-label">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill" 
                      style={{ 
                        width: `${value}%`,
                        background: getScoreColor(value)
                      }}
                    />
                  </div>
                  <div className="breakdown-value">{value}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="glass-card suggestions-card">
            <h3>💡 AI Recommendations</h3>
            <div className="suggestions-list">
              {results.suggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion-item">
                  <div className="suggestion-content">
                    <div className="suggestion-header">
                      <span className={`impact-badge ${suggestion.impact}`}>
                        {suggestion.impact} impact
                      </span>
                      <p className="suggestion-text">{suggestion.text}</p>
                    </div>
                    <p className="suggestion-reasoning">{suggestion.reasoning}</p>
                  </div>
                  
                  <div className="suggestion-actions">
                    <button className="apply-btn">Apply</button>
                    <div className="feedback-buttons">
                      <button 
                        onClick={() => handleFeedback(`sugg-${suggestion.id}`, 'up')}
                        className={`feedback-btn ${feedbackGiven[`sugg-${suggestion.id}`] === 'up' ? 'active' : ''}`}
                      >
                        👍
                      </button>
                      <button 
                        onClick={() => handleFeedback(`sugg-${suggestion.id}`, 'down')}
                        className={`feedback-btn ${feedbackGiven[`sugg-${suggestion.id}`] === 'down' ? 'active' : ''}`}
                      >
                        👎
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="glass-card keywords-card">
            <h3>🔑 Missing Keywords</h3>
            <p className="keywords-subtitle">Add these to improve ATS visibility:</p>
            <div className="keywords-cloud">
              {results.missingKeywords.map((keyword, idx) => (
                <span key={idx} className="missing-keyword">
                  {keyword}
                  <button className="add-keyword-btn">+</button>
                </span>
              ))}
            </div>
            <div className="feedback-prompt">
              <span>Were these suggestions helpful?</span>
              <div className="feedback-buttons large">
                <button 
                  onClick={() => handleFeedback('overall-analysis', 'up')}
                  className={feedbackGiven['overall-analysis'] === 'up' ? 'active' : ''}
                >
                  Yes, very helpful 👍
                </button>
                <button 
                  onClick={() => handleFeedback('overall-analysis', 'down')}
                  className={feedbackGiven['overall-analysis'] === 'down' ? 'active' : ''}
                >
                  Not really 👎
                </button>
              </div>
            </div>
          </div>

          <button onClick={() => { setResults(null); setFile(null); }} className="secondary-btn reset-btn">
            Analyze Another Resume
          </button>
        </div>
      )}
    </div>
  );
}