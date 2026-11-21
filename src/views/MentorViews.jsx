import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Archive,
  Calendar,
  Check,
  ClipboardList,
  Compass,
  HandHeart,
  Lightbulb,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Play,
  Plus,
  RotateCcw,
  Send,
  Star,
  Trash2,
  Video,
} from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { act, useLive } from "../lib/live.js";
import { fmtDate, fmtDateTime } from "../lib/format.js";
import {
  Async,
  Avatar,
  Badge,
  Button,
  Card,
  Empty,
  Field,
  Modal,
  Stat,
  StatusBadge,
  Tabs,
  VerdictBadge,
  confirmDialog,
} from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";
import { FeedbackItem } from "../components/idea.jsx";
import {
  FlipWords,
  Meteors,
  ShimmerButton,
  Spotlight,
  SpotlightCard,
  TimelineSteps,
} from "../components/aceternity/index.js";

export default function MentorViews({ page }) {
  return page === "assignments" ? (
    <Assignments />
  ) : page === "sessions" ? (
    <Sessions />
  ) : page === "guidance" ? (
    <Guidance />
  ) : (
    <MyFeedback />
  );
}

const TABS = {
  all: null,
  assigned: ["assigned"],
  progress: ["in_progress"],
  completed: ["completed"],
  archived: ["archived"],
};

const MENTOR_LIFECYCLE_STEPS = [
  {
    tag: "Stage 1",
    title: "Claim & Review",
    desc: "Inspect AI validation metrics, market signals, and founder submissions from the open pool.",
  },
  {
    tag: "Stage 2",
    title: "Strategy Session",
    desc: "Hold 1-on-1 strategy sessions to diagnose bottlenecks and sharpen the value proposition.",
  },
  {
    tag: "Stage 3",
    title: "Targeted Guidance",
    desc: "Deliver actionable advisory notes on pricing, unit economics, GTM, and MVP roadmaps.",
  },
  {
    tag: "Stage 4",
    title: "Milestone Verified",
    desc: "Validate that the founder has executed key recommendations and mark mentoring completed.",
  },
];

export function AssignmentTable({ rows, actions, kindLabel }) {
  const nav = useNavigate();
  return (
    <DataTable
      rows={rows}
      onRowClick={(a) => a.idea?._id && nav(`/app/ideas/${a.idea._id}`)}
      empty={<Empty icon={ClipboardList} title="Nothing here yet" />}
      columns={[
        {
          key: "idea",
          label: "Startup",
          sort: (a) => a.idea?.title || "",
          render: (a) => (
            <div>
              <b>{a.idea?.title || "Untitled Startup"}</b>
              <div className="tiny faint">
                {a.idea?.industry || "General"} · {a.idea?.user?.name || "Founder"}
              </div>
            </div>
          ),
        },
        {
          key: "score",
          label: "AI score",
          sort: (a) => a.idea?.report?.score ?? -1,
          render: (a) =>
            a.idea?.report ? (
              <span className="row gap-s">
                <b className="mono">{a.idea.report.score}</b>
                <VerdictBadge verdict={a.idea.report.verdict} />
              </span>
            ) : (
              "—"
            ),
        },
        {
          key: "stage",
          label: kindLabel || "Stage",
          render: (a) => (
            <div className="row wrap gap-s">
              <StatusBadge value={a.stage} label={a.stage.replace("_", " ")} />
              {a.reEval && <Badge kind="warning">re-evaluation</Badge>}
            </div>
          ),
        },
        {
          key: "dueDate",
          label: "Due",
          hideM: true,
          render: (a) => (a.dueDate ? fmtDate(a.dueDate) : "—"),
        },
        {
          key: "updatedAt",
          label: "Updated",
          hideM: true,
          render: (a) => fmtDate(a.updatedAt),
        },
        {
          key: "actions",
          label: "",
          sortable: false,
          render: (a) => (
            <div className="actions" onClick={(e) => e.stopPropagation()}>
              {actions(a)}
            </div>
          ),
        },
      ]}
    />
  );
}

