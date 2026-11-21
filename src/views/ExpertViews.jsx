import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Award,
  Check,
  Clock,
  Cpu,
  Download,
  Flag,
  Gauge,
  HandHeart,
  LineChart,
  Play,
  Scale,
  Send,
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import api from "../api/client.js";
import { act, useLive } from "../lib/live.js";
import { csvDownload, fmtDate } from "../lib/format.js";
import {
  Alert,
  Async,
  Badge,
  Button,
  Empty,
  Field,
  Modal,
  Slider,
  Stat,
  Tabs,
} from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";
import { AssignmentTable } from "./MentorViews.jsx";
import { FeedbackItem } from "../components/idea.jsx";
import { Bars, Donut, Legend, RadarMetrics, ScoreRing } from "../components/charts.jsx";
import {
  Spotlight,
  SpotlightCard,
  ShimmerButton,
  FlipWords,
  Meteors,
  TimelineSteps,
  BackgroundGradient,
  CardHoverEffect,
} from "../components/aceternity/index.js";

export default function ExpertViews({ page }) {
  const P = {
    queue: Queue,
    evaluate: Evaluate,
    scorecards: Scorecards,
    disputes: Disputes,
    reports: EvalReports,
    quality: Quality,
  }[page];
  return <P />;
}

const CRITERIA = [
  ["problem", "Problem clarity"],
  ["market", "Market opportunity"],
  ["innovation", "Innovation"],
  ["execution", "Execution plan"],
  ["scalability", "Scalability"],
  ["team", "Team strength"],
];
const overall = (c) =>
  Math.round(
    (CRITERIA.reduce((s, [k]) => s + (c?.[k] || 0), 0) / CRITERIA.length) * 10
  );

const FILTERS = {
  assigned: (a) => a.stage !== "archived",
  pending: (a) => ["assigned", "in_progress"].includes(a.stage) && !a.reEval,
  completed: (a) => a.stage === "completed",
  re: (a) => a.reEval,
};

const DILIGENCE_WORKFLOW = [
  { title: "Claim Submissions", desc: "Select unassigned startup pitches from open pool", tag: "Step 1" },
  { title: "Review Materials", desc: "Inspect problem statement, AI evaluation & deck signals", tag: "Step 2" },
  { title: "Score 6 Pillars", desc: "Rate problem, market, innovation, scale, and team", tag: "Step 3" },
  { title: "Publish Scorecard", desc: "Deliver high-conviction feedback & calibrate standard", tag: "Step 4" },
];

