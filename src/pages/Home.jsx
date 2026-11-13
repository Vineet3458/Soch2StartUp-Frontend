import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  SparkleBadgeIcon,
  CheckIcon,
  ArrowRightIcon,
  PlayIcon,
  TargetIcon,
  LightningIcon,
  TrendingIcon,
  CommunityIcon,
} from "../components/Icons.jsx";

const STATS = [
  {
    icon: "/assets/icons/stat-ideas-hd.png",
    fallbackEmoji: "👥",
    value: "1,200+",
    label: "Ideas Analyzed",
  },
  {
    icon: "/assets/icons/stat-accuracy-hd.png",
    fallbackEmoji: "📈",
    value: "85%",
    label: "Validation Accuracy",
  },
  {
    icon: "/assets/icons/stat-founders-hd.png",
    fallbackEmoji: "🚀",
    value: "300+",
    label: "Aspiring Founders",
  },
  {
    icon: "/assets/icons/stat-mentors-hd.png",
    fallbackEmoji: "🎓",
    value: "50+",
    label: "Mentors & Experts",
  },
];

const FEATURES = [
  {
    icon: "/assets/icons/feature-ai-hd.png",
    fallbackEmoji: "🧠",
    title: "AI Idea Validation",
    description:
      "Get a comprehensive validation score with detailed insights.",
  },
  {
    icon: "/assets/icons/feature-market-hd.png",
    fallbackEmoji: "📊",
    title: "Market Analysis",
    description:
      "Understand market size, trends, and growth opportunities.",
  },
  {
    icon: "/assets/icons/feature-competitor-hd.png",
    fallbackEmoji: "👥",
    title: "Competitor Analysis",
    description:
      "Discover existing players, compare features and find your differentiation.",
  },
  {
    icon: "/assets/icons/feature-swot-hd.png",
    fallbackEmoji: "💠",
    title: "SWOT Analysis",
    description:
      "Analyze strengths, weaknesses, opportunities and threats.",
  },
  {
    icon: "/assets/icons/feature-feasibility-hd.png",
    fallbackEmoji: "🪙",
    title: "Feasibility Check",
    description:
      "Evaluate technical, financial and operational feasibility.",
  },
  {
    icon: "/assets/icons/feature-roadmap-hd.png",
    fallbackEmoji: "🚩",
    title: "MVP Roadmap",
    description:
      "Get a step-by-step plan to build and launch your product.",
  },
];

const STEPS = [
  {
    stepNumber: "1",
    icon: "/assets/icons/how-submit-hd.png",
    fallbackEmoji: "📄",
    title: "Submit Your Idea",
    description: "Share your startup idea, problem and solution.",
  },
  {
    stepNumber: "2",
    icon: "/assets/icons/how-ai-hd.png",
    fallbackEmoji: "✨",
    title: "Get AI Analysis",
    description:
      "Our AI analyzes the market, competitors, feasibility and risks.",
  },
  {
    stepNumber: "3",
    icon: "/assets/icons/how-report-hd.png",
    fallbackEmoji: "📊",
    title: "Receive Your Report",
    description:
      "Get a detailed validation report with scores, insights and next steps.",
  },
];