function Assignments() {
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const [showRoadmap, setShowRoadmap] = useState(false);
  const tab = TABS[sp.get("f")] !== undefined && sp.get("f") ? sp.get("f") : "all";
  const q = useLive("/assignments", { params: { kind: "mentor" } });
  const ideas = useLive("/ideas");
  const list = q.data || [];
  const rows = list.filter((a) => !TABS[tab] || TABS[tab].includes(a.stage));
  const pool = (ideas.data || []).filter(
    (i) =>
      ["submitted", "under_review", "approved"].includes(i.status) &&
      !i.assignments?.some((a) => a.kind === "mentor")
  );
  const stage = (a, s, msg) => act(() => api.patch(`/assignments/${a._id}`, { stage: s }), msg);
  const activeCount = list.filter((a) => ["assigned", "in_progress"].includes(a.stage)).length;

  return (
    <>
      <div className="mentor-hero-banner">
        <Spotlight className="mentor-spotlight" fill="#06b6d4" />
        <Meteors number={12} />
        <div className="mentor-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" />
                PORTFOLIO &bull; ACTIVE ROSTER
              </span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Assigned Startups & Mentorship
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              Guide founders through advisory stages &bull;{" "}
              <FlipWords
                words={[
                  "1-on-1 Founder Guidance",
                  "GTM Strategy Acceleration",
                  "Milestone Execution Tracking",
                  "High-Impact Advisory",
                ]}
                duration={2800}
              />
            </p>
          </div>
          <div className="row wrap" style={{ gap: 10 }}>
            <ShimmerButton
              onClick={() => setShowRoadmap((v) => !v)}
              size="sm"
              variant="outline"
            >
              <Compass size={14} style={{ marginRight: 6 }} />{" "}
              {showRoadmap ? "Hide Mentorship Stages" : "Mentorship Stages"}
            </ShimmerButton>
            <ShimmerButton onClick={() => nav("/app/sessions")} size="sm" variant="shimmer">
              <Calendar size={14} style={{ marginRight: 6 }} /> Schedule Session
            </ShimmerButton>
          </div>
        </div>
      </div>

      {showRoadmap && (
        <div className="mentor-roadmap-preview">
          <TimelineSteps steps={MENTOR_LIFECYCLE_STEPS} className="steps-4" />
        </div>
      )}

      <div className="grid g4 mb">
        <Stat
          icon={Lightbulb}
          label="Active mentees"
          value={activeCount}
          tone="cyan"
          spotlightColor="rgba(6, 182, 212, 0.16)"
        />
        <Stat
          icon={Play}
          label="In progress"
          value={list.filter((a) => a.stage === "in_progress").length}
          tone="purple"
          to="/app/assignments?f=progress"
          spotlightColor="rgba(168, 85, 247, 0.16)"
        />
        <Stat
          icon={Check}
          label="Completed"
          value={list.filter((a) => a.stage === "completed").length}
          tone="green"
          to="/app/assignments?f=completed"
          spotlightColor="rgba(34, 197, 94, 0.16)"
        />
        <Stat
          icon={HandHeart}
          label="Open pool"
          value={pool.length}
          tone="orange"
          spotlightColor="rgba(249, 115, 22, 0.16)"
        />
      </div>

      <div className="mb">
        <Tabs
          value={tab}
          onChange={(t) => setSp(t === "all" ? {} : { f: t })}
          tabs={[
            ["all", "All"],
            ["assigned", "New"],
            ["progress", "In progress"],
            ["completed", "Completed"],
            ["archived", "Archived"],
          ].map(([id, label]) => ({
            id,
            label,
            count: id === "all" ? list.length : list.filter((a) => TABS[id].includes(a.stage)).length,
          }))}
        />
      </div>

      <SpotlightCard className="pad0 card" spotlightColor="rgba(6, 182, 212, 0.12)">
        <Async q={q}>
          {() => (
            <AssignmentTable
              rows={rows}
              actions={(a) => (
                <>
                  {a.stage === "assigned" && (
                    <Button
                      size="sm"
                      icon={Play}
                      onClick={() => stage(a, "in_progress", "Marked in progress")}
                    >
                      Start
                    </Button>
                  )}
                  {["assigned", "in_progress"].includes(a.stage) && (
                    <Button
                      size="sm"
                      variant="outline"
                      icon={MessageSquare}
                      onClick={() => nav(`/app/guidance?idea=${a.idea._id}`)}
                    >
                      Guide
                    </Button>
                  )}
                  {a.stage === "in_progress" && (
                    <Button
                      size="sm"
                      variant="success"
                      icon={Check}
                      onClick={() => stage(a, "completed", "Mentoring completed")}
                    >
                      Complete
                    </Button>
                  )}
                  {a.stage !== "archived" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Archive}
                      onClick={() => stage(a, "archived", "Archived")}
                      aria-label="Archive"
                    />
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      icon={RotateCcw}
                      onClick={() => stage(a, "assigned", "Restored")}
                    >
                      Restore
                    </Button>
                  )}
                </>
              )}
            />
          )}
        </Async>
      </SpotlightCard>

      <div className="row between mt-l mb-s" style={{ alignItems: "flex-end" }}>
        <div>
          <h2 style={{ fontSize: 20, margin: "0 0 4px" }}>Open pool</h2>
          <p className="muted small mb0">
            Startup ideas awaiting an experienced mentor. Claim one to begin advising them.
          </p>
        </div>
        {pool.length > 0 && <Badge kind="info">{pool.length} available to claim</Badge>}
      </div>

      <SpotlightCard className="pad0 card" spotlightColor="rgba(0, 112, 243, 0.14)">
        <Async q={ideas} skeleton={<div className="skeleton" style={{ height: 200 }} />}>
          {() => (
            <DataTable
              rows={pool}
              pageSize={6}
              empty={<Empty icon={HandHeart} title="No unassigned ideas" />}
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
                  render: (i) =>
                    i.report ? (
                      <span className="row gap-s">
                        <b className="mono">{i.report.score}</b>
                        <VerdictBadge verdict={i.report.verdict} />
                      </span>
                    ) : (
                      "—"
                    ),
                },
                { key: "status", label: "Status", render: (i) => <StatusBadge value={i.status} /> },
                {
                  key: "a",
                  label: "",
                  sortable: false,
                  render: (i) => (
                    <div className="actions" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        icon={HandHeart}
                        onClick={() => act(() => api.post(`/ideas/${i._id}/claim`), "Added to your assignments")}
                      >
                        Claim
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          )}
        </Async>
      </SpotlightCard>
    </>
  );
}

