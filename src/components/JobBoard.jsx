import React, { useState } from 'react';
import { jobListings, filterOptions } from '../data/jobListings';
import './JobBoard.css';

export default function JobBoard({ onApply }) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    experience: 'All Levels',
    type: 'All Types',
    location: 'All Locations'
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExperience = filters.experience === 'All Levels' || job.experience === filters.experience;
    const matchesType = filters.type === 'All Types' || job.type === filters.type;
    const matchesLocation = filters.location === 'All Locations' || 
                           (filters.location === 'Remote' && job.type === 'Remote') ||
                           job.location === filters.location;
    
    return matchesSearch && matchesExperience && matchesType && matchesLocation;
  });

  const activeFiltersCount = Object.values(filters).filter(f => !f.includes('All')).length;

  if (selectedJob) {
    return (
      <JobDetail 
        job={selectedJob} 
        onBack={() => setSelectedJob(null)}
        onApply={onApply}
      />
    );
  }

  return (
    <div className="job-board">
      <div className="glass-card board-header">
        <h2>🔍 Find Your Dream Job</h2>
        <p className="subtitle">Browse {filteredJobs.length} of {jobListings.length} open positions</p>
        
        <div className="search-section">
          <input 
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input search-input"
          />
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Experience Level</label>
            <select 
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
              className="glass-input"
            >
              {filterOptions.experience.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Work Type</label>
            <select 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="glass-input"
            >
              {filterOptions.type.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select 
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="glass-input"
            >
              {filterOptions.location.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button 
            className="clear-filters"
            onClick={() => setFilters({ experience: 'All Levels', type: 'All Types', location: 'All Locations' })}
          >
            Clear {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="glass-card no-results">
          <h3>No jobs match your filters</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map(job => (
            <div key={job.id} className="glass-card job-card" onClick={() => setSelectedJob(job)}>
              <div className="job-header">
                <span className="job-logo">{job.logo}</span>
                <div className="job-badges">
                  <span className="badge experience">{job.experience}</span>
                  <span className="badge type">{job.type}</span>
                </div>
              </div>
              
              <h3 className="job-role">{job.role}</h3>
              <p className="job-company">{job.company}</p>
              
              <div className="job-details">
                <span className="detail-tag">📍 {job.location}</span>
                <span className="detail-tag">💰 {job.salary}</span>
              </div>
              
              <p className="job-preview">{job.description}</p>
              
              <div className="job-footer">
                <span className="posted-date">Posted {job.postedDate}</span>
                {/* <button className="view-btn">View →</button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function JobDetail({ job, onBack, onApply }) {
  return (
    <div className="job-detail">
      <button onClick={onBack} className="back-btn">← Back to Jobs</button>
      
      <div className="glass-card detail-header">
        <div className="detail-company">
          <span className="detail-logo">{job.logo}</span>
          <div>
            <div className="detail-badges">
              <span className="badge experience">{job.experience}</span>
              <span className="badge type">{job.type}</span>
            </div>
            <h2>{job.role}</h2>
            <p>{job.company} • {job.location}</p>
          </div>
        </div>
        <button 
          className="primary-btn apply-now-btn"
          onClick={() => onApply(job, true)}
        >
          Apply Now 🚀
        </button>
      </div>

      <div className="detail-grid">
        <div className="glass-card detail-section">
          <h3>About the Role</h3>
          <p>{job.description}</p>
          
          <h4>Requirements</h4>
          <ul>
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
          
          <div className="detail-tags">
            <span className="detail-tag">💰 {job.salary}</span>
            <span className="detail-tag">📅 Posted {job.postedDate}</span>
          </div>
        </div>

        <div className="glass-card ai-help-section">
          <h3>🤖 AI Application Helper</h3>
          <p>This position requires answering {job.questions.length} questions. Our AI can help you:</p>
          <ul className="ai-features">
            <li>✍️ Write compelling answers</li>
            <li>🎯 Tailor responses to {job.company}</li>
            <li>💡 Highlight relevant experience</li>
            <li>⚡ Save time applying</li>
          </ul>
          <button 
            className="secondary-btn"
            onClick={() => onApply(job, true)}
          >
            Start with AI Help ✨
          </button>
        </div>
      </div>
    </div>
  );
}