import React from "react";
import { useContext } from "react";
import { AppState } from "../App";
import "./Home.css";

function Home() {
  const { user } = useContext(AppState);
  return (
    <div className="page-shell home-page">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="hero-badge">Evangadi Forum</span>
          <h1 className="hero-title">
            Connect, share, and build knowledge in 3D style.
          </h1>
          <p className="hero-text">
            Discover answers faster with a modern discussion platform designed
            for developers.
          </p>
          <div className="hero-stats">
            <div className="stat-card">
              <span>Member</span>
              <strong>{user?.username || "Guest"}</strong>
            </div>
            <div className="stat-card">
              <span>Topics</span>
              <strong>Explore ideas</strong>
            </div>
          </div>
        </div>
        <div className="hero-preview">
          <div className="preview-orb" />
          <div className="preview-panel">
            <h2>Latest Discussions</h2>
            <p>
              Jump into the hottest conversations and share your expert
              insights.
            </p>
          </div>
        </div>
      </div>

      <div className="preview-cards">
        <article className="preview-card">
          <h3>3D Design Boost</h3>
          <p>
            Experience a polished interface with smooth shadows and layered
            glass panels.
          </p>
        </article>
        <article className="preview-card">
          <h3>Fast Authentication</h3>
          <p>
            Secure login with a clean, futuristic form layout that feels
            premium.
          </p>
        </article>
        <article className="preview-card">
          <h3>Modern Navigation</h3>
          <p>
            Easy access to community features and responsive layout across
            devices.
          </p>
        </article>
      </div>
    </div>
  );
}

export default Home;