const MODE = {
  video: [Video, "Video call"],
  call: [Phone, "Phone"],
  in_person: [MapPin, "In person"],
};

const MODE_GLOW = {
  video: "rgba(6, 182, 212, 0.18)",
  call: "rgba(168, 85, 247, 0.18)",
  in_person: "rgba(34, 197, 94, 0.18)",
};

function Sessions() {
  const { user } = useAuth();
  const mentor = user.role === "mentor";
  const admin = ["admin", "superadmin"].includes(user.role);
  const [tab, setTab] = useState("upcoming");
  const [form, setForm] = useState(null);
  const [notes, setNotes] = useState(null);
  const q = useLive("/sessions");
  const list = q.data || [];
  const now = Date.now();
  const up = list.filter((s) => s.status === "scheduled" && new Date(s.scheduledAt) >= now - 3600000);
  const past = list.filter((s) => !up.includes(s));
  const rows = (tab === "upcoming" ? up : past).sort((a, b) =>
    tab === "upcoming"
      ? new Date(a.scheduledAt) - new Date(b.scheduledAt)
      : new Date(b.scheduledAt) - new Date(a.scheduledAt)
  );

  return (
    <>
      <div className="mentor-hero-banner">
        <Spotlight className="mentor-spotlight" fill="#06b6d4" />
        <Meteors number={12} />
        <div className="mentor-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" />
                1-ON-1 ADVISORY &bull; LIVE SCHEDULER
              </span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Mentor Sessions
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              {mentor
                ? "Schedule and run strategy sessions with your startup founders \u2022 "
                : "Sessions with verified mentors appear here as scheduled \u2022 "}
              <FlipWords
                words={[
                  "Video Strategy Calls",
                  "Milestone Deep Dives",
                  "GTM & Pitch Practice",
                  "Unit Economics Review",
                ]}
                duration={2800}
              />
            </p>
          </div>
          {mentor && (
            <ShimmerButton onClick={() => setForm({})} size="sm" variant="shimmer">
              <Plus size={14} style={{ marginRight: 6 }} /> Schedule session
            </ShimmerButton>
          )}
        </div>
      </div>

      <div className="grid g3 mb">
        <Stat
          icon={Calendar}
          label="Upcoming sessions"
          value={up.length}
          tone="cyan"
          spotlightColor="rgba(6, 182, 212, 0.16)"
        />
        <Stat
          icon={Check}
          label="Past & completed"
          value={past.filter((s) => s.status === "completed").length}
          tone="green"
          spotlightColor="rgba(34, 197, 94, 0.16)"
        />
        <Stat
          icon={Video}
          label="Next session"
          value={up[0] ? fmtDateTime(up[0].scheduledAt).split(",")[0] : "None"}
          sub={up[0] ? up[0].title : "Queue is clear"}
          tone="purple"
          spotlightColor="rgba(168, 85, 247, 0.16)"
        />
      </div>

      <div className="mb">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "upcoming", label: "Upcoming", count: up.length },
            { id: "past", label: "Past & cancelled", count: past.length },
          ]}
        />
      </div>

      <Async q={q}>
        {() =>
          !rows.length ? (
            <Empty icon={Calendar} title="No sessions here">
              {mentor
                ? "Schedule a session with one of your startups."
                : "Your mentor will schedule sessions with you."}
            </Empty>
          ) : (
            <div className="mentor-session-grid stagger">
              {rows.map((s) => {
                const [I, ml] = MODE[s.mode] || MODE.video;
                const d = new Date(s.scheduledAt);
                const glow = MODE_GLOW[s.mode] || MODE_GLOW.video;
                const meetingUrl = s.link ? (/^https?:\/\//i.test(s.link) ? s.link : `https://${s.link}`) : null;
                return (
                  <SpotlightCard key={s._id} className="card hover" spotlightColor={glow}>
                    <div className="row" style={{ gap: 14, alignItems: "flex-start" }}>
                      <div className="stat">
                        <div
                          className={`ico ${
                            s.mode === "call" ? "g-purple" : s.mode === "in_person" ? "g-green" : "g-cyan"
                          }`}
                          style={{
                            width: 56,
                            height: 62,
                            flexDirection: "column",
                            lineHeight: 1.1,
                          }}
                        >
                          <b style={{ fontSize: 22 }}>{d.getDate()}</b>
                          <span style={{ fontSize: 11 }}>
                            {d.toLocaleString("en", { month: "short" }).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="grow">
                        <div className="row between">
                          <b>{s.title}</b>
                          <Badge kind={s.status}>{s.status}</Badge>
                        </div>
                        <div className="small muted mt-s">
                          {s.idea?._id ? (
                            <Link to={`/app/ideas/${s.idea._id}`}>{s.idea.title || "View startup"}</Link>
                          ) : (
                            <span>{s.idea?.title || "Startup Idea"}</span>
                          )}
                        </div>
                        <div className="row wrap small muted mt-s" style={{ gap: 12 }}>
                          <span className="row gap-s">
                            <I size={14} />
                            {ml}
                          </span>
                          <span>
                            {fmtDateTime(s.scheduledAt)} · {s.durationMin} min
                          </span>
                        </div>
                        <div className="row small muted mt-s gap-s">
                          <Avatar name={(mentor ? s.founder?.name : s.mentor?.name) || "?"} size={22} />
                          {mentor ? `Founder: ${s.founder?.name || "Founder"}` : `Mentor: ${s.mentor?.name || "Mentor"}`}
                        </div>
                        {s.agenda && <p className="small muted mt-s">{s.agenda}</p>}
                        {s.notes && (
                          <div className="callout small mt-s">
                            <b>Notes:</b> {s.notes}
                          </div>
                        )}
                        {meetingUrl && s.status === "scheduled" && (
                          <div className="mt-s">
                            <ShimmerButton
                              size="sm"
                              variant="outline"
                              href={meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Join meeting &rarr;
                            </ShimmerButton>
                          </div>
                        )}
                        {(mentor || admin) && (
                          <div className="row wrap mt-s">
                            {s.status === "scheduled" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="success"
                                  icon={Check}
                                  onClick={() => setNotes({ s, text: s.notes || "" })}
                                >
                                  Complete
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    act(
                                      () => api.patch(`/sessions/${s._id}`, { status: "cancelled" }),
                                      "Session cancelled – founder notified"
                                    )
                                  }
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              icon={Trash2}
                              aria-label="Delete"
                              onClick={async () => {
                                if (
                                  await confirmDialog({
                                    title: "Delete session?",
                                    message: s.title,
                                    danger: true,
                                    confirmText: "Delete",
                                  })
                                )
                                  act(() => api.delete(`/sessions/${s._id}`), "Session deleted");
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          )
        }
      </Async>

      {form && <ScheduleModal onClose={() => setForm(null)} />}
      <Modal
        open={Boolean(notes)}
        onClose={() => setNotes(null)}
        title="Complete session"
        footer={
          <>
            <Button variant="outline" onClick={() => setNotes(null)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const ok = await act(
                  () =>
                    api.patch(`/sessions/${notes.s._id}`, {
                      status: "completed",
                      notes: notes.text,
                    }),
                  "Session completed"
                );
                if (ok) setNotes(null);
              }}
            >
              Save notes
            </Button>
          </>
        }
      >
        <Field label="Session notes (visible to the founder)">
          <textarea
            className="input"
            value={notes?.text || ""}
            onChange={(e) => setNotes({ ...notes, text: e.target.value })}
            placeholder="Key takeaways, action items and next milestones for the founder…"
          />
        </Field>
      </Modal>
    </>
  );
}

function ScheduleModal({ onClose }) {
  const mine = useLive("/assignments", { params: { kind: "mentor" } });
  const ideas = (mine.data || []).filter((a) => a.stage !== "archived");
  const [f, setF] = useState({
    idea: "",
    title: "",
    scheduledAt: "",
    durationMin: 45,
    mode: "video",
    link: "",
    agenda: "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const save = async () => {
    setBusy(true);
    const ok = await act(
      () => api.post("/sessions", { ...f, scheduledAt: new Date(f.scheduledAt).toISOString() }),
      "Session scheduled – the founder was notified"
    );
    setBusy(false);
    if (ok) onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Schedule a session"
      width={600}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={busy} disabled={!f.idea || !f.scheduledAt} onClick={save}>
            Schedule session
          </Button>
        </>
      }
    >
      <div className="col">
        <Field label="Startup">
          <select className="input" value={f.idea} onChange={set("idea")}>
            <option value="">Select an idea you mentor…</option>
            {ideas.map((a) => (
              <option key={a._id} value={a.idea._id}>
                {a.idea.title} — {a.idea.user?.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Title">
          <input
            className="input"
            value={f.title}
            onChange={set("title")}
            placeholder="e.g. Pricing & Unit Economics Workshop"
          />
        </Field>
        <div className="grid g2">
          <Field label="Date & time">
            <input
              type="datetime-local"
              className="input"
              value={f.scheduledAt}
              onChange={set("scheduledAt")}
            />
          </Field>
          <Field label="Duration (min)">
            <input
              type="number"
              min={10}
              max={240}
              className="input"
              value={f.durationMin}
              onChange={set("durationMin")}
            />
          </Field>
        </div>
        <div className="grid g2">
          <Field label="Mode">
            <select className="input" value={f.mode} onChange={set("mode")}>
              <option value="video">Video call</option>
              <option value="call">Phone</option>
              <option value="in_person">In person</option>
            </select>
          </Field>
          <Field label="Meeting link">
            <input
              className="input"
              value={f.link}
              onChange={set("link")}
              placeholder="https://meet.google.com/…"
            />
          </Field>
        </div>
        <Field label="Agenda">
          <textarea
            className="input"
            value={f.agenda}
            onChange={set("agenda")}
            placeholder="Key discussion topics, expected preparation, and review goals…"
          />
        </Field>
      </div>
    </Modal>
  );
}

const QUICK_TAGS = [
  "pricing",
  "go-to-market",
  "mvp-scope",
  "customer-discovery",
  "unit-economics",
  "pitch-deck",
  "competitive-moat",
  "scalability",
];

function Guidance() {
  const [sp, setSp] = useSearchParams();
  const mine = useLive("/assignments", { params: { kind: "mentor" } });
  const list = (mine.data || []).filter((a) => a.stage !== "archived");
  const id = sp.get("idea") || list[0]?.idea._id;
  useEffect(() => {
    if (!sp.get("idea") && list[0]) setSp({ idea: list[0].idea._id }, { replace: true });
  }, [list.length]);
  const detail = useLive(`/ideas/${id}`, { skip: !id });
  const [f, setF] = useState({ comment: "", tags: "" });
  const [busy, setBusy] = useState(false);

  const toggleTag = (tag) => {
    const current = f.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    setF({ ...f, tags: next.join(", ") });
  };

  const currentTags = useMemo(
    () =>
      f.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    [f.tags]
  );

  const send = async () => {
    setBusy(true);
    const ok = await act(
      () =>
        api.post(`/ideas/${id}/feedback`, {
          kind: "guidance",
          comment: f.comment,
          tags: f.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      "Guidance sent to the founder"
    );
    setBusy(false);
    if (ok) setF({ comment: "", tags: "" });
  };

  const selectedIdea = detail.data;

  return (
    <>
      <div className="mentor-hero-banner">
        <Spotlight className="mentor-spotlight" fill="#06b6d4" />
        <Meteors number={12} />
        <div className="mentor-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" />
                FOUNDER ADVISORY &bull; DIRECT GUIDANCE
              </span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Provide Guidance
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              Deliver actionable, high-conviction advice to your mentees &bull;{" "}
              <FlipWords
                words={[
                  "Go-To-Market Execution",
                  "Pricing & Monetization",
                  "Customer Acquisition",
                  "Pitch Deck Refinements",
                ]}
                duration={2800}
              />
            </p>
          </div>
          <ShimmerButton onClick={() => setF({ comment: "", tags: "" })} size="sm" variant="outline">
            <RotateCcw size={14} style={{ marginRight: 6 }} /> Clear composer
          </ShimmerButton>
        </div>
      </div>

      <Async q={mine}>
        {() =>
          !list.length ? (
            <Empty icon={MessageSquare} title="No active assignments">
              Claim an idea from <Link to="/app/assignments">Assigned startups</Link> first.
            </Empty>
          ) : (
            <div className="grid g-main">
              <Card
                title="Advisory Composer"
                icon={MessageSquare}
                spotlight
                spotlightColor="rgba(6, 182, 212, 0.16)"
              >
                <Field label="Selected Startup">
                  <select
                    className="input"
                    value={id}
                    onChange={(e) => setSp({ idea: e.target.value })}
                  >
                    {list.map((a) => (
                      <option key={a._id} value={a.idea?._id}>
                        {a.idea?.title || "Startup"} — {a.idea?.user?.name || "Founder"}
                      </option>
                    ))}
                  </select>
                </Field>

                {selectedIdea && (
                  <div className="mentor-startup-preview-box mt-s">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>
                        <Link to={`/app/ideas/${selectedIdea._id}`}>{selectedIdea.title}</Link>
                      </div>
                      <div className="tiny faint" style={{ marginTop: 2 }}>
                        {selectedIdea.industry} &bull; Founder: {selectedIdea.user?.name}
                      </div>
                    </div>
                    <div className="row gap-s" style={{ alignItems: "center" }}>
                      {selectedIdea.report && (
                        <>
                          <span className="mono" style={{ fontWeight: 700, fontSize: 14 }}>
                            AI: {selectedIdea.report.score}/100
                          </span>
                          <VerdictBadge verdict={selectedIdea.report.verdict} />
                        </>
                      )}
                      <StatusBadge value={selectedIdea.status} />
                    </div>
                  </div>
                )}

                <Field label="Your guidance" className="mt">
                  <textarea
                    className="input"
                    style={{ minHeight: 180 }}
                    value={f.comment}
                    onChange={(e) => setF({ ...f, comment: e.target.value })}
                    placeholder="What should they do next, and why? Be concrete, tactical, and provide direct next steps…"
                  />
                </Field>

                <Field label="Tags" className="mt" hint="Click suggestions below or type comma-separated tags">
                  <input
                    className="input"
                    value={f.tags}
                    onChange={(e) => setF({ ...f, tags: e.target.value })}
                    placeholder="pricing, go-to-market, mvp-scope…"
                  />
                </Field>

                <div className="row wrap gap-s mt-s">
                  {QUICK_TAGS.map((tag) => {
                    const active = currentTags.includes(tag);
                    return (
                      <span
                        key={tag}
                        className={`mentor-tag-pill ${active ? "active" : ""}`}
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag} {active && "✓"}
                      </span>
                    );
                  })}
                </div>

                <div className="mt">
                  <ShimmerButton
                    variant="shimmer"
                    size="md"
                    loading={busy}
                    disabled={!f.comment.trim() || busy}
                    onClick={send}
                  >
                    <Send size={15} style={{ marginRight: 8 }} /> Send guidance to founder
                  </ShimmerButton>
                </div>
              </Card>

              <Card
                spotlight
                spotlightColor="rgba(168, 85, 247, 0.14)"
                title="Earlier feedback on this idea"
                icon={Star}
              >
                <Async q={detail}>
                  {(d) =>
                    d.feedback.length ? (
                      <div className="col gap-m mt-s">
                        {d.feedback.map((x) => (
                          <FeedbackItem key={x._id} fb={x} />
                        ))}
                      </div>
                    ) : (
                      <p className="muted small mt-s">Nothing yet — you'd be the first.</p>
                    )
                  }
                </Async>
              </Card>
            </div>
          )
        }
      </Async>
    </>
  );
}

function MyFeedback() {
  const q = useLive("/feedback", { params: { kind: "guidance" } });
  const [edit, setEdit] = useState(null);

  return (
    <>
      <div className="mentor-hero-banner">
        <Spotlight className="mentor-spotlight" fill="#06b6d4" />
        <Meteors number={12} />
        <div className="mentor-hero-content">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-pulse-badge">
                <i className="live-pulse-dot" />
                ADVISORY ARCHIVE &bull; FOUNDER IMPACT
              </span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              My Feedback & Guidance History
            </h1>
            <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
              Every recommendation you have shared with founders &bull;{" "}
              <FlipWords
                words={[
                  "Real-Time Delivery",
                  "Iterative Support",
                  "Actionable Guidance",
                  "Tracked Progress",
                ]}
                duration={2800}
              />
            </p>
          </div>
          <ShimmerButton to="/app/guidance" size="sm" variant="outline">
            <MessageSquare size={14} style={{ marginRight: 6 }} /> Write new guidance
          </ShimmerButton>
        </div>
      </div>

      <Async q={q}>
        {(rows) =>
          !rows.length ? (
            <Empty icon={Star} title="No feedback given yet">
              Your feedback notes will appear here once you advise a startup.
            </Empty>
          ) : (
            <div className="col gap-m">
              {rows.map((f) => (
                <SpotlightCard key={f._id} className="card" spotlightColor="rgba(6, 182, 212, 0.12)">
                  <div className="row between mb">
                    {f.idea?._id ? (
                      <Link to={`/app/ideas/${f.idea._id}`}>
                        <b style={{ fontSize: 16 }}>{f.idea.title || "Startup Idea"}</b>
                      </Link>
                    ) : (
                      <b style={{ fontSize: 16 }}>{f.idea?.title || "Archived Startup"}</b>
                    )}
                    <span className="small muted">
                      for <b>{f.idea?.user?.name || "Founder"}</b>
                    </span>
                  </div>
                  <FeedbackItem
                    fb={f}
                    actions={
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Pencil}
                          onClick={() => setEdit({ _id: f._id, comment: f.comment })}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Trash2}
                          aria-label="Delete"
                          onClick={async () => {
                            if (
                              await confirmDialog({
                                title: "Delete this feedback?",
                                message: "The founder will no longer see it.",
                                danger: true,
                                confirmText: "Delete",
                              })
                            )
                              act(() => api.delete(`/feedback/${f._id}`), "Feedback deleted");
                          }}
                        />
                      </>
                    }
                  />
                </SpotlightCard>
              ))}
            </div>
          )
        }
      </Async>

      <Modal
        open={Boolean(edit)}
        onClose={() => setEdit(null)}
        title="Edit feedback"
        footer={
          <>
            <Button variant="outline" onClick={() => setEdit(null)}>
              Cancel
            </Button>
            <Button
              disabled={!edit?.comment?.trim()}
              onClick={async () => {
                const ok = await act(
                  () => api.patch(`/feedback/${edit._id}`, { comment: edit.comment }),
                  "Feedback updated"
                );
                if (ok) setEdit(null);
              }}
            >
              Save changes
            </Button>
          </>
        }
      >
        <textarea
          className="input"
          style={{ minHeight: 160 }}
          value={edit?.comment || ""}
          onChange={(e) => setEdit({ ...edit, comment: e.target.value })}
        />
      </Modal>
    </>
  );
}
