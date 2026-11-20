import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  CheckCircle2,
  GraduationCap,
  Layers,
  Lightbulb,
  MessageSquare,
  Radio,
  Rocket,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { CountUp, Reveal, Tilt } from "../components/fx.jsx";
import { ScoreRing } from "../components/charts.jsx";
import { BrandMark, BrandName } from "../components/Brand.jsx";
import PublicNav from "../components/PublicNav.jsx";
import {
  Spotlight,
  FlipWords,
  SpotlightCard,
  BentoGrid,
  BentoGridItem,
  InfiniteMovingCards,
  Meteors,
  ShimmerButton,
  GridBackground,
  TimelineSteps,
} from "../components/aceternity/index.js";

const DEFAULT_CATEGORIES = [
  { name: "AI & Machine Learning", color: "var(--primary)" },
  { name: "FinTech & Banking", color: "var(--accent)" },
  { name: "HealthTech & Bio", color: "var(--success)" },
  { name: "SaaS & Cloud Tools", color: "var(--info)" },
  { name: "EdTech & Learning", color: "var(--warning)" },
  { name: "CleanTech & Climate", color: "var(--accent)" },
  { name: "E-Commerce & Retail", color: "var(--danger)" },
  { name: "AgriTech & Food", color: "var(--success)" },
  { name: "CyberSecurity", color: "var(--primary)" },
  { name: "DeepTech & Hardware", color: "var(--info)" },
];

const STEPS = [
  {
    tag: "STEP 01",
    title: "Submit your idea",
    desc: "Describe your customer problem, market opportunity and business model. Save drafts anytime.",
    icon: <Rocket size={20} color="var(--primary)" />,
  },
  {
    tag: "STEP 02",
    title: "Get AI analysis",
    desc: "Our engine evaluates demand, competition, unit economics and generates your comprehensive SWOT.",
    icon: <Brain size={20} color="var(--accent)" />,
  },
  {
    tag: "STEP 03",
    title: "Scale with experts",
    desc: "Collaborate with verified mentors and industry experts to refine your pitch and launch your MVP.",
    icon: <Award size={20} color="var(--warning)" />,
  },
];

const ROLES = [
  [Rocket, "Entrepreneurs", "Validate ideas, plan your MVP, request mentors, and track market fit."],
  [GraduationCap, "Mentors", "Guide founders, conduct 1-on-1 sessions, and share battle-tested playbooks."],
  [Award, "Industry experts", "Score ideas against structured multi-criteria rubrics and review disputes."],
  [ShieldCheck, "Admins", "Review submissions, verify mentors and experts, and orchestrate platform ops."],
  [Target, "Moderators", "Ensure high-quality discussions and maintain a constructive startup community."],
  [BarChart3, "Superadmins", "Configure scoring weights, feature gates, permissions, and audit trails."],
];