function Queue() {
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const f = FILTERS[sp.get("f")] ? sp.get("f") : "assigned";
  const q = useLive("/assignments", { params: { kind: "evaluation" } });
  const ideas = useLive("/ideas");
  const list = q.data || [];
  const rows = list.filter(FILTERS[f]);
  const pool = (ideas.data || []).filter(
    (i) =>
      ["submitted", "under_review"].includes(i.status) &&
      !i.assignments?.some((a) => a.kind === "evaluation")
  );

  const pendingItem = list.find((a) => ["assigned", "in_progress"].includes(a.stage));

  return (
    <>
      <div className="expert-hero-banner">
        <Spotlight className="expert-spotlight" fill="#f5a623" />
        <Meteors number={12} />
        <div className="expert-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" style={{ background: "#f5a623" }} />
                ACTIVE EVALUATION PIPELINE
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              Evaluation Tasks
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              Startup diligence queue &bull; <FlipWords words={["Assigned reviews", "Pending evaluations", "Disputed scorecards", "Open pool claims"]} duration={2800} />
            </p>
          </div>
          <div className="row wrap" style={{ gap: 10 }}>
            {pendingItem?.idea?._id && (
              <ShimmerButton variant="shimmer" size="md" to={`/app/evaluate?idea=${pendingItem.idea._id}`}>
                <Star size={15} style={{ marginRight: 6 }} /> Evaluate Next ({(pendingItem.idea.title || "Startup").slice(0, 18)})
              </ShimmerButton>
            )}
          </div>
        </div>
      </div>

      <div className="expert-diligence-timeline mb">
        <TimelineSteps steps={DILIGENCE_WORKFLOW} className="steps-4" />
      </div>

      <div className="mb">
        <Tabs
          value={f}
          onChange={(t) => setSp({ f: t })}
          tabs={[
            ["assigned", "Assigned"],
            ["pending", "Pending"],
            ["completed", "Completed"],
            ["re", "Re-evaluations"],
          ].map(([id, label]) => ({
            id,
            label,
            count: list.filter(FILTERS[id]).length,
          }))}
        />
      </div>

      <SpotlightCard className="card pad0" spotlightColor="rgba(245, 166, 35, 0.12)">
        <Async q={q}>
          {() => (
            <AssignmentTable
              rows={rows}
              actions={(a) => (
                <>
                  {a.stage === "assigned" && (
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Play}
                      onClick={() =>
                        act(
                          () => api.patch(`/assignments/${a._id}`, { stage: "in_progress" }),
                          "Started"
                        )
                      }
                    >
                      Start
                    </Button>
                  )}
                  {a.stage !== "completed" && a.stage !== "archived" && (
                    <ShimmerButton
                      size="sm"
                      variant="shimmer"
                      onClick={() => nav(`/app/evaluate?idea=${a.idea._id}`)}
                    >
                      <Star size={13} style={{ marginRight: 4 }} />
                      {a.reEval ? "Re-evaluate" : "Evaluate"}
                    </ShimmerButton>
                  )}
                </>
              )}
            />
          )}
        </Async>
      </SpotlightCard>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "34px 0 6px" }}>
        <div>
          <h2 style={{ fontSize: 20, margin: 0 }}>Open pool</h2>
          <p className="muted small" style={{ margin: "4px 0 0" }}>Submitted ideas waiting for an evaluator.</p>
        </div>
        <span className="badge" style={{ fontFamily: "var(--font-mono)" }}>
          {pool.length} available
        </span>
      </div>

      <SpotlightCard className="card pad0" spotlightColor="rgba(0, 112, 243, 0.12)">
        <DataTable
          rows={pool}
          pageSize={6}
          empty={<Empty icon={HandHeart} title="No ideas waiting for an evaluator" />}
          onRowClick={(i) => nav(`/app/ideas/${i._id}`)}
          columns={[
            {
              key: "title",
              label: "Idea",
              render: (i) => (
                <div>
                  <b>{i.title}</b>
                  <div className="tiny faint">
                    {i.industry} · {i.user?.name}
                  </div>
                </div>
              ),
            },
            {
              key: "s",
              label: "AI score",
              render: (i) => (
                <span className="mono" style={{ fontWeight: 600 }}>
                  {i.report?.score ?? "—"}
                </span>
              ),
            },
            {
              key: "d",
              label: "Submitted",
              render: (i) => fmtDate(i.createdAt),
            },
            {
              key: "a",
              label: "",
              sortable: false,
              render: (i) => (
                <div className="actions" onClick={(e) => e.stopPropagation()}>
                  <ShimmerButton
                    size="sm"
                    variant="shimmer"
                    onClick={() =>
                      act(
                        () => api.post(`/ideas/${i._id}/claim`),
                        "Added to your evaluation queue"
                      )
                    }
                  >
                    <HandHeart size={14} style={{ marginRight: 4 }} /> Claim
                  </ShimmerButton>
                </div>
              ),
            },
          ]}
        />
      </SpotlightCard>
    </>
  );
}

