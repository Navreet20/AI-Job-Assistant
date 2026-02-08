import React, { useState, useEffect } from 'react';
import { 
  mockApplications, 
  statusFlow, 
  getStatusColor, 
  calculateStats 
} from '../data/mockApplications';
import './ApplicationDashboard.css';

export default function ApplicationDashboard({ applications, onUpdateApplications }) {
  const [localApps, setLocalApps] = useState(applications.length > 0 ? applications : mockApplications);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Sync with parent when applications prop changes
  useEffect(() => {
    if (applications.length > 0) {
      setLocalApps(applications);
    }
  }, [applications]);

  const stats = calculateStats(localApps);

  const filteredApplications = localApps
    .filter(app => {
      if (filter === 'all') return true;
      if (filter === 'active') return !['Rejected after Interview', 'Declined', 'Offer Received'].includes(app.status);
      if (filter === 'interviews') return app.status.includes('Interview');
      return app.status === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      if (sortBy === 'status') return statusFlow.indexOf(a.status) - statusFlow.indexOf(b.status);
      return 0;
    });

  const updateStatus = (id, newStatus) => {
    const updated = localApps.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    setLocalApps(updated);
    localStorage.setItem('jobApplications', JSON.stringify(updated));
    
    // Notify parent component
    if (onUpdateApplications) {
      onUpdateApplications(updated);
    }
  };

  const getStageProgress = (status) => {
    return statusFlow.indexOf(status);
  };

  return (
    <div className="application-dashboard">
      <div className="glass-card dashboard-header">
        <h2>📊 Application Tracker</h2>
        <p className="subtitle">Monitor your job search progress across {localApps.length} applications</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <span className="stat-icon">📝</span>
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Applications</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-icon">⚡</span>
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">{stats.interviews}</span>
          <span className="stat-label">Interviews</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-icon">🏆</span>
          <span className="stat-value">{stats.offers}</span>
          <span className="stat-label">Offers</span>
        </div>
        <div className="glass-card stat-card wide">
          <span className="stat-icon">📈</span>
          <span className="stat-value">{stats.responseRate}%</span>
          <span className="stat-label">Response Rate</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card filters-card">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="glass-input">
            <option value="all">All Applications</option>
            <option value="active">Active Only</option>
            <option value="interviews">Interviews</option>
            <option value="Submitted">Submitted</option>
            <option value="Offer Received">Offers</option>
            <option value="Rejected after Interview">Rejected</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="glass-input">
            <option value="date">Date Applied</option>
            <option value="company">Company Name</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="glass-card applications-list">
        <div className="list-header">
          <h3>Your Applications ({filteredApplications.length})</h3>
        </div>

        <div className="applications">
          {filteredApplications.map(app => (
            <div key={app.id} className="application-row">
              <div className="app-company">
                <span className="company-logo">{app.logo}</span>
                <div className="company-info">
                  <h4>{app.company}</h4>
                  <p>{app.role}</p>
                  <small>{app.location}</small>
                </div>
              </div>

              <div className="app-progress">
                <div className="progress-bar">
                  {statusFlow.slice(0, -2).map((stage, idx) => (
                    <div 
                      key={stage}
                      className={`progress-segment ${idx <= getStageProgress(app.status) ? 'active' : ''}`}
                      style={{
                        background: idx <= getStageProgress(app.status) ? getStatusColor(app.status) : '#e2e8f0'
                      }}
                      title={stage}
                    />
                  ))}
                </div>
                <span className="progress-label">{app.status}</span>
              </div>

              <div className="app-details">
                <span className="salary-tag">{app.salary}</span>
                <small>via {app.appliedVia}</small>
              </div>

              <div className="app-status-control">
                <select 
                  value={app.status}
                  onChange={(e) => updateStatus(app.id, e.target.value)}
                  className="status-select"
                  style={{ borderColor: getStatusColor(app.status), color: getStatusColor(app.status) }}
                >
                  {statusFlow.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <small className="app-date">{app.appliedDate || app.date}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Visualization - NUMBERS REMOVED */}
      <div className="glass-card pipeline-view">
        <h3>📈 Application Pipeline</h3>
        <div className="pipeline">
          {statusFlow.slice(0, 6).map((status) => {
            const count = localApps.filter(a => a.status === status).length;
            const percentage = (count / localApps.length) * 100;
            return (
              <div key={status} className="pipeline-stage">
                <div className="stage-visual">
                  <div 
                    className="stage-bar" 
                    style={{ 
                      height: `${Math.max(percentage * 3, 20)}px`,
                      background: getStatusColor(status)
                    }}
                  />
                  {/* REMOVED: <span className="stage-count">{count}</span> */}
                </div>
                <span className="stage-name" title={status}>
                  {status.replace('Onsite/Video ', '').replace('Received ', '').replace(' yet', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card recent-activity">
        <h3>🕐 Recent Activity</h3>
        <div className="activity-list">
          {localApps
            .sort((a, b) => new Date(b.date || b.appliedDate) - new Date(a.date || a.appliedDate))
            .slice(0, 5)
            .map(app => (
              <div key={app.id} className="activity-item">
                <span className="activity-date">{app.appliedDate || app.date}</span>
                <span className="activity-company">{app.company}</span>
                <span 
                  className="activity-status"
                  style={{ color: getStatusColor(app.status) }}
                >
                  {app.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}