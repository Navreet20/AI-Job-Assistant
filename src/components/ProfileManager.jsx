import React, { useState, useEffect } from 'react';
import { saveUserProfile, getUserProfile } from '../services/api';
import './ProfileManager.css';

export default function ProfileManager() {
  const [profile, setProfile] = useState(null); // Start as null
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);

  // Default empty profile structure
  const defaultProfile = {
    personal: { name: '', email: '', phone: '', location: '' },
    field: '',
    experience: [{ company: '', title: '', duration: '', description: '' }],
    skills: [],
    education: [{ school: '', degree: '', year: '' }],
    projects: [{ name: '', description: '', technologies: '' }],
    preferences: {}
  };

  useEffect(() => {
    const saved = getUserProfile();
    // Merge saved data with defaults to ensure all fields exist
    setProfile(saved ? { ...defaultProfile, ...saved } : defaultProfile);
  }, []);

  // Show loading or return null while profile loads
  if (!profile) {
    return <div className="profile-manager">Loading...</div>;
  }

  const handlePersonalChange = (e) => {
    setProfile(prev => ({
      ...prev,
      personal: { ...prev.personal, [e.target.name]: e.target.value }
    }));
  };

  const addExperience = () => {
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', title: '', duration: '', description: '' }]
    }));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...profile.experience];
    updated[index][field] = value;
    setProfile(prev => ({ ...prev, experience: updated }));
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const updatePreference = (key, value) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...(prev.preferences || {}), [key]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveUserProfile(profile);
    setIsSaving(false);
    setSaveStatus('Profile saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="profile-manager">
      <div className="glass-card profile-header">
        <h2>Profile Settings</h2>
        <p className="subtitle">Manage your data for AI-powered job matching</p>
        {saveStatus && <div className="save-indicator">{saveStatus}</div>}
      </div>

      <div className="profile-grid">
        {/* Preferences Section */}
        <div className="glass-card profile-section full-width">
          <div className="section-header">
            <h3>🎯 Career Preferences</h3>
            <button 
              className="edit-toggle-btn"
              onClick={() => setShowPreferences(!showPreferences)}
            >
              {showPreferences ? 'Done' : 'Edit'}
            </button>
          </div>
          
          {showPreferences ? (
            <div className="preferences-edit">
              <div className="form-grid">
                <div className="form-group">
                  <label>Field of Interest</label>
                  <select 
                    className="glass-input"
                    value={profile.preferences?.field || ''}
                    onChange={(e) => updatePreference('field', e.target.value)}
                  >
                    <option value="">Select Field</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Experience Level</label>
                  <select 
                    className="glass-input"
                    value={profile.preferences?.experience || ''}
                    onChange={(e) => updatePreference('experience', e.target.value)}
                  >
                    <option value="">Select Level</option>
                    <option value="Entry-Level">Entry Level (0-2 years)</option>
                    <option value="Mid-Level">Mid Level (2-5 years)</option>
                    <option value="Senior">Senior (5+ years)</option>
                    <option value="Lead/Manager">Lead/Manager</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Preferred Work Type</label>
                  <select 
                    className="glass-input"
                    value={profile.preferences?.jobType || ''}
                    onChange={(e) => updatePreference('jobType', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="No Preference">No Preference</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Location Preference</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="e.g., San Francisco, CA"
                    value={profile.preferences?.location || ''}
                    onChange={(e) => updatePreference('location', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="preferences-display">
              <div className="pref-item">
                <span className="pref-icon">💼</span>
                <div className="pref-content">
                  <label>Field</label>
                  <span className="pref-value">{profile.preferences?.field || 'Not set'}</span>
                </div>
              </div>
              <div className="pref-item">
                <span className="pref-icon">📈</span>
                <div className="pref-content">
                  <label>Experience</label>
                  <span className="pref-value">{profile.preferences?.experience || 'Not set'}</span>
                </div>
              </div>
              <div className="pref-item">
                <span className="pref-icon">🏢</span>
                <div className="pref-content">
                  <label>Work Type</label>
                  <span className="pref-value">{profile.preferences?.jobType || 'Not set'}</span>
                </div>
              </div>
              <div className="pref-item">
                <span className="pref-icon">📍</span>
                <div className="pref-content">
                  <label>Location</label>
                  <span className="pref-value">{profile.preferences?.location || 'Not set'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Personal Information */}
        <div className="glass-card profile-section">
          <h3>👤 Personal Information</h3>
          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={profile.personal?.name || ''}
              onChange={handlePersonalChange}
              className="glass-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={profile.personal?.email || ''}
              onChange={handlePersonalChange}
              className="glass-input"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={profile.personal?.location || ''}
              onChange={handlePersonalChange}
              className="glass-input"
            />
            <select 
              className="glass-input"
              value={profile.field || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, field: e.target.value }))}
            >
              <option value="">Select Field</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="Product Management">Product Management</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>

        {/* Skills Section */}
        <div className="glass-card profile-section">
          <h3>🎯 Skills</h3>
          <form onSubmit={addSkill} className="skill-input-wrapper">
            <input
              type="text"
              placeholder="Add a skill (e.g., React, Python)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="glass-input"
            />
            <button type="submit" className="add-btn">+</button>
          </form>
          <div className="skills-grid">
            {(profile.skills || []).map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
                <button onClick={() => removeSkill(skill)}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="glass-card profile-section full-width">
          <h3>💼 Work Experience</h3>
          {(profile.experience || []).map((exp, idx) => (
            <div key={idx} className="experience-entry">
              <input
                type="text"
                placeholder="Company"
                value={exp?.company || ''}
                onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                className="glass-input"
              />
              <input
                type="text"
                placeholder="Job Title"
                value={exp?.title || ''}
                onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                className="glass-input"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 2020-2023)"
                value={exp?.duration || ''}
                onChange={(e) => updateExperience(idx, 'duration', e.target.value)}
                className="glass-input"
              />
              <textarea
                placeholder="Description (AI will use this to generate answers)"
                value={exp?.description || ''}
                onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                className="glass-textarea"
                rows="3"
              />
            </div>
          ))}
          <button onClick={addExperience} className="secondary-btn">
            + Add Experience
          </button>
        </div>
      </div>

      <div className="profile-actions">
        <button 
          onClick={handleSave} 
          className="primary-btn save-profile-btn"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Profile 💾'}
        </button>
      </div>
    </div>
  );
}