const WHY_POINTS = [
  {
    icon: <TargetIcon />,
    title: "Validate Early",
    description: "Test your idea before investing time and money.",
  },
  {
    icon: <LightningIcon />,
    title: "Make Data-Driven Decisions",
    description: "Rely on real market and industry insights.",
  },
  {
    icon: <TrendingIcon />,
    title: "Increase Success Rate",
    description: "Build a stronger, more viable business plan.",
  },
  {
    icon: <CommunityIcon />,
    title: "Learn from Experts",
    description: "Get guidance from mentors and industry professionals.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
      <section className="landing-hero-section">
        <div className="hero-content-container">
          {/* Left Column: Copy & Actions */}
          <div className="hero-text-col">
            <div className="hero-badge-pill">
              <span className="hero-badge-sparkle">
                <SparkleBadgeIcon />
              </span>
              <span>AI-Powered Startup Validation Platform</span>
            </div>

            <h1 className="hero-main-heading">
              Turn Your Startup Idea <br />
              <span className="hero-heading-gradient">Into a Scalable Business</span>
            </h1>

            <p className="hero-lead-text">
              Validate, analyze and improve your startup idea with the power of
              AI, real market insights and business intelligence.
            </p>

            <div className="hero-actions-row">
              <Link
                to={user ? "/validate" : "/register"}
                className="btn-primary-gradient"
              >
                Validate Your Idea <ArrowRightIcon />
              </Link>

              <button
                type="button"
                className="btn-secondary-white"
                onClick={() => setShowDemoModal(true)}
              >
                <PlayIcon /> Watch Demo
              </button>
            </div>

            {/* Checklist of 3 Key Highlights */}
            <div className="hero-highlights-row">
              <div className="highlight-item">
                <CheckIcon />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="highlight-item">
                <CheckIcon />
                <span>Real Market Insights</span>
              </div>
              <div className="highlight-item">
                <CheckIcon />
                <span>Actionable Roadmap</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Resolution Mockup */}
          <div className="hero-visual-col">
            <div className="hero-laptop-stage">
              <img
                src="/assets/hero-laptop-scene-hd.png"
                alt="Soch2Startup AI Idea Validation Dashboard mockup"
                className="hero-laptop-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTICS RIBBON */}
      <section className="stats-ribbon-section">
        <div className="stats-container">
          <div className="stats-grid">
            {STATS.map((stat, idx) => (
              <div className="stat-card-item" key={idx}>
                <div className="stat-icon-wrap">
                  <img
                    src={stat.icon}
                    alt=""
                    className="stat-icon-img"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = "inline";
                      }
                    }}
                  />
                  <span className="stat-icon-fallback" style={{ display: "none" }}>
                    {stat.fallbackEmoji}
                  </span>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stat.value}</h3>
                  <p className="stat-title">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="features-section" id="features">
        <div className="section-header-block center">
          <span className="section-eyebrow">FEATURES</span>
          <h2 className="section-title">
            Everything You Need to Validate <br />
            Your Startup Idea
          </h2>
          <p className="section-subtitle">
            A complete suite of AI-driven tools to evaluate, plan and build a
            successful startup.
          </p>
        </div>

        <div className="features-grid-container">
          <div className="features-grid-6">
            {FEATURES.map((item, idx) => (
              <div className="feature-card" key={idx}>
                <div className="feature-icon-box">
                  <img
                    src={item.icon}
                    alt=""
                    className="feature-icon-img"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = "inline";
                      }
                    }}
                  />
                  <span
                    className="feature-icon-fallback"
                    style={{ display: "none" }}
                  >
                    {item.fallbackEmoji}
                  </span>
                </div>
                <h3 className="feature-card-title">{item.title}</h3>
                <p className="feature-card-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-header-block center">
          <span className="section-eyebrow">HOW IT WORKS</span>
          <h2 className="section-title">
            Validate Your Idea <br />
            in 3 Simple Steps
          </h2>
        </div>

        <div className="how-steps-container">
          <div className="how-steps-flow">
            {STEPS.map((step, idx) => (
              <div className="step-flow-item" key={idx}>
                <div className="step-card">
                  <div className="step-card-header">
                    <span className="step-number-circle">{step.stepNumber}</span>
                    <div className="step-icon-wrap">
                      <img
                        src={step.icon}
                        alt=""
                        className="step-icon-img"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = "inline";
                          }
                        }}
                      />
                      <span
                        className="step-icon-fallback"
                        style={{ display: "none" }}
                      >
                        {step.fallbackEmoji}
                      </span>
                    </div>
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.description}</p>
                </div>

                {idx < STEPS.length - 1 && (
                  <div className="step-connector-arrow" aria-hidden="true">
                    <span>→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY SOCH2STARTUP SECTION (DARK BANNER) */}
      <section className="why-section-dark" id="about">
        <div className="why-container">
          <div className="why-grid-layout">
            {/* Left Header */}
            <div className="why-left-content">
              <span className="why-eyebrow">WHY SOCH2STARTUP?</span>
              <h2 className="why-main-title">
                Make Smarter <br />
                Startup Decisions
              </h2>
              <p className="why-lead-desc">
                Reduce risk, save time and build with confidence using AI, data
                and expert-backed insights.
              </p>
            </div>

            {/* Right Pillars */}
            <div className="why-right-cards">
              {WHY_POINTS.map((pt, idx) => (
                <div className="why-card-item" key={idx}>
                  <div className="why-card-icon">{pt.icon}</div>
                  <h3 className="why-card-title">{pt.title}</h3>
                  <p className="why-card-desc">{pt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. MODERN FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-top-row">
            <div className="footer-brand-col">
              <img
                src="/assets/nav-logo-hd.png"
                alt="Soch2Startup"
                className="footer-logo-img"
              />
              <p className="footer-tagline">
                India’s leading AI-driven startup idea validation platform.
                Empowering entrepreneurs, mentors, and experts.
              </p>
            </div>

            <div className="footer-links-group">
              <div className="footer-col">
                <h4>Platform</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#how-it-works">How It Works</a></li>
                  <li><Link to="/validate">Validate Idea</Link></li>
                  <li><Link to="/register">Create Account</Link></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Ecosystem</h4>
                <ul>
                  <li><span className="footer-pill-link">Entrepreneurs</span></li>
                  <li><span className="footer-pill-link">Mentors</span></li>
                  <li><span className="footer-pill-link">Industry Experts</span></li>
                  <li><span className="footer-pill-link">Moderators</span></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About Soch2Startup</a></li>
                  <li><Link to="/login">Sign In</Link></li>
                  <li><a href="mailto:support@soch2startup.com">Contact Support</a></li>
                  <li><span>Privacy & Terms</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>© 2026 Soch2Startup. Built with AI & Passion. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 7. WATCH DEMO MODAL */}
      {showDemoModal && (
        <div className="demo-modal-overlay" onClick={() => setShowDemoModal(false)}>
          <div
            className="demo-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="demo-modal-header">
              <div>
                <span className="demo-modal-badge">✦ LIVE REPORT DEMO</span>
                <h3>KrishiMitra AI – Smart Crop Advisory</h3>
              </div>
              <button
                type="button"
                className="demo-modal-close"
                onClick={() => setShowDemoModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="demo-modal-body">
              <div className="demo-score-row">
                <div className="demo-score-badge">
                  <strong>87</strong>
                  <span>/ 100</span>
                </div>
                <div>
                  <span className="demo-verdict-go">✔ HIGH POTENTIAL (GO)</span>
                  <p className="demo-modal-intro">
                    Strong market opportunity in rural agricultural supply chains with
                    86% market demand and 82% operational feasibility.
                  </p>
                </div>
              </div>

              <div className="demo-metrics-preview">
                <div className="demo-metric-item">
                  <span>Market Demand</span>
                  <div className="demo-bar"><div style={{ width: "86%" }} /></div>
                  <strong>86%</strong>
                </div>
                <div className="demo-metric-item">
                  <span>Feasibility</span>
                  <div className="demo-bar"><div style={{ width: "82%" }} /></div>
                  <strong>82%</strong>
                </div>
                <div className="demo-metric-item">
                  <span>Low Risk</span>
                  <div className="demo-bar"><div style={{ width: "78%" }} /></div>
                  <strong>78%</strong>
                </div>
              </div>
            </div>

            <div className="demo-modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowDemoModal(false)}
              >
                Close Preview
              </button>
              <Link
                to={user ? "/validate" : "/register"}
                className="btn-primary-gradient"
                onClick={() => setShowDemoModal(false)}
              >
                Validate Your Own Idea <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
