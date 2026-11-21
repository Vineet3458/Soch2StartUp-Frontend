import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Ban,
  CheckCircle2,
  Clock,
  Eye,
  Flag,
  MessageSquareWarning,
  Scale,
  ShieldAlert,
  Trash2,
  UserX,
  X,
} from "lucide-react";
import api from "../api/client.js";
import { useConfig } from "../context/ConfigContext.jsx";
import { act, useLive } from "../lib/live.js";
import { ago } from "../lib/format.js";
import {
  Async,
  Avatar,
  Badge,
  Button,
  Empty,
  Field,
  Modal,
  SearchBox,
  StatusBadge,
  Tabs,
  VerdictBadge,
} from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";
import { ReportModal } from "../components/idea.jsx";
import {
  FlipWords,
  Meteors,
  ShimmerButton,
  Spotlight,
  SpotlightCard,
  TimelineSteps,
} from "../components/aceternity/index.js";

const META = {
  idea: [
    "Flagged ideas",
    "Startup ideas reported by the community for policy violations.",
    ShieldAlert,
    [
      ["remove", "Remove idea", "danger", Trash2],
      ["changes", "Request changes", "warning", Flag],
    ],
  ],
  feedback: [
    "Reported feedback",
    "Mentor, expert, and platform feedback reports requiring review.",
    MessageSquareWarning,
    [["remove", "Remove feedback", "danger", Trash2]],
  ],
  user: [
    "User reports",
    "Accounts reported for harassment, spam, impersonation, or abuse.",
    UserX,
    [
      ["warn", "Warn user", "warning", Flag],
      ["block", "Block user", "danger", Ban],
    ],
  ],
};

const QUEUE_THEMES = {
  idea: {
    spotlight: "rgba(244, 63, 94, 0.24)",
    meteor: "#f43f5e",
    color: "danger",
    flipClass: "flip-rose",
    words: [
      "Plagiarism & fake claims check",
      "Prohibited business model audit",
      "Regulatory & legal compliance",
      "Intellectual property protection",
    ],
    tag: "IDEA COMPLIANCE",
  },
  feedback: {
    spotlight: "rgba(168, 85, 247, 0.24)",
    meteor: "#a855f7",
    color: "purple",
    flipClass: "flip-purple",
    words: [
      "Evaluate mentorship objectivity",
      "Sanction abusive language",
      "Preserve professional discourse",
      "Mediate founder disputes",
    ],
    tag: "FEEDBACK STANDARDS",
  },
  user: {
    spotlight: "rgba(245, 158, 11, 0.24)",
    meteor: "#f59e0b",
    color: "amber",
    flipClass: "flip-amber",
    words: [
      "Investigate harassment reports",
      "Detect coordinated spam bots",
      "Enforce community safety rules",
      "Protect early-stage founders",
    ],
    tag: "USER SAFETY",
  },
};

const WORKFLOW_STEPS = [
  {
    title: "Triage & Evidence",
    desc: "Inspect reported target, reason, timestamp, and contextual details.",
    tag: "Step 1",
    icon: <ShieldAlert size={16} color="var(--danger)" />,
  },
  {
    title: "Policy Verification",
    desc: "Cross-reference community guidelines, safety rules, and terms of service.",
    tag: "Step 2",
    icon: <Scale size={16} color="var(--accent)" />,
  },
  {
    title: "Sanction or Dismiss",
    desc: "Enforce removal, warning, block, or dismiss with a documented rationale.",
    tag: "Step 3",
    icon: <CheckCircle2 size={16} color="var(--success)" />,
  },
];

export default function ModerationViews({ page }) {
  return page === "audits" ? <Audits /> : <Queue type={page} />;
}

