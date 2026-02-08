import { useState, useEffect } from "react";
import LoginModal from "./components/LoginModal";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import ProfileManager from "./components/ProfileManager";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import AutofillAgent from "./components/AutofillAgent";
import ApplicationDashboard from "./components/ApplicationDashboard";
import JobBoard from "./components/JobBoard";
import ApplicationForm from "./components/ApplicationForm";
import { getUserProfile } from "./services/api";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applyingToJob, setApplyingToJob] = useState(null);
  const [myApplications, setMyApplications] = useState(() => {
    return JSON.parse(localStorage.getItem('myApplications') || '[]');
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn) {
      setIsLoggedIn(true);
      const profile = getUserProfile();
      if (!profile || !profile.onboardingComplete) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const handleLogin = (email) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    setIsLoggedIn(true);
    setShowLogin(false);
    
    const profile = getUserProfile();
    if (!profile || !profile.onboardingComplete) {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    // Clear ALL localStorage data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("jobApplications");
    localStorage.removeItem("myApplications");
    
    // Reset all state
    setIsLoggedIn(false);
    setActiveTab("jobs");
    setMyApplications([]);
    setShowOnboarding(false);
    setApplyingToJob(null);
    
    // Reload page to clear any cached state
    window.location.reload();
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleApply = (job, withAI = false) => {
    if (withAI) {
      setApplyingToJob(job);
    } else {
      const application = {
        id: Date.now(),
        jobId: job.id,
        jobTitle: job.role,
        company: job.company,
        logo: job.logo,
        location: job.location,
        salary: job.salary,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        answers: {}
      };
      saveApplication(application);
      setActiveTab('dashboard');
    }
  };

  const handleApplicationSubmit = (applicationData) => {
    const application = {
      id: Date.now(),
      ...applicationData,
      logo: applyingToJob.logo,
      location: applyingToJob.location,
      salary: applyingToJob.salary
    };
    saveApplication(application);
    setApplyingToJob(null);
    setActiveTab('dashboard');
  };

  const saveApplication = (application) => {
    const updated = [...myApplications, application];
    setMyApplications(updated);
    localStorage.setItem('myApplications', JSON.stringify(updated));
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleUpdateApplications = (updatedApps) => {
    setMyApplications(updatedApps);
  };

  if (!isLoggedIn) {
    return (
      <div className="app">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onLoginClick={() => setShowLogin(true)}
        />
        <Landing onLoginClick={() => setShowLogin(true)} />
        {showLogin && (
          <LoginModal 
            onClose={() => setShowLogin(false)}
            onLogin={handleLogin} 
          />
        )}
      </div>
    );
  }

  if (isLoggedIn && showOnboarding) {
    return (
      <div className="app">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (applyingToJob) {
    return (
      <div className="app">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout}
        />
        <div className="dashboard single-column">
          <main className="main-content full-width">
            <ApplicationForm 
              job={applyingToJob}
              onSubmit={handleApplicationSubmit}
              onCancel={() => setApplyingToJob(null)}
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
      />
      
      <button 
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '✕' : '☰'} Menu
      </button>

      <div className={`dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h3>AI Assistant</h3>
            <div className="status-indicator">
              <span className="status-dot online"></span>
              Online
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === "jobs" ? "active" : ""}`}
              onClick={() => handleNavClick("jobs")}
            >
              <span className="nav-icon">🔍</span>
              <div className="nav-info">
                <span className="nav-label">Find Jobs</span>
                <span className="nav-desc">Browse openings</span>
              </div>
            </button>

            <button 
              className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => handleNavClick("dashboard")}
            >
              <span className="nav-icon">📊</span>
              <div className="nav-info">
                <span className="nav-label">My Applications</span>
                <span className="nav-desc">Track {myApplications.length} apps</span>
              </div>
            </button>
            
            <button 
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => handleNavClick("profile")}
            >
              <span className="nav-icon">👤</span>
              <div className="nav-info">
                <span className="nav-label">Profile</span>
                <span className="nav-desc">Manage your data</span>
              </div>
            </button>
            
            <button 
              className={`nav-item ${activeTab === "analyzer" ? "active" : ""}`}
              onClick={() => handleNavClick("analyzer")}
            >
              <span className="nav-icon">📄</span>
              <div className="nav-info">
                <span className="nav-label">Resume Score</span>
                <span className="nav-desc">AI analysis & tips</span>
              </div>
            </button>
            
            <button 
              className={`nav-item ${activeTab === "autofill" ? "active" : ""}`}
              onClick={() => handleNavClick("autofill")}
            >
              <span className="nav-icon">⚡</span>
              <div className="nav-info">
                <span className="nav-label">Autofill</span>
                <span className="nav-desc">Auto-complete forms</span>
              </div>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="ai-status">
              <small>AI Model: GPT-4</small>
              <small>Last updated: Just now</small>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="content-wrapper">
            {activeTab === "jobs" && <JobBoard onApply={handleApply} />}
            {activeTab === "dashboard" && (
              <ApplicationDashboard 
                applications={myApplications} 
                onUpdateApplications={handleUpdateApplications}
              />
            )}
            {activeTab === "profile" && <ProfileManager />}
            {activeTab === "analyzer" && <ResumeAnalyzer />}
            {activeTab === "autofill" && <AutofillAgent />}
          </div>
        </main>
      </div>
      
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

export default App;