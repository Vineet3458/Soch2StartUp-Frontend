import { Link } from "react-router-dom";
import { ArrowRight, Award, BarChart3, Brain, CheckCircle2, GraduationCap, Layers, Lightbulb, MessageSquare, Radio, Rocket, ShieldCheck, Sparkles, Swords, Target, TrendingUp, Users, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { CountUp, Reveal, Tilt } from "../components/fx.jsx";
import { ScoreRing } from "../components/charts.jsx";
import { BrandMark, BrandName } from "../components/Brand.jsx";
import PublicNav from "../components/PublicNav.jsx";

const FEATURES = [
  [Brain, "AI idea validation", "Get a 0–100 score across demand, competition, feasibility, finances and risk in seconds.", "purple"],
  [Layers, "SWOT & market research", "Auto-generated SWOT, target customers and market notes tailored to your industry.", "cyan"],
  [Swords, "Competitor mapping", "See who you are up against and how crowded your niche really is.", "pink"],
  [GraduationCap, "Mentor matching", "Request a verified mentor, schedule sessions and get actionable guidance.", "green"],
  [Award, "Expert scorecards", "Industry experts rate your idea on six criteria. Disagree? Open a dispute.", "orange"],
  [Radio, "Real-time everything", "Approvals, feedback and notifications appear instantly — no refresh needed.", "purple"],
];
const STEPS = [["Submit your idea", "Describe the problem, customer and solution. Save drafts any time."], ["Get AI analysis", "Our engine scores it and builds your SWOT, risks and recommendations."], ["Improve with experts", "Admins review, mentors guide, experts evaluate — all live in your workspace."]];
const ROLES = [[Rocket, "Entrepreneurs", "Validate ideas, plan your MVP, request mentors."], [GraduationCap, "Mentors", "Guide founders, run sessions, share playbooks."], [Award, "Industry experts", "Score ideas with structured rubrics."], [ShieldCheck, "Admins", "Review ideas, verify people, run operations."], [Target, "Moderators", "Keep the community safe and constructive."], [BarChart3, "Superadmins", "Configure scoring, features, permissions and more."]];

export default function Home() {
  const { user } = useAuth();
  const { platform, categories, stats } = useConfig();
  const cats = categories.length ? categories : [{ name: "FoodTech" }, { name: "EdTech" }, { name: "HealthTech" }, { name: "FinTech" }, { name: "SaaS" }, { name: "AgriTech" }];
  return (
    <div className="pub" id="top">
      <PublicNav />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow stagger"><Sparkles size={14} color="var(--primary)" /> AI-powered startup validation platform</span>
            <h1>Turn your startup idea into a scalable business</h1>
            <p className="lead">{platform.tagline}. Validate with AI, get evaluated by industry experts and guided by mentors — in one live, collaborative workspace.</p>
            <div className="row wrap" style={{ marginTop: 30, gap: 14 }}>
              <Link to={user ? "/app" : "/register"} className="btn btn-lg">{user ? "Open dashboard" : "Validate my idea"} <ArrowRight size={18} /></Link>
              <Link to="/login" className="btn btn-outline btn-lg">{user ? "Switch account" : "Sign in"}</Link>
            </div>
            <div className="row wrap" style={{ marginTop: 30, gap: 22 }}>
              {["No credit card", "Results in seconds", "Mentors & experts"].map((t) => <span key={t} className="row small muted" style={{ gap: 7 }}><CheckCircle2 size={16} color="var(--success)" />{t}</span>)}
            </div>
          </div>
          <div className="hero-visual">
            <div className="orbit" style={{ inset: "-30px -20px", borderRadius: "50%" }} />
            <Tilt className="mock" max={6}>
              <div className="row between"><div className="row"><BrandMark size={28} /><b style={{ fontFamily: "var(--font-display)" }}>Idea Validation</b></div><span className="badge GO">✓ GO</span></div>
              <div className="row" style={{ gap: 22, marginTop: 20 }}>
                <ScoreRing score={87} size={130} />
                <div className="col grow" style={{ gap: 11 }}>
                  {[["Market demand", 91], ["Feasibility", 82], ["Financial", 76], ["Risk", 84]].map(([l, v]) => <div key={l}><div className="row between tiny muted"><span>{l}</span><b>{v}</b></div><div className="progress" style={{ height: 6 }}><i style={{ width: `${v}%` }} /></div></div>)}
                </div>
              </div>
              <div className="swot" style={{ marginTop: 18, gap: 8 }}>
                {[["Strengths", "var(--success)"], ["Opportunities", "var(--info)"]].map(([t, c]) => <div key={t} style={{ "--c": c, padding: "10px 12px" }}><h4 style={{ margin: 0, fontSize: 12 }}>{t}</h4><div className="skeleton" style={{ height: 8, marginTop: 8 }} /><div className="skeleton" style={{ height: 8, marginTop: 6, width: "70%" }} /></div>)}
              </div>
            </Tilt>
            <div className="float-chip float-b" style={{ top: -10, right: -14 }}><Zap size={16} color="var(--warning)" /> Analysis in 4s</div>
            <div className="float-chip float-c" style={{ bottom: 40, left: -26 }}><MessageSquare size={16} color="var(--accent)" /> Mentor feedback received</div>
            <div className="float-chip float-a" style={{ bottom: -16, right: 30 }}><TrendingUp size={16} color="var(--success)" /> Idea approved 🎉</div>
          </div>
        </div>
      </section>

      <div className="marquee"><div className="marquee-in">{[...cats, ...cats, ...cats, ...cats].map((c, i) => <span key={i}><Lightbulb size={16} color={c.color || "var(--primary)"} />{c.name}</span>)}</div></div>

      <section className="section" id="features"><div className="container">
        <Reveal className="section-head"><span className="eyebrow">Features</span><h2>Everything you need to validate & grow</h2><p>From a rough idea to an investor-ready plan — structured, measurable and collaborative.</p></Reveal>
        <div className="grid g3 card-group">{FEATURES.map(([I, t, d, g], i) => <Reveal key={t} delay={i * 70}><Tilt className={`card feature g-${g}`}><div className="ico"><I size={26} /></div><h3>{t}</h3><p>{d}</p></Tilt></Reveal>)}</div>
      </div></section>

      <section className="section" id="how" style={{ background: "var(--surface)", borderBlock: "1px solid var(--border)" }}><div className="container">
        <Reveal className="section-head"><span className="eyebrow">How it works</span><h2>From idea to insight in three steps</h2></Reveal>
        <div className="grid g3">{STEPS.map(([t, d], i) => <Reveal key={t} delay={i * 120} className="step"><div className="n">{i + 1}</div><h3 style={{ marginBottom: 8 }}>{t}</h3><p className="muted">{d}</p></Reveal>)}</div>
      </div></section>

      <section className="section" id="stats"><div className="container">
        <Reveal className="section-head"><span className="eyebrow"><Radio size={13} color="var(--success)" /> Live from the platform</span><h2>Real numbers, updated in real time</h2></Reveal>
        <div className="grid g4 card-group">
          {[["Founders & professionals", stats?.users, Users], ["Ideas validated", stats?.ideas, Lightbulb], ["Verified mentors & experts", stats?.mentors, GraduationCap], ["Average idea score", stats?.avgScore, Target]].map(([l, v, I], i) => (
            <Reveal key={l} delay={i * 80}><div className="card big-stat"><I size={26} color="var(--primary)" /><div className="v" style={{ marginTop: 10 }}>{v == null ? "—" : <CountUp value={v} />}</div><div className="l">{l}</div></div></Reveal>))}
        </div>
      </div></section>

      <section className="section" id="roles" style={{ paddingTop: 20 }}><div className="container">
        <Reveal className="section-head"><span className="eyebrow">Built for everyone</span><h2>One platform, six workspaces</h2></Reveal>
        <div className="grid g3 card-group">{ROLES.map(([I, t, d], i) => <Reveal key={t} delay={i * 60}><div className="card hover row" style={{ alignItems: "flex-start", gap: 16 }}><div className="stat" style={{ padding: 0 }}><div className="ico g-purple" style={{ width: 46, height: 46 }}><I size={22} /></div></div><div><h3 style={{ fontSize: 17 }}>{t}</h3><p className="muted small" style={{ marginTop: 4 }}>{d}</p></div></div></Reveal>)}</div>
      </div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <Reveal><div className="cta-box"><h2 style={{ fontSize: "clamp(28px,4vw,44px)" }}>Ready to test your big idea?</h2><p className="muted" style={{ margin: "14px auto 28px", maxWidth: 520, fontSize: 17 }}>Join {platform.name} and get an AI-powered validation report in under a minute.</p><Link to={user ? "/app/validate" : "/register"} className="btn btn-lg">Get started free <ArrowRight size={18} /></Link></div></Reveal>
      </div></section>

      <footer className="footer"><div className="container row between" style={{ flexWrap: "wrap" }}><div className="row"><BrandMark size={28} /><BrandName name={platform.name} /></div><span>© {new Date().getFullYear()} {platform.name}. Built as a Final Year Project.</span>{platform.supportEmail && <a href={`mailto:${platform.supportEmail}`}>{platform.supportEmail}</a>}</div></footer>
    </div>
  );
}
