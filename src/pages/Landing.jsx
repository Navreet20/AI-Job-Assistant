import React from "react";
import GlassCard from "../components/GlassCard";
import "./Landing.css";

export default function Landing({ onLoginClick }) {
  return (
    <div className="landing">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <section className="hero">
        <GlassCard>
          <h1 className="hero-title">
            Your <span>AI-Powered</span> Job Assistant
          </h1>

          <p className="hero-subtitle">
            Discover jobs, analyze resumes, and plan your career — powered by AI.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={onLoginClick}>
              Get Started →
            </button>
            <button className="secondary-btn">
              Learn More
            </button>
          </div>
        </GlassCard>
      </section>

      <section className="features">
        <GlassCard>
          <h3>🎯 Smart Job Matching</h3>
          <p>AI finds jobs that truly fit your skills and goals.</p>
        </GlassCard>

        <GlassCard>
          <h3>📄 Resume Analysis</h3>
          <p>Upload your resume and get instant feedback.</p>
        </GlassCard>

        <GlassCard>
          <h3>🚀 Career Roadmap</h3>
          <p>Personalized guidance for your next career move.</p>
        </GlassCard>
      </section>
    </div>
  );
}