function Evaluate() {
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const mine = useLive("/assignments", { params: { kind: "evaluation" } });
  const open = (mine.data || []).filter((a) => !["completed", "archived"].includes(a.stage));
  const id = sp.get("idea") || open[0]?.idea?._id;
  useEffect(() => {
    if (!sp.get("idea") && open[0]?.idea?._id) setSp({ idea: open[0].idea._id }, { replace: true });
  }, [open.length]);

  useEffect(() => {
    setC({ problem: 5, market: 5, innovation: 5, execution: 5, scalability: 5, team: 5 });
    setRec("maybe");
    setComment("");
  }, [id]);

  const detail = useLive(`/ideas/${id}`, { skip: !id });
  const [c, setC] = useState({ problem: 5, market: 5, innovation: 5, execution: 5, scalability: 5, team: 5 });
  const [rec, setRec] = useState("maybe");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const score = overall(c);

  const submit = async () => {
    setBusy(true);
    const ok = await act(
      () =>
        api.post(`/ideas/${id}/feedback`, {
          kind: "evaluation",
          comment,
          criteria: c,
          recommendation: rec,
        }),
      "Evaluation submitted – the founder was notified"
    );
    setBusy(false);
    if (ok) {
      setComment("");
      nav("/app/evaluations?f=completed");
    }
  };

  const aiScore = detail.data?.report?.score;
  const delta = aiScore != null ? score - aiScore : null;

  return (
    <>
      <div className="expert-hero-banner" style={{ padding: "20px 24px", marginBottom: 20 }}>
        <Spotlight className="expert-spotlight" fill="#0070f3" />
        <div className="expert-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" style={{ background: "#50E3C2" }} />
                QUANTITATIVE SCORING TERMINAL
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, margin: 0 }}>
              Idea Evaluation
            </h1>
            <p className="muted small" style={{ marginTop: 4, marginBottom: 0 }}>
              Score the startup across 6 dimensions &bull;{" "}
              <FlipWords
                words={[
                  "Problem clarity",
                  "Market opportunity",
                  "Innovation depth",
                  "Execution feasibility",
                  "Scalability potential",
                  "Team strength",
                ]}
                duration={2400}
              />
            </p>
          </div>
          {aiScore != null && (
            <div className="expert-badge-gold">
              <Cpu size={14} /> AI Baseline: {aiScore}/100
            </div>
          )}
        </div>
      </div>

      <Async q={mine}>
        {() =>
          !id ? (
            <Empty icon={Award} title="Nothing to evaluate">
              Claim an idea from <Link to="/app/evaluations">Evaluation tasks</Link>.
            </Empty>
          ) : (
            <div className="grid g-main">
              <SpotlightCard className="card" spotlightColor="rgba(0, 112, 243, 0.12)">
                <Field label="Selected Idea">
                  <select
                    className="input"
                    value={id}
                    onChange={(e) => setSp({ idea: e.target.value })}
                  >
                    {open.map((a) => (
                      <option key={a._id} value={a.idea?._id || a._id}>
                        {a.idea?.title || "Untitled Startup"}
                        {a.reEval ? " (re-evaluation)" : ""}
                      </option>
                    ))}
                    {!open.some((a) => (a.idea?._id || a._id) === id) && (
                      <option value={id}>{detail.data?.title || "Selected Idea"}</option>
                    )}
                  </select>
                </Field>

                <div className="expert-rubric-grid mt">
                  {CRITERIA.map(([k, l]) => (
                    <div key={k} className="expert-slider-row">
                      <div className="slider-head">
                        <span className="slider-title">{l}</span>
                        <span className="slider-badge">
                          {c[k]}
                          <span className="faint small">/10</span>
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={10}
                        value={c[k]}
                        onChange={(v) => setC({ ...c, [k]: v })}
                      />
                    </div>
                  ))}
                </div>

                <Field label="Recommendation" className="mt">
                  <div className="row wrap" style={{ gap: 8 }}>
                    {[
                      ["strong_yes", "Strong yes", "success"],
                      ["yes", "Yes", "success"],
                      ["maybe", "Maybe", "warning"],
                      ["no", "No", "danger"],
                    ].map(([v, l, k]) => (
                      <button
                        key={v}
                        type="button"
                        className={`chip chip-btn ${rec === v ? "on" : ""}`}
                        onClick={() => setRec(v)}
                      >
                        <Badge kind={k}>{l}</Badge>
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Evaluation comments & qualitative rationale" className="mt">
                  <textarea
                    className="input"
                    style={{ minHeight: 140 }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Justify your scores — especially extremes. Provide constructive, high-conviction advice."
                  />
                </Field>

                <div className="mt" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <ShimmerButton
                    variant="shimmer"
                    size="md"
                    loading={busy}
                    disabled={busy || !comment.trim()}
                    onClick={submit}
                  >
                    <Send size={15} style={{ marginRight: 6 }} />
                    {busy ? "Submitting evaluation…" : "Submit Evaluation & Notify Founder"}
                  </ShimmerButton>
                  {!comment.trim() && (
                    <span className="tiny faint">Please add comments before submitting.</span>
                  )}
                </div>
              </SpotlightCard>

              <div className="col" style={{ position: "sticky", top: 90, alignSelf: "start" }}>
                <BackgroundGradient
                  className="card center glow-border"
                  glowColor={
                    score >= 75
                      ? "linear-gradient(135deg, rgba(80, 227, 194, 0.45) 0%, rgba(0, 112, 243, 0.35) 100%)"
                      : score >= 50
                      ? "linear-gradient(135deg, rgba(245, 166, 35, 0.45) 0%, rgba(249, 115, 22, 0.35) 100%)"
                      : "linear-gradient(135deg, rgba(255, 77, 77, 0.45) 0%, rgba(236, 72, 153, 0.35) 100%)"
                  }
                >
                  <div className="expert-score-container">
                    <ScoreRing score={score} size={150} label="YOUR SCORE" />
                    <div style={{ marginTop: 12 }}>
                      <span
                        className="badge"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          padding: "4px 10px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {score >= 75
                          ? "✓ STRONG CONVICTION"
                          : score >= 50
                          ? "◐ VIABLE WITH ITERATION"
                          : "✕ HIGH RISK / REWORK"}
                      </span>
                    </div>
                  </div>

                  {aiScore != null && (
                    <div
                      className="mt"
                      style={{
                        paddingTop: 12,
                        borderTop: "1px solid var(--border)",
                        width: "100%",
                      }}
                    >
                      <div className="row between small">
                        <span className="muted">AI Baseline</span>
                        <b className="mono">{aiScore}</b>
                      </div>
                      <div className="row between small mt-s">
                        <span className="muted">Expert Variance</span>
                        <span
                          className={`expert-score-delta-badge ${
                            delta > 0 ? "positive" : delta < 0 ? "negative" : "neutral"
                          }`}
                        >
                          {delta > 0 ? `+${delta} pts` : delta < 0 ? `${delta} pts` : "Equal"}
                        </span>
                      </div>
                    </div>
                  )}
                </BackgroundGradient>

                <SpotlightCard
                  className="card"
                  spotlightColor="rgba(245, 166, 35, 0.14)"
                >
                  <div className="card-title">
                    <Target size={17} color="var(--primary)" />
                    {detail.data?.title || "Idea Overview"}
                    {detail.data?.industry && (
                      <span className="sub">{detail.data.industry}</span>
                    )}
                  </div>
                  <p
                    className="small muted pre"
                    style={{ maxHeight: 180, overflowY: "auto", margin: "6px 0 12px" }}
                  >
                    {detail.data?.description || "Loading idea details…"}
                  </p>
                  {detail.data && (
                    <Link
                      to={`/app/ideas/${id}`}
                      className="small"
                      style={{ fontWeight: 600, color: "var(--primary)" }}
                    >
                      Open full idea deck &rarr;
                    </Link>
                  )}
                </SpotlightCard>
              </div>
            </div>
          )
        }
      </Async>
    </>
  );
}

function useMyEvals() {
  const q = useLive("/feedback", { params: { kind: "evaluation" } });
  return { q, rows: q.data || [] };
}

function Scorecards() {
  const { q, rows } = useMyEvals();
  const avg = useMemo(
    () =>
      Object.fromEntries(
        CRITERIA.map(([k]) => [
          k,
          rows.length
            ? Math.round(
                (rows.reduce((s, r) => s + (r.criteria?.[k] || 0), 0) / rows.length) * 10
              )
            : 0,
        ])
      ),
    [rows]
  );

  const avgOverall = rows.length
    ? Math.round(rows.reduce((s, r) => s + (r.score || 0), 0) / rows.length)
    : 0;

  return (
    <>
      <div className="expert-hero-banner" style={{ padding: "22px 26px" }}>
        <Spotlight className="expert-spotlight" fill="#a855f7" />
        <div className="expert-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" style={{ background: "#a855f7" }} />
                HISTORICAL SCORECARD REGISTRY
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, margin: 0 }}>
              Scorecards & Diligence Profile
            </h1>
            <p className="muted small" style={{ marginTop: 4, marginBottom: 0 }}>
              Every submitted evaluation compared against AI baseline &bull;{" "}
              <FlipWords
                words={[
                  "6-Axis Radar Metrics",
                  "AI Baseline Variance",
                  "Founder Guidance History",
                  "Calibration Profile",
                ]}
                duration={2700}
              />
            </p>
          </div>
          <div className="row wrap" style={{ gap: 10 }}>
            <span className="badge" style={{ fontSize: 13, padding: "6px 12px" }}>
              {rows.length} Scorecards Published
            </span>
          </div>
        </div>
      </div>

      <Async q={q}>
        {() =>
          !rows.length ? (
            <Empty icon={Gauge} title="No scorecards yet" />
          ) : (
            <div className="col gap-l">
              <div className="grid g-main">
                <SpotlightCard className="card" spotlightColor="rgba(168, 85, 247, 0.18)">
                  <div className="card-title">
                    <Gauge size={18} color="var(--primary)" />
                    Your average scoring profile
                  </div>
                  <RadarMetrics
                    height={260}
                    series={[
                      {
                        name: "Average (x/100)",
                        metrics: {
                          marketDemand: avg.market,
                          competition: avg.innovation,
                          feasibility: avg.execution,
                          financial: avg.scalability,
                          risk: avg.team,
                        },
                        color: "var(--accent)",
                      },
                    ]}
                  />
                  <p className="tiny faint center" style={{ marginTop: 8 }}>
                    Axes mapped: Market, Innovation, Execution, Scalability, Team
                  </p>
                </SpotlightCard>

                <SpotlightCard className="card" spotlightColor="rgba(0, 112, 243, 0.18)">
                  <div className="card-title">
                    <Sparkles size={18} color="var(--primary)" />
                    Scoring calibration pillars
                  </div>
                  <div className="col" style={{ gap: 10, marginTop: 10 }}>
                    {CRITERIA.map(([k, l]) => (
                      <div key={k} className="row between small" style={{ padding: "8px 12px", background: "var(--surface-2)", borderRadius: "var(--radius-sm)" }}>
                        <span>{l}</span>
                        <b className="mono">{avg[k]} / 100</b>
                      </div>
                    ))}
                    <div className="row between small" style={{ padding: "10px 12px", background: "rgba(0, 112, 243, 0.10)", borderRadius: "var(--radius-sm)", marginTop: 4 }}>
                      <b>Overall Expert Average</b>
                      <b className="mono" style={{ fontSize: 16, color: "var(--primary)" }}>{avgOverall} / 100</b>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              <div className="col" style={{ gap: 14 }}>
                <h3 style={{ fontSize: 18, margin: "14px 0 4px" }}>Submitted Evaluations</h3>
                {rows.map((f) => (
                  <SpotlightCard
                    key={f._id}
                    className="card"
                    spotlightColor="rgba(0, 112, 243, 0.12)"
                  >
                    <div className="row between mb">
                      <Link to={`/app/ideas/${f.idea?._id || f.idea || ""}`}>
                        <b style={{ fontSize: 16 }}>{f.idea?.title || "Untitled Startup"}</b>
                      </Link>
                      {f.score != null && f.idea?.report?.score != null && (
                        <span className="small muted">
                          AI {f.idea.report.score} &rarr; Expert{" "}
                          <b style={{ color: "var(--text)" }}>{f.score}</b>{" "}
                          <span
                            className={`expert-score-delta-badge ${
                              f.score - f.idea.report.score > 0
                                ? "positive"
                                : f.score - f.idea.report.score < 0
                                ? "negative"
                                : "neutral"
                            }`}
                          >
                            {f.score - f.idea.report.score >= 0 ? "+" : ""}
                            {f.score - f.idea.report.score} pts
                          </span>
                        </span>
                      )}
                    </div>
                    <FeedbackItem fb={f} />
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )
        }
      </Async>
    </>
  );
}

function Disputes() {
  const q = useLive("/feedback", { params: { disputed: "true" } });
  const [tab, setTab] = useState("open");
  const [r, setR] = useState(null);
  const list = q.data || [];
  const rows = list.filter((f) => f.dispute?.status === tab);

  return (
    <>
      <div className="expert-hero-banner" style={{ padding: "22px 26px" }}>
        <Spotlight className="expert-spotlight" fill="#f5a623" />
        <div className="expert-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" style={{ background: "#f5a623" }} />
                CALIBRATION & DISPUTE RESOLUTION
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, margin: 0 }}>
              Calibration & Disputes
            </h1>
            <p className="muted small" style={{ marginTop: 4, marginBottom: 0 }}>
              Founders can dispute a scorecard &bull;{" "}
              <FlipWords
                words={[
                  "Review founder arguments",
                  "Re-score criteria if justified",
                  "Uphold objective standards",
                  "Close calibration loop",
                ]}
                duration={2800}
              />
            </p>
          </div>
        </div>
      </div>

      <div className="mb">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={["open", "resolved"].map((id) => ({
            id,
            label: id === "open" ? "Open" : "Resolved",
            count: list.filter((f) => f.dispute?.status === id).length,
          }))}
        />
      </div>

      <Async q={q}>
        {() =>
          !rows.length ? (
            <Empty
              icon={Scale}
              title={tab === "open" ? "No open disputes 🎉" : "No resolved disputes yet"}
            />
          ) : (
            <div className="col" style={{ gap: 14 }}>
              {rows.map((f) => (
                <SpotlightCard
                  key={f._id}
                  className="card"
                  spotlightColor={
                    f.dispute?.status === "open"
                      ? "rgba(245, 166, 35, 0.18)"
                      : "rgba(34, 197, 94, 0.18)"
                  }
                >
                  <div className="row between mb">
                    <Link to={`/app/ideas/${f.idea?._id || f.idea || ""}`}>
                      <b>{f.idea?.title || "Untitled Startup"}</b>
                    </Link>
                    <Badge kind={f.dispute?.status === "open" ? "warning" : "success"}>
                      {f.dispute?.status}
                    </Badge>
                  </div>
                  <FeedbackItem
                    fb={f}
                    actions={
                      f.dispute?.status === "open" && (
                        <ShimmerButton
                          size="sm"
                          variant="shimmer"
                          onClick={() =>
                            setR({ f, response: "", criteria: { ...f.criteria } })
                          }
                        >
                          Respond & Resolve
                        </ShimmerButton>
                      )
                    }
                  />
                </SpotlightCard>
              ))}
            </div>
          )
        }
      </Async>

      <Modal
        open={Boolean(r)}
        onClose={() => setR(null)}
        width={620}
        title="Respond to dispute"
        footer={
          <>
            <Button variant="outline" onClick={() => setR(null)}>
              Cancel
            </Button>
            <ShimmerButton
              variant="shimmer"
              size="md"
              disabled={!r?.response.trim()}
              onClick={async () => {
                const ok = await act(
                  () =>
                    api.post(`/feedback/${r.f._id}/dispute/resolve`, {
                      response: r.response,
                      criteria: r.criteria,
                    }),
                  "Dispute resolved – the founder was notified"
                );
                if (ok) setR(null);
              }}
            >
              Resolve & Notify Founder
            </ShimmerButton>
          </>
        }
      >
        {r && (
          <>
            <Alert kind="warning">
              <b>Founder's reason:</b> {r.f.dispute?.reason}
            </Alert>
            <p className="label mt">
              Revise scores (optional) — new overall:{" "}
              <b style={{ color: "var(--text)" }}>{overall(r.criteria)}</b>
            </p>
            <div className="col mt-s">
              {CRITERIA.map(([k, l]) => (
                <div
                  key={k}
                  className="crit"
                  style={{ gridTemplateColumns: "130px 1fr 30px" }}
                >
                  <span className="muted">{l}</span>
                  <Slider
                    min={0}
                    max={10}
                    value={r.criteria?.[k] || 0}
                    onChange={(v) =>
                      setR({ ...r, criteria: { ...(r.criteria || {}), [k]: v } })
                    }
                  />
                  <b className="mono">{r.criteria?.[k] ?? 0}</b>
                </div>
              ))}
            </div>
            <Field label="Your response" className="mt">
              <textarea
                className="input"
                value={r.response}
                onChange={(e) => setR({ ...r, response: e.target.value })}
                placeholder="Explain your reasoning or what changed…"
              />
            </Field>
          </>
        )}
      </Modal>
    </>
  );
}

