import { Link } from "react-router-dom";

const FEATURES = [
  ["🧠", "AI Validation", "Gemini evaluates demand, originality and viability."],
  ["📊", "Market Research", "Market size, trends and competitor analysis."],
  ["🎯", "Target Customers", "Find the segments most likely to buy."],
  ["🧩", "SWOT Analysis", "Strengths, weaknesses, opportunities, threats."],
  ["⚠️", "Risk Prediction", "See what could go wrong before you invest."],
  ["🚦", "GO / IMPROVE / AVOID", "A clear verdict with a score out of 100."],
];

const ROLES = ["Entrepreneur", "Mentor", "Industry Expert", "Moderator", "Admin", "Superadmin"];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <span className="pill">✨ Powered by Gemini AI</span>
        <h1>Validate your startup idea <span className="gradient">before you build it</span></h1>
        <p>Get market research, SWOT, risk analysis and a clear verdict in seconds.</p>
        <Link to="/register" className="btn">Validate my idea →</Link>
      </section>

      <section>
        <h2>Everything you need to decide</h2>
        <div className="grid grid-3">
          {FEATURES.map(([icon, title, text]) => (
            <div className="card hover" key={title}>
              <div className="icon">{icon}</div>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Built for the whole startup ecosystem</h2>
        <div className="chips">{ROLES.map((r) => <span key={r} className="chip">{r}</span>)}</div>
      </section>
    </>
  );
}
