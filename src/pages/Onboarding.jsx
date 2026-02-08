import React, { useState } from 'react';
import { saveUserProfile, getUserProfile } from '../services/api';
import './Onboarding.css';

const questions = [
  {
    id: 'field',
    question: "What's your field of interest?",
    subtitle: "This helps us find relevant jobs for you",
    options: [
      { value: 'Software Engineering', icon: '💻', label: 'Software Engineering' },
      { value: 'Data Science', icon: '📊', label: 'Data Science' },
      { value: 'Product Management', icon: '📱', label: 'Product Management' },
      { value: 'Design', icon: '🎨', label: 'Design' },
      { value: 'Marketing', icon: '📢', label: 'Marketing' },
      { value: 'Finance', icon: '💰', label: 'Finance' }
    ]
  },
  {
    id: 'experience',
    question: "What's your experience level?",
    subtitle: "We'll match you with appropriate positions",
    options: [
      { value: 'Entry-Level', label: 'Entry Level (0-2 years)' },
      { value: 'Mid-Level',  label: 'Mid Level (2-5 years)' },
      { value: 'Senior',  label: 'Senior (5+ years)' },
      { value: 'Lead/Manager',  label: 'Lead/Manager' }
    ]
  },
  {
    id: 'jobType',
    question: "Preferred work arrangement?",
    subtitle: "You can change this later in your profile",
    options: [
      { value: 'Remote', icon: '🏠', label: 'Remote' },
      { value: 'Onsite', icon: '🏢', label: 'Onsite' },
      { value: 'Hybrid', icon: '⚡', label: 'Hybrid' },
      { value: 'No Preference', icon: '🤷', label: 'No Preference' }
    ]
  },
  {
    id: 'location',
    question: "Where are you located?",
    subtitle: "Helps us show location-relevant jobs",
    type: 'input',
    placeholder: 'e.g., San Francisco, CA or Remote'
  }
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const currentQ = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save all answers
      setIsSaving(true);
      const existingProfile = getUserProfile() || {};
      await saveUserProfile({
        ...existingProfile,
        preferences: answers,
        onboardingComplete: true
      });
      setIsSaving(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const canProceed = answers[currentQ.id];

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="progress-section">
          <div className="progress-header">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <button className="skip-btn" onClick={handleSkip}>Skip for now</button>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="glass-card question-card">
          <h2>{currentQ.question}</h2>
          <p className="subtitle">{currentQ.subtitle}</p>

          {currentQ.type === 'input' ? (
            <div className="input-section">
              <input
                type="text"
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleSelect(e.target.value)}
                placeholder={currentQ.placeholder}
                className="glass-input location-input"
                autoFocus
              />
            </div>
          ) : (
            <div className="options-grid">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  className={`option-btn ${answers[currentQ.id] === option.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          )}

          <button 
            className="primary-btn next-btn"
            onClick={handleNext}
            disabled={!canProceed || isSaving}
          >
            {isSaving ? 'Saving...' : currentStep === questions.length - 1 ? 'Complete Setup 🚀' : 'Next →'}
          </button>
        </div>

        {currentStep > 0 && (
          <button 
            className="back-link"
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}