function Queue({ type }) {
  const cfg = useConfig();
  const [tab, setTab] = useState("open");
  const [search, setSearch] = useState("");
  const [act_, setAct] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const q = useLive("/reports", { params: { targetType: type } });
  const [title, sub, Icon, actions] = META[type] || META.idea;
  const theme = QUEUE_THEMES[type] || QUEUE_THEMES.idea;

  const list = q.data || [];
  const openCount = list.filter((r) => r.status === "open").length;
  const resolvedCount = list.filter((r) => r.status === "resolved").length;
  const dismissedCount = list.filter((r) => r.status === "dismissed").length;

  const rows = useMemo(() => {
    let res = list.filter((r) => r.status === tab);
    if (search.trim()) {
      const query = search.toLowerCase();
      res = res.filter((r) => {
        const titleStr = r.targetInfo?.title || "";
        const nameStr = r.targetInfo?.name || r.targetInfo?.authorName || "";
        const reporterStr = r.reporter?.name || "";
        const reasonStr = r.reason || "";
        const detailsStr = r.details || "";
        const commentStr = r.targetInfo?.comment || "";
        return `${titleStr} ${nameStr} ${reporterStr} ${reasonStr} ${detailsStr} ${commentStr}`
          .toLowerCase()
          .includes(query);
      });
    }
    return res;
  }, [list, tab, search]);

  const run = async () => {
    if (!act_ || loading) return;
    setLoading(true);
    try {
      const ok = await act(
        () => api.post(`/reports/${act_.r._id}/resolve`, { action: act_.action, note }),
        act_.action === "dismiss"
          ? "Report dismissed"
          : "Action taken – everyone involved was notified"
      );
      if (ok) {
        setAct(null);
        setNote("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Aceternity Hero Banner for Moderation Queue ── */}
      <div className="moderator-queue-banner">
        <Spotlight className="queue-spotlight" fill={theme.spotlight} />
        <Meteors number={10} color={theme.meteor} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="row between wrap gap-s" style={{ marginBottom: 12 }}>
            <div className="row wrap gap-s">
              <span className="live-pulse-badge">
                <i className={`live-pulse-dot pulse-${theme.color}`} />
                {theme.tag} &bull; {openCount} OPEN TICKET{openCount === 1 ? "" : "S"}
              </span>
              <span className="bento-badge">{tab.toUpperCase()} VIEW</span>
            </div>
            <div className="row wrap gap-s">
              <Button
                size="sm"
                variant="ghost"
                icon={Scale}
                onClick={() => setShowWorkflow((v) => !v)}
              >
                {showWorkflow ? "Hide workflow" : "Moderation guide"}
              </Button>
              <ShimmerButton to="/app/mod-audits" size="sm" variant="outline">
                <Eye size={13} style={{ marginRight: 6 }} /> Content Audits
              </ShimmerButton>
            </div>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>
          <p className="muted small" style={{ marginTop: 6, marginBottom: 14 }}>
            {sub} &bull;{" "}
            <FlipWords
              words={theme.words}
              duration={2600}
              wordClassName={theme.flipClass}
            />
          </p>

          <div className="row wrap" style={{ gap: 8 }}>
            <ShimmerButton
              to="/app/mod-ideas"
              size="sm"
              variant={type === "idea" ? "shimmer" : "outline"}
            >
              <ShieldAlert size={13} style={{ marginRight: 5 }} /> Flagged Ideas
            </ShimmerButton>
            <ShimmerButton
              to="/app/mod-feedback"
              size="sm"
              variant={type === "feedback" ? "shimmer" : "outline"}
            >
              <MessageSquareWarning size={13} style={{ marginRight: 5 }} /> Reported Feedback
            </ShimmerButton>
            <ShimmerButton
              to="/app/mod-users"
              size="sm"
              variant={type === "user" ? "shimmer" : "outline"}
            >
              <UserX size={13} style={{ marginRight: 5 }} /> User Reports
            </ShimmerButton>
          </div>
        </div>
      </div>

      {/* ── Workflow Guide (Aceternity TimelineSteps) ── */}
      {showWorkflow && (
        <div className="moderator-timeline-section">
          <TimelineSteps steps={WORKFLOW_STEPS} />
        </div>
      )}

      {/* ── Telemetry Quick-Filter Stat Cards ── */}
      <div className="grid g4 mb">
        <SpotlightCard
          className="moderator-stat-mini card"
          spotlightColor="rgba(239, 68, 68, 0.18)"
          style={{ cursor: "pointer" }}
          onClick={() => setTab("open")}
        >
          <div>
            <div className="lbl">Open Reports</div>
            <div className="val">{openCount}</div>
          </div>
          <Badge kind={openCount ? "danger" : "success"}>
            {openCount ? "Requires review" : "Clear"}
          </Badge>
        </SpotlightCard>

        <SpotlightCard
          className="moderator-stat-mini card"
          spotlightColor="rgba(34, 197, 94, 0.18)"
          style={{ cursor: "pointer" }}
          onClick={() => setTab("resolved")}
        >
          <div>
            <div className="lbl">Resolved</div>
            <div className="val">{resolvedCount}</div>
          </div>
          <Badge kind="success">Enforced</Badge>
        </SpotlightCard>

        <SpotlightCard
          className="moderator-stat-mini card"
          spotlightColor="rgba(100, 116, 139, 0.16)"
          style={{ cursor: "pointer" }}
          onClick={() => setTab("dismissed")}
        >
          <div>
            <div className="lbl">Dismissed</div>
            <div className="val">{dismissedCount}</div>
          </div>
          <Badge kind="draft">No violation</Badge>
        </SpotlightCard>

        <SpotlightCard
          className="moderator-stat-mini card"
          spotlightColor="rgba(0, 112, 243, 0.16)"
        >
          <div>
            <div className="lbl">Total Logged</div>
            <div className="val">{list.length}</div>
          </div>
          <Badge kind="primary">Audited</Badge>
        </SpotlightCard>
      </div>

      {/* ── Toolbar: Tabs & Search ── */}
      <div className="row between wrap gap-s mb">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "open", label: "Open", count: openCount },
            { id: "resolved", label: "Resolved", count: resolvedCount },
            { id: "dismissed", label: "Dismissed", count: dismissedCount },
          ]}
        />
        <div style={{ minWidth: 260 }}>
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder={`Search ${type} reports…`}
          />
        </div>
      </div>

      {/* ── Report Cards List ── */}
      <Async q={q}>
        {() =>
          !rows.length ? (
            <Empty
              icon={Icon}
              title={
                search
                  ? "No matching reports"
                  : tab === "open"
                  ? "Queue is clear 🎉"
                  : "Nothing here"
              }
            >
              {search
                ? `No reports found matching "${search}".`
                : tab === "open"
                ? "No open reports in this category. All community submissions are compliant."
                : "No reports found under this status."}
            </Empty>
          ) : (
            <div className="grid g2 stagger">
              {rows.map((r) => {
                const isOp = r.status === "open";
                const isRes = r.status === "resolved";
                const spotlightColor = isOp
                  ? "rgba(239, 68, 68, 0.20)"
                  : isRes
                  ? "rgba(34, 197, 94, 0.18)"
                  : "rgba(100, 116, 139, 0.14)";

                return (
                  <SpotlightCard
                    key={r._id}
                    spotlightColor={spotlightColor}
                    className={`moderator-report-card card hover is-${r.status}`}
                  >
                    <div>
                      <div className="row between">
                        <div className="row wrap gap-s">
                          <Badge kind="danger">
                            <Flag size={12} /> {r.reason}
                          </Badge>
                          <StatusBadge value={r.status} />
                        </div>
                        <span className="tiny faint">
                          <Clock size={11} style={{ marginRight: 3, verticalAlign: -1 }} />
                          {ago(r.createdAt)}
                        </span>
                      </div>

                      <div className="callout mt-s">
                        {type === "idea" &&
                          (r.targetInfo ? (
                            <>
                              <div className="row between wrap gap-s">
                                <Link to={`/app/ideas/${r.target}`}>
                                  <b>{r.targetInfo.title}</b>
                                </Link>
                                {r.targetInfo.report && (
                                  <span className="tiny faint" style={{ fontFamily: "var(--font-mono)" }}>
                                    AI score: <b>{r.targetInfo.report.score}</b>
                                  </span>
                                )}
                              </div>
                              <div className="small muted">
                                {r.targetInfo.industry} &bull; by {r.targetInfo.user?.name} &bull;{" "}
                                <StatusBadge value={r.targetInfo.status} />
                              </div>
                            </>
                          ) : (
                            <i className="muted">Idea no longer exists</i>
                          ))}

                        {type === "feedback" &&
                          (r.targetInfo ? (
                            <>
                              <div className="small muted mb">
                                {r.targetInfo.authorName} ({r.targetInfo.kind})
                              </div>
                              <p className="pre small">“{r.targetInfo.comment}”</p>
                              {r.idea && (
                                <Link className="small" to={`/app/ideas/${r.idea._id}`}>
                                  On idea: <b>{r.idea.title}</b>
                                </Link>
                              )}
                            </>
                          ) : (
                            <i className="muted">Feedback no longer exists</i>
                          ))}

                        {type === "user" &&
                          (r.targetInfo ? (
                            <div className="row">
                              <Avatar name={r.targetInfo.name} size={36} />
                              <div>
                                <b>{r.targetInfo.name}</b>
                                <div className="tiny faint">{r.targetInfo.email}</div>
                              </div>
                              {!r.targetInfo.isActive && <Badge kind="blocked">blocked</Badge>}
                            </div>
                          ) : (
                            <i className="muted">User no longer exists</i>
                          ))}
                      </div>

                      {r.details && (
                        <p className="small muted mt-s" style={{ fontStyle: "italic" }}>
                          “{r.details}”
                        </p>
                      )}
                      <div className="tiny faint mt-s">
                        Reported by <b>{r.reporter?.name || "Community member"}</b>
                      </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                      {r.status === "open" ? (
                        <div className="row wrap gap-s">
                          {actions
                            .filter(([a]) => a !== "block" || cfg.can("users.manage"))
                            .map(([a, l, k, I]) => (
                              <ShimmerButton
                                key={a}
                                size="sm"
                                variant={k === "danger" ? "danger" : "outline"}
                                onClick={() => {
                                  setNote("");
                                  setAct({ r, action: a, label: l });
                                }}
                              >
                                <I size={13} style={{ marginRight: 6 }} />
                                {l}
                              </ShimmerButton>
                            ))}
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={X}
                            onClick={() => {
                              setNote("");
                              setAct({ r, action: "dismiss", label: "Dismiss" });
                            }}
                          >
                            Dismiss
                          </Button>
                        </div>
                      ) : (
                        <div className="small muted">
                          Resolved by <b>{r.resolvedBy?.name || "Moderator"}</b>:{" "}
                          <span style={{ color: "var(--text)" }}>{r.resolution}</span>
                        </div>
                      )}
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          )
        }
      </Async>

      {/* ── Aceternity Enhanced Action Modal ── */}
      <Modal
        open={Boolean(act_)}
        onClose={() => !loading && setAct(null)}
        title={act_?.label}
        width={500}
        footer={
          <>
            <Button variant="outline" disabled={loading} onClick={() => setAct(null)}>
              Cancel
            </Button>
            <ShimmerButton
              variant={
                act_?.action === "dismiss"
                  ? "outline"
                  : act_?.action === "remove" || act_?.action === "block"
                  ? "danger"
                  : "shimmer"
              }
              size="sm"
              loading={loading}
              onClick={run}
            >
              {loading ? "Processing…" : `Confirm ${act_?.label || "Action"}`}
            </ShimmerButton>
          </>
        }
      >
        {act_ && (
          <div className="moderator-modal-preview">
            <div className="row between wrap gap-s mb-s">
              <Badge kind="danger">Reason: {act_.r.reason}</Badge>
              <span className="tiny faint">{ago(act_.r.createdAt)}</span>
            </div>
            <div className="small">
              <b>Target:</b>{" "}
              {act_.r.targetInfo?.title ||
                act_.r.targetInfo?.name ||
                (act_.r.targetInfo?.comment ? `“${act_.r.targetInfo.comment.slice(0, 80)}…”` : "—")}
            </div>
            {act_.r.details && (
              <div className="tiny muted mt-s">
                <b>Details:</b> “{act_.r.details}”
              </div>
            )}
          </div>
        )}

        <Field
          label="Moderator decision note"
          hint="Logged in the audit trail and shared with the affected party where applicable"
        >
          <textarea
            className="input"
            rows={3}
            value={note}
            disabled={loading}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Explain the rationale behind this moderation enforcement…"
          />
        </Field>
      </Modal>
    </>
  );
}

function Audits() {
  const ideas = useLive("/ideas");
  const [flag, setFlag] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const list = ideas.data || [];

  const flaggedCount = list.filter((i) => i.flagged).length;
  const lowCount = list.filter((i) => i.report && i.report.score < 50).length;
  const highCount = list.filter((i) => i.report && i.report.score >= 75).length;

  // CRITICAL FIX: Filter first across the entire list, THEN slice to 100!
  const rows = useMemo(() => {
    let res = list;
    if (filter === "flagged") res = res.filter((i) => i.flagged);
    if (filter === "low") res = res.filter((i) => i.report && i.report.score < 50);
    if (filter === "high") res = res.filter((i) => i.report && i.report.score >= 75);

    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter((i) =>
        `${i.title || ""} ${i.industry || ""} ${i.user?.name || ""}`.toLowerCase().includes(q)
      );
    }
    return res.slice(0, 100);
  }, [list, filter, search]);

  return (
    <>
      {/* ── Content Audits Hero Banner ── */}
      <div className="moderator-hero-banner">
        <Spotlight className="moderator-spotlight" fill="rgba(6, 182, 212, 0.24)" />
        <Meteors number={10} color="#06b6d4" />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="row between wrap gap-s" style={{ marginBottom: 10 }}>
            <span className="live-pulse-badge">
              <i className="live-pulse-dot pulse-cyan" />
              LIVE CONTENT AUDIT RADAR &bull; {list.length} SUBMISSIONS
            </span>
            <div className="row wrap gap-s">
              <ShimmerButton to="/app/mod-ideas" size="sm" variant="shimmer">
                <ShieldAlert size={13} style={{ marginRight: 6 }} /> Moderation Queue
              </ShimmerButton>
            </div>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Content Audits & AI Radar
          </h1>
          <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
            A live feed of the newest content submitted to Soch2Startup &bull;{" "}
            <FlipWords
              words={[
                "Real-time idea ingestion",
                "Automated AI validation triage",
                "Scam & plagiarism detection",
                "Community quality standards",
              ]}
              duration={2800}
              wordClassName="flip-cyan"
            />
          </p>
        </div>
      </div>

      {/* ── Mini Telemetry Stats ── */}
      <div className="grid g4 mb">
        <SpotlightCard
          className="moderator-stat-mini card"
          spotlightColor="rgba(0, 112, 243, 0.16)"
          style={{ cursor: "pointer" }}
          onClick={() => setFilter("all")}
        >
          <div>
            <div className="lbl">Audited Ideas</div>
            <div className="val">{list.length}</div>
          </div>
          <Badge kind={filter === "all" ? "primary" : "draft"}>Total</Badge>
        </SpotlightCard>

        <SpotlightCard
          className="moderator-stat-mini card"
          spotlightColor="rgba(239, 68, 68, 0.18)"
          style={{ cursor: "pointer" }}
          onClick={() => setFilter("flagged")}
        >
          <div>
            <div className="lbl">Flagged</div>
            <div className="val">{flaggedCount}</div>
          </div>
          <Badge kind={flaggedCount ? "danger" : "success"}>
            {flaggedCount ? "Reviewing" : "None"}
          </Badge>
        </SpotlightCard>

        <SpotlightCard
          className="moderator-stat-mini card"
          spotlightColor="rgba(245, 158, 11, 0.18)"
          style={{ cursor: "pointer" }}
          onClick={() => setFilter("low")}
        >
          <div>
            <div className="lbl">Low Score (&lt;50)</div>
            <div className="val">{lowCount}</div>
          </div>
          <Badge kind={lowCount ? "warning" : "draft"}>Caution</Badge>
        </SpotlightCard>

        <SpotlightCard
          className="moderator-stat-mini card"
          spotlightColor="rgba(34, 197, 94, 0.18)"
          style={{ cursor: "pointer" }}
          onClick={() => setFilter("high")}
        >
          <div>
            <div className="lbl">High Score (&ge;75)</div>
            <div className="val">{highCount}</div>
          </div>
          <Badge kind="success">Strong</Badge>
        </SpotlightCard>
      </div>

      {/* ── Toolbar: Quick Filter Tabs & Search ── */}
      <div className="row between wrap gap-s mb">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { id: "all", label: "All Submissions", count: list.length },
            { id: "flagged", label: "Flagged Ideas", count: flaggedCount },
            { id: "low", label: "Low AI Score", count: lowCount },
            { id: "high", label: "High Score", count: highCount },
          ]}
        />
        <div style={{ minWidth: 260 }}>
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search audited ideas…"
          />
        </div>
      </div>

      {/* ── Table in SpotlightCard ── */}
      <SpotlightCard
        className="card pad0"
        spotlightColor="rgba(6, 182, 212, 0.16)"
      >
        <Async q={ideas}>
          {() => (
            <DataTable
              rows={rows}
              empty={<Empty icon={Eye} title={search ? "No matching ideas" : "No ideas found"} />}
              columns={[
                {
                  key: "title",
                  label: "Idea",
                  render: (i) => (
                    <div>
                      <Link to={`/app/ideas/${i._id}`}>
                        <b>{i.title}</b>
                      </Link>
                      <div className="tiny faint">
                        {i.industry} &bull; {i.user?.name}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "report",
                  label: "AI Prediction",
                  sort: (i) => i.report?.score ?? -1,
                  render: (i) =>
                    i.report ? (
                      <span className="row gap-s">
                        <b>{i.report.score}</b>
                        <VerdictBadge verdict={i.report.verdict} />
                        {i.report.score < 50 && (
                          <span className="moderator-radar-pill risk-warning">Risk</span>
                        )}
                      </span>
                    ) : (
                      "—"
                    ),
                },
                {
                  key: "status",
                  label: "Status",
                  render: (i) => (
                    <div className="row gap-s">
                      <StatusBadge value={i.status} />
                      {i.flagged && <Badge kind="danger">flagged</Badge>}
                    </div>
                  ),
                },
                {
                  key: "createdAt",
                  label: "Submitted",
                  hideM: true,
                  render: (i) => ago(i.createdAt),
                },
                {
                  key: "a",
                  label: "",
                  sortable: false,
                  render: (i) => (
                    <div className="actions">
                      <Button
                        size="sm"
                        variant={i.flagged ? "ghost" : "outline"}
                        icon={Flag}
                        disabled={i.flagged}
                        onClick={() => setFlag(i)}
                      >
                        {i.flagged ? "Flagged" : "Flag"}
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          )}
        </Async>
      </SpotlightCard>

      {flag && (
        <ReportModal
          targetType="idea"
          target={flag._id}
          label="idea"
          onClose={() => setFlag(null)}
        />
      )}
    </>
  );
}