function EvalReports() {
  const { q, rows } = useMyEvals();
  const asg = useLive("/assignments", { params: { kind: "evaluation" } });
  const recs = ["strong_yes", "yes", "maybe", "no"].map((k, i) => ({
    name: k.replace("_", " "),
    value: rows.filter((r) => r.recommendation === k).length,
    color: ["var(--success)", "var(--info)", "var(--warning)", "var(--danger)"][i],
  }));
  const avg = rows.length
    ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length)
    : 0;

  return (
    <>
      <div className="expert-hero-banner">
        <Spotlight className="expert-spotlight" fill="#0070f3" />
        <Meteors number={14} />
        <div className="expert-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" style={{ background: "#0070f3" }} />
                EVALUATION TRACK RECORD
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
              Evaluation Reports
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              Quantitative track record &bull;{" "}
              <FlipWords
                words={[
                  "Conviction breakdown",
                  "Expert vs AI variance",
                  "Turnaround metrics",
                  "Dispute resolution rate",
                ]}
                duration={2800}
              />
            </p>
          </div>
          <ShimmerButton
            variant="shimmer"
            size="md"
            onClick={() =>
              csvDownload(
                "my-evaluations.csv",
                rows.map((r) => ({
                  idea: r.idea?.title || "Untitled Startup",
                  score: r.score,
                  ai: r.idea?.report?.score ?? "",
                  recommendation: r.recommendation,
                  date: r.createdAt,
                }))
              )
            }
          >
            <Download size={15} style={{ marginRight: 6 }} /> Export CSV
          </ShimmerButton>
        </div>
      </div>

      <Async q={q}>
        {() => (
          <div className="col gap-l stagger">
            <div className="grid g4">
              <Stat
                icon={Award}
                label="Evaluations done"
                value={rows.length}
                tone="purple"
                spotlightColor="rgba(168, 85, 247, 0.20)"
              />
              <Stat
                icon={Star}
                label="Average score given"
                value={avg}
                tone="cyan"
                spotlightColor="rgba(80, 227, 194, 0.20)"
              />
              <Stat
                icon={Check}
                label="Completed tasks"
                value={(asg.data || []).filter((a) => a.stage === "completed").length}
                tone="green"
                spotlightColor="rgba(34, 197, 94, 0.20)"
              />
              <Stat
                icon={Scale}
                label="Open disputes"
                value={rows.filter((r) => r.dispute?.status === "open").length}
                tone="orange"
                spotlightColor="rgba(245, 166, 35, 0.20)"
              />
            </div>

            {!rows.length ? (
              <Empty icon={Award} title="No evaluations completed yet">
                Submit startup evaluations from your queue to populate analytics and conviction breakdowns.
              </Empty>
            ) : (
              <div className="grid g2">
                <SpotlightCard className="card" spotlightColor="rgba(80, 227, 194, 0.16)">
                  <div className="card-title">
                    <Target size={18} color="var(--primary)" />
                    Recommendations distribution
                  </div>
                  <Donut data={recs} />
                  <Legend items={recs} />
                </SpotlightCard>

                <SpotlightCard className="card" spotlightColor="rgba(0, 112, 243, 0.16)">
                  <div className="card-title">
                    <Cpu size={18} color="var(--primary)" />
                    Scores given vs AI baseline
                  </div>
                  <Bars
                    data={rows.map((r) => ({
                      name: (r.idea?.title || "Untitled").slice(0, 14),
                      Expert: r.score ?? 0,
                      AI: r.idea?.report?.score || 0,
                    }))}
                    bars={[
                      { key: "Expert", name: "Expert", color: "var(--primary)" },
                      { key: "AI", name: "AI", color: "var(--accent)" },
                    ]}
                    max={100}
                  />
                </SpotlightCard>
              </div>
            )}
          </div>
        )}
      </Async>
    </>
  );
}

