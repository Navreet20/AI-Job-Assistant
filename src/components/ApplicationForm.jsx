import React, { useState } from 'react';
import { generateAnswer, submitFeedback } from '../services/api';
import './ApplicationForm.css';

export default function ApplicationForm({ job, onSubmit, onCancel }) {
  const [answers, setAnswers] = useState({});
  const [aiAssistance, setAiAssistance] = useState({});
  const [loading, setLoading] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState({}); // NEW: Track feedback

  const handleAnswerChange = (question, value) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const getAIHelp = async (question) => {
    setLoading(prev => ({ ...prev, [question]: true }));
    
    const prompt = `For a ${job.role} position at ${job.company}: ${question}`;
    const result = await generateAnswer(prompt, {});
    
    setAiAssistance(prev => ({ ...prev, [question]: result.text }));
    setLoading(prev => ({ ...prev, [question]: false }));
  };

  const useAiSuggestion = (question) => {
    setAnswers(prev => ({ ...prev, [question]: aiAssistance[question] }));
  };

  // NEW: Handle thumbs up/down
  const handleFeedback = async (question, type) => {
    setFeedback(prev => ({ ...prev, [question]: type }));
    await submitFeedback(`answer-${job.id}-${currentStep}`, type);
  };

  const handleNext = () => {
    if (currentStep < job.questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onSubmit({
        jobId: job.id,
        jobTitle: job.role,
        company: job.company,
        appliedDate: new Date().toISOString().split('T')[0],
        answers: answers,
        status: 'Submitted'
      });
    }
  };

  const currentQuestion = job.questions[currentStep];
  const progress = ((currentStep + 1) / job.questions.length) * 100;

  return (
    <div className="application-form">
      <div className="glass-card form-header">
        <h2>Apply to {job.company}</h2>
        <p>{job.role}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">Question {currentStep + 1} of {job.questions.length}</span>
      </div>

      <div className="glass-card question-card">
        <div className="question-header">
          <span className="question-number">Q{currentStep + 1}</span>
          <h3>{currentQuestion}</h3>
        </div>

        <div className="answer-section">
          <textarea
            value={answers[currentQuestion] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
            placeholder="Type your answer here..."
            className="glass-textarea answer-input"
            rows="6"
          />
          
          {aiAssistance[currentQuestion] && (
            <div className="ai-suggestion">
              <div className="suggestion-header">
                <span>🤖 AI Suggestion</span>
                <button 
                  onClick={() => useAiSuggestion(currentQuestion)}
                  className="use-suggestion-btn"
                >
                  Use This
                </button>
              </div>
              <p>{aiAssistance[currentQuestion]}</p>
              
              {/* NEW: Thumbs up/down feedback */}
              <div className="feedback-section">
                <span>Was this helpful?</span>
                <div className="thumbs-container">
                  <button 
                    className={`thumb-btn up ${feedback[currentQuestion] === 'up' ? 'active' : ''}`}
                    onClick={() => handleFeedback(currentQuestion, 'up')}
                    title="Helpful"
                  >
                    👍
                  </button>
                  <button 
                    className={`thumb-btn down ${feedback[currentQuestion] === 'down' ? 'active' : ''}`}
                    onClick={() => handleFeedback(currentQuestion, 'down')}
                    title="Not helpful"
                  >
                    👎
                  </button>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={() => getAIHelp(currentQuestion)}
            disabled={loading[currentQuestion]}
            className="secondary-btn ai-help-btn"
          >
            {loading[currentQuestion] ? (
              <>
                <span className="spinner"></span>
                Thinking...
              </>
            ) : (
              '✨ Get AI Help'
            )}
          </button>
        </div>

        <div className="question-nav">
          {currentStep > 0 && (
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="secondary-btn"
            >
              ← Previous
            </button>
          )}
          
          {currentStep < job.questions.length - 1 ? (
            <button 
              onClick={handleNext}
              className="primary-btn"
              disabled={!answers[currentQuestion]}
            >
              Next →
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="primary-btn submit-btn"
              disabled={!answers[currentQuestion]}
            >
              Submit Application 🚀
            </button>
          )}
        </div>
      </div>

      <button onClick={onCancel} className="cancel-btn">Cancel Application</button>
    </div>
  );
}