import React, { useState, useEffect } from 'react';
import { generateAnswer, submitFeedback } from '../services/api';
import { getUserProfile } from '../services/api';
import './AnswerGenerator.css';

export default function AnswerGenerator() {
  const [question, setQuestion] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) setUserProfile(profile);
  }, []);

  const commonQuestions = [
    "Why do you want this job?",
    "Tell me about yourself",
    "What are your greatest strengths?",
    "Why should we hire you?",
    "Where do you see yourself in 5 years?"
  ];

  const handleGenerate = async () => {
    if (!question) return;
    
    setGenerating(true);
    setResult(null);
    setStreamedText('');
    setFeedbackGiven(false);
    
    try {
      const response = await generateAnswer(question, userProfile || {});
      setResult(response);
      
      const words = response.text.split(' ');
      let currentText = '';
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        currentText += (i === 0 ? '' : ' ') + words[i];
        setStreamedText(currentText);
      }
      
      setEditedText(response.text);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = async (type) => {
    await submitFeedback(`answer-${Date.now()}`, type);
    setFeedbackGiven(type);
  };

  return (
    <div className="answer-generator">
      <div className="glass-card generator-header">
        <h2>✨ Tailored Answer Generator</h2>
        <p className="subtitle">AI-generated responses based on your profile</p>
      </div>

      <div className="glass-card input-section">
        <label className="input-label">Job Application Question</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Paste the interview question here..."
          className="glass-textarea question-input"
          rows="3"
        />
        
        <div className="quick-questions">
          <span className="quick-label">Quick select:</span>
          {commonQuestions.map((q, idx) => (
            <button 
              key={idx} 
              onClick={() => setQuestion(q)}
              className="quick-tag"
            >
              {q}
            </button>
          ))}
        </div>

        <button 
          onClick={handleGenerate} 
          disabled={generating || !question}
          className="primary-btn generate-btn"
        >
          {generating ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            'Generate Answer ✨'
          )}
        </button>
      </div>

      {generating && !result && (
        <div className="glass-card generating-state">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Crafting personalized response based on your experience...</p>
          <div className="context-badges">
            {userProfile?.experience?.[0] && (
              <span className="context-badge">
                Using: {userProfile.experience[0].company}
              </span>
            )}
            {userProfile?.skills?.[0] && (
              <span className="context-badge">
                Skill: {userProfile.skills[0]}
              </span>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="glass-card result-section">
          <div className="result-header">
            <div className="confidence-score">
              <div className="confidence-ring" style={{ '--confidence': `${result.confidence * 100}%` }}>
                <span>{(result.confidence * 100).toFixed(0)}%</span>
              </div>
              <label>Match</label>
            </div>
            <div className="word-count">{editedText.split(' ').length} words</div>
          </div>

          <div className="context-sources">
            <small>Based on:</small>
            {result.sources.map((source, idx) => (
              <span key={idx} className="source-tag">{source}</span>
            ))}
          </div>

          <div className="answer-editor">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="answer-textarea"
              rows="8"
            />
            <div className="editor-toolbar">
              <button onClick={handleCopy} className={`copy-btn ${copied ? 'copied' : ''}`}>
                {copied ? 'Copied! ✓' : 'Copy to Clipboard'}
              </button>
              <button onClick={() => setEditedText(result.text)} className="reset-btn">
                Reset
              </button>
            </div>
          </div>

          <div className="feedback-section">
            <p>Was this answer helpful?</p>
            <div className="feedback-options">
              <button 
                onClick={() => handleFeedback('up')}
                className={`feedback-option ${feedbackGiven === 'up' ? 'selected' : ''}`}
              >
                <span className="feedback-emoji">👍</span>
                <span>Helpful</span>
              </button>
              <button 
                onClick={() => handleFeedback('down')}
                className={`feedback-option ${feedbackGiven === 'down' ? 'selected' : ''}`}
              >
                <span className="feedback-emoji">👎</span>
                <span>Not helpful</span>
              </button>
              <button 
                onClick={() => handleFeedback('edit')}
                className={`feedback-option ${feedbackGiven === 'edit' ? 'selected' : ''}`}
              >
                <span className="feedback-emoji">✏️</span>
                <span>I edited it</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}