function Quality() {
  const { q, rows } = useMyEvals();
  const asg = useLive("/assignments", { params: { kind: "evaluation" } });
  const withAi = rows.filter((r) => r.idea?.report?.score != null);
  const deltas = withAi.map((r) => (r.score ?? 0) - r.idea.report.score);
  const bias = deltas.length
    ? Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length)
    : 0;
  const mad = deltas.length
    ? Math.round(deltas.reduce((a, b) => a + Math.abs(b), 0) / deltas.length)
    : 0;
  const done = (asg.data || []).filter((a) => a.completedAt);
  const turn = done.length
    ? (
        done.reduce(
          (s, a) => s + (new Date(a.completedAt) - new Date(a.createdAt)),
          0
        ) /
        done.length /
        86400000
      ).toFixed(1)
    : "—";
  const disputeRate = rows.length
    ? Math.round(
        (rows.filter((r) => r.dispute?.status && r.dispute.status !== "none").length /
          rows.length) *
          100
      )
    : 0;

  return (
    <>
      <div className="expert-hero-banner" style={{ padding: "22px 26px" }}>
        <Spotlight className="expert-spotlight" fill="#50e3c2" />
        <div className="expert-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" style={{ background: "#50E3C2" }} />
                CALIBRATION & QUALITY BENCHMARK
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, margin: 0 }}>
              Quality Insights
            </h1>
            <p className="muted small" style={{ marginTop: 4, marginBottom: 0 }}>
              Calibrated accuracy & turnaround metrics vs AI baseline &bull;{" "}
              <FlipWords
                words={[
                  "Algorithmic harmony",
                  "Objective deviation",
                  "Review velocity",
                  "Dispute mitigation",
                ]}
                duration={2700}
              />
            </p>
          </div>
        </div>
      </div>

      <Async q={q}>
        {() => (
          <div className="col gap-l stagger">
            <div className="grid g4">
              <Stat
                icon={Scale}
                label="Bias vs AI"
                value={bias}
                suffix=" pts"
                tone={Math.abs(bias) > 10 ? "orange" : "green"}
                spotlightColor={
                  Math.abs(bias) > 10
                    ? "rgba(245, 166, 35, 0.20)"
                    : "rgba(34, 197, 94, 0.20)"
                }
                sub={
                  bias > 0
                    ? "You score higher than AI"
                    : bias < 0
                    ? "You score lower than AI"
                    : "Perfect alignment"
                }
              />
              <Stat
                icon={Gauge}
                label="Avg. deviation"
                value={mad}
                suffix=" pts"
                tone="cyan"
                spotlightColor="rgba(80, 227, 194, 0.20)"
              />
              <Stat
                icon={Check}
                label="Avg. turnaround"
                value={turn}
                suffix={turn === "—" ? "" : " days"}
                tone="purple"
                spotlightColor="rgba(168, 85, 247, 0.20)"
              />
              <Stat
                icon={Flag}
                label="Dispute rate"
                value={disputeRate}
                suffix="%"
                tone="pink"
                spotlightColor="rgba(236, 72, 153, 0.20)"
              />
            </div>

            <SpotlightCard className="card" spotlightColor="rgba(0, 112, 243, 0.16)">
              <div className="card-title">
                <LineChart size={18} color="var(--primary)" />
                Calibration: expert minus AI score per idea
              </div>
              {withAi.length ? (
                <Bars
                  data={withAi.map((r) => ({
                    name: (r.idea?.title || "Untitled").slice(0, 14),
                    Delta: (r.score ?? 0) - r.idea.report.score,
                  }))}
                  bars={[{ key: "Delta", name: "Expert − AI", color: "var(--primary)" }]}
                />
              ) : (
                <p className="muted">Submit evaluations to see calibration.</p>
              )}
            </SpotlightCard>

            <CardHoverEffect
              items={[
                {
                  title: "Target Tolerance",
                  badge: "±10 Pts",
                  description:
                    "Keeping bias within ±10 points ensures consistent standards between human and AI scoring.",
                  icon: Target,
                },
                {
                  title: "Actionable Rationale",
                  badge: "Required",
                  description:
                    "Extreme scores (≥8 or ≤3) must be justified with concrete, market-grounded feedback.",
                  icon: Sparkles,
                },
                {
                  title: "SLA Velocity",
                  badge: "< 3 Days",
                  description:
                    "Maintaining turnaround within 72 hours keeps incubation velocity high for founders.",
                  icon: Clock,
                },
              ]}
            />
          </div>
        )}
      </Async>
    </>
  );
}