export default function Home() {
  const { user } = useAuth();
  const { platform, categories, stats } = useConfig();
  const cats = categories.length ? categories : DEFAULT_CATEGORIES;

  return (
    <div className="pub" id="top">
      <PublicNav />

      {/* ═══ 1. HERO SECTION (Spotlight + Grid + FlipWords + Shimmer Button) ═══ */}
      <section className="hero">
        <GridBackground variant="grid" mask="radial">
          <Spotlight />
          <div className="container hero-grid">
            <div style={{ position: "relative", zIndex: 3 }}>
              <span className="eyebrow stagger">
                <Sparkles size={14} color="var(--primary)" /> AI-Powered Startup Intelligence
              </span>
              <h1>
                Turn your startup idea into a{" "}
                <FlipWords
                  words={[
                    "scalable business",
                    "market leader",
                    "funded venture",
                    "thriving company",
                  ]}
                />
              </h1>
              <p className="lead">
                {platform.tagline || "Turn your startup idea into a scalable business"}. Validate
                with AI, get evaluated by industry experts and guided by mentors — in one live,
                collaborative workspace.
              </p>
              <div className="row wrap" style={{ marginTop: 32, gap: 14 }}>
                <ShimmerButton to={user ? "/app" : "/register"} size="lg">
                  {user ? "Open dashboard" : "Validate my idea"} <ArrowRight size={18} />
                </ShimmerButton>
                <Link to="/login" className="btn btn-outline btn-lg">
                  {user ? "Switch account" : "Sign in"}
                </Link>
              </div>
              <div className="row wrap" style={{ marginTop: 28, gap: 20 }}>
                {["No credit card needed", "Instant AI analysis in 4s", "Verified mentors & experts"].map(
                  (t) => (
                    <span key={t} className="row small muted" style={{ gap: 7 }}>
                      <CheckCircle2 size={16} color="var(--success)" />
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* ═══ Hero Interactive Mockup with SpotlightCard & 3D Tilt ═══ */}
            <div className="hero-visual" style={{ position: "relative", zIndex: 3 }}>
              <Tilt max={6} scale={1.01}>
                <SpotlightCard className="mock" spotlightColor="rgba(0, 112, 243, 0.22)">
                  <div className="row between">
                    <div className="row">
                      <BrandMark size={28} />
                      <b style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                        Idea Validation Report
                      </b>
                    </div>
                    <span className="badge GO">✓ GO (High Potential)</span>
                  </div>
                  <div className="row" style={{ gap: 24, marginTop: 22 }}>
                    <ScoreRing score={87} size={128} />
                    <div className="col grow" style={{ gap: 10 }}>
                      {[
                        ["Market demand", 91, "var(--primary)"],
                        ["Feasibility", 82, "var(--accent)"],
                        ["Financial viability", 76, "var(--warning)"],
                        ["Risk mitigation", 84, "var(--success)"],
                      ].map(([l, v, c]) => (
                        <div key={l}>
                          <div className="row between tiny muted">
                            <span>{l}</span>
                            <b style={{ color: "var(--text)" }}>{v}%</b>
                          </div>
                          <div className="progress" style={{ height: 6, marginTop: 4 }}>
                            <i style={{ width: `${v}%`, background: c }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="swot" style={{ marginTop: 20, gap: 10 }}>
                    {[
                      ["Strengths", "var(--success)", "Proprietary algorithmic IP & direct API access"],
                      ["Opportunities", "var(--info)", "Unmet demand in Tier-2/3 high-growth markets"],
                    ].map(([t, c, desc]) => (
                      <div
                        key={t}
                        style={{
                          "--c": c,
                          padding: "10px 12px",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--surface-2)",
                          borderLeft: `3px solid ${c}`,
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: 12, color: c }}>{t}</h4>
                        <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </Tilt>
              <div className="float-chip float-b" style={{ top: -12, right: -12 }}>
                <Zap size={16} color="var(--warning)" /> AI Analysis in 3.8s
              </div>
              <div className="float-chip float-c" style={{ bottom: 36, left: -24 }}>
                <MessageSquare size={16} color="var(--accent)" /> Mentor session booked
              </div>
              <div className="float-chip float-a" style={{ bottom: -18, right: 24 }}>
                <TrendingUp size={16} color="var(--success)" /> Idea approved by Expert 🎉
              </div>
            </div>
          </div>
        </GridBackground>
      </section>

      {/* ═══ 2. INFINITE MOVING CARDS (Aceternity Marquee with Gradient Fade) ═══ */}
      <div className="marquee" style={{ borderBlock: "1px solid var(--border)", background: "var(--surface)" }}>
        <InfiniteMovingCards
          items={cats}
          direction="left"
          speed="normal"
          pauseOnHover={true}
          renderItem={(cat) => (
            <span className="category-pill">
              <Lightbulb size={15} color={cat.color || "var(--primary)"} />
              {cat.name}
            </span>
          )}
        />
      </div>

      {/* ═══ 3. FEATURES (Aceternity Bento Grid Layout) ═══ */}
      <section className="section" id="features">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Platform Capabilities</span>
            <h2>Everything you need to validate & scale</h2>
            <p>From an initial hypothesis to an investor-ready plan — structured, measurable and collaborative.</p>
          </Reveal>

          <BentoGrid>
            {/* Bento Item 1: Span 2 on desktop */}
            <BentoGridItem
              className="bento-col-2"
              title="AI Idea Validation Engine"
              description="Score your startup across market demand, competitive density, technical feasibility, financial viability, and execution risk in seconds."
              icon={<Brain size={24} />}
              badge="Neural Engine"
              spotlightColor="rgba(0, 112, 243, 0.22)"
              header={
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ padding: "8px 14px", borderRadius: "var(--radius-sm)", background: "rgba(80, 227, 194, 0.12)", color: "var(--success)", fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 13 }}>
                      SCORE: 92 / 100
                    </div>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>Confidence: Very High</span>
                  </div>
                  <div className="row tiny muted" style={{ gap: 8 }}>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }} />
                    Live analysis
                  </div>
                </div>
              }
            />

            {/* Bento Item 2 */}
            <BentoGridItem
              title="Automated SWOT & Research"
              description="Get automated SWOT analysis, ideal customer profiles (ICP), and TAM/SAM/SOM estimations tailored specifically to your sector."
              icon={<Layers size={24} />}
              badge="Market Intel"
              spotlightColor="rgba(80, 227, 194, 0.18)"
              header={
                <div className="grid g2" style={{ width: "100%", gap: 8 }}>
                  <div style={{ padding: "6px 8px", borderRadius: 4, background: "rgba(80, 227, 194, 0.1)", fontSize: 11, color: "var(--success)" }}>✓ Moat identified</div>
                  <div style={{ padding: "6px 8px", borderRadius: 4, background: "rgba(0, 112, 243, 0.1)", fontSize: 11, color: "var(--primary)" }}>✓ ICP mapped</div>
                </div>
              }
            />

            {/* Bento Item 3 */}
            <BentoGridItem
              title="Competitor Landscape Mapping"
              description="Visualize direct and indirect competitors, monitor market crowding, and spot blue ocean differentiation opportunities."
              icon={<Swords size={24} />}
              badge="Competitive Edge"
              spotlightColor="rgba(255, 77, 77, 0.15)"
              header={
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                  <span className="badge GO" style={{ fontSize: 11 }}>You (Leader)</span>
                  <span className="muted tiny">vs. 4 Incumbents</span>
                </div>
              }
            />

            {/* Bento Item 4 */}
            <BentoGridItem
              title="1-on-1 Mentor Matchmaking"
              description="Connect with seasoned founders and mentors who have built and exited in your industry. Schedule sessions and get battle-tested guidance."
              icon={<GraduationCap size={24} />}
              badge="Verified Mentors"
              spotlightColor="rgba(80, 227, 194, 0.2)"
              header={
                <div className="row between wrap" style={{ width: "100%", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {["Aarav", "Neha", "Vikram"].map((name, i) => (
                      <span
                        key={name}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "var(--primary)",
                          border: "2px solid var(--surface-2)",
                          color: "#fff",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          marginLeft: i > 0 ? -8 : 0,
                          position: "relative",
                          zIndex: 3 - i,
                        }}
                      >
                        {name[0]}
                      </span>
                    ))}
                  </div>
                  <span className="tiny" style={{ color: "var(--success)", fontWeight: 600 }}>Active sessions</span>
                </div>
              }
            />

            {/* Bento Item 5 */}
            <BentoGridItem
              title="Real-Time Synchronization"
              description="Approvals, reviews, dispute responses, and mentor feedback stream live into your workspace without any page refresh."
              icon={<Radio size={24} />}
              badge="Sub-Second Sync"
              spotlightColor="rgba(0, 112, 243, 0.18)"
              header={
                <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="live-pulse-dot" />
                  <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                    SSE Live Stream Connected
                  </span>
                </div>
              }
            />

            {/* Bento Item 6: Span 3 on desktop */}
            <BentoGridItem
              className="bento-col-3"
              title="Expert Scorecards & Multi-Criteria Rubrics"
              description="Industry experts rate your business model across 6 standardized criteria. Complete transparency — if you dispute a rating, request formal peer review."
              icon={<Award size={24} />}
              badge="Structured Evaluation"
              spotlightColor="rgba(245, 166, 35, 0.2)"
              header={
                <div style={{ width: "100%", display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Product-Market Fit (9.4)", "Unit Economics (8.8)", "Tech Scalability (9.1)", "Defensibility (8.6)", "Regulatory Moat (8.9)"].map((tag) => (
                    <span key={tag} style={{ fontSize: 11, fontFamily: "var(--font-mono)", padding: "4px 8px", borderRadius: 4, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              }
            />
          </BentoGrid>
        </div>
      </section>

      {/* ═══ 4. HOW IT WORKS (Aceternity Timeline Steps) ═══ */}
      <section className="section" id="how" style={{ background: "var(--surface)", borderBlock: "1px solid var(--border)" }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Process</span>
            <h2>From concept to validation in three steps</h2>
            <p>A streamlined pathway built to save months of misdirected effort and capital.</p>
          </Reveal>

          <TimelineSteps steps={STEPS} />
        </div>
      </section>

      {/* ═══ 5. STATS (Aceternity Spotlight Cards with Live Pulse) ═══ */}
      <section className="section" id="stats">
        <div className="container">
          <Reveal className="section-head">
            <div className="live-pulse-badge" style={{ margin: "0 auto 12px" }}>
              <span className="live-pulse-dot" />
              Live Platform Metrics
            </div>
            <h2>Real numbers, updated in real time</h2>
            <p>Fueling the next generation of high-impact startups.</p>
          </Reveal>

          <div className="grid g4">
            {[
              ["Founders & professionals", stats?.users, Users, "var(--primary)"],
              ["Ideas validated", stats?.ideas, Lightbulb, "var(--accent)"],
              ["Verified mentors & experts", stats?.mentors, GraduationCap, "var(--warning)"],
              ["Average idea score", stats?.avgScore, Target, "var(--success)"],
            ].map(([l, v, Icon, col], i) => (
              <Reveal key={l} delay={i * 80}>
                <SpotlightCard className="big-stat" spotlightColor={`color-mix(in srgb, ${col} 22%, transparent)`}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", background: "var(--surface-2)", display: "grid", placeItems: "center", color: col, border: "1px solid var(--border)" }}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="v">{v == null ? "—" : <CountUp value={v} />}</div>
                  <div className="l">{l}</div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. ROLES / WHO IT'S FOR ═══ */}
      <section className="section" id="roles" style={{ paddingTop: 20 }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Ecosystem</span>
            <h2>One platform, six dedicated workspaces</h2>
            <p>Engineered for every stakeholder in the entrepreneurial journey.</p>
          </Reveal>

          <div className="grid g3">
            {ROLES.map(([Icon, title, desc], i) => (
              <Reveal key={title} delay={i * 60}>
                <SpotlightCard className="card hover row" style={{ alignItems: "flex-start", gap: 16, padding: 22 }}>
                  <div style={{ padding: 0 }}>
                    <div className="ico g-purple" style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", display: "grid", placeItems: "center", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--primary)" }}>
                      <Icon size={22} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 17, marginBottom: 4 }}>{title}</h3>
                    <p className="muted small" style={{ lineHeight: 1.55 }}>
                      {desc}
                    </p>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. CTA SECTION (Aceternity Meteors + Shimmer Button) ═══ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="aceternity-cta-container">
              <div className="aceternity-cta-beam" />
              <Meteors number={22} />
              <div style={{ position: "relative", zIndex: 3 }}>
                <span className="eyebrow" style={{ marginBottom: 16 }}>
                  <Radio size={13} color="var(--success)" /> Instant Access Available
                </span>
                <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.035em", margin: "12px 0" }}>
                  Ready to test your big idea?
                </h2>
                <p
                  className="muted"
                  style={{
                    margin: "14px auto 32px",
                    maxWidth: 540,
                    fontSize: 17,
                    lineHeight: 1.6,
                  }}
                >
                  Join {platform.name || "Soch2Startup"} today and receive an AI-powered validation
                  report with expert scorecard in under a minute.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
                  <ShimmerButton to={user ? "/app/validate" : "/register"} size="lg">
                    Get started free <ArrowRight size={18} />
                  </ShimmerButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="container row between" style={{ flexWrap: "wrap", gap: 16 }}>
          <div className="row">
            <BrandMark size={28} />
            <BrandName name={platform.name} />
          </div>
          <div className="row gap-m small muted" style={{ flexWrap: "wrap" }}>
            <span>© {new Date().getFullYear()} {platform.name}. Built as a Final Year Project.</span>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
          {platform.supportEmail && (
            <a href={`mailto:${platform.supportEmail}`} className="small">
              {platform.supportEmail}
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
