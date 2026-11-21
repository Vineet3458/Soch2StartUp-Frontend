import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Flag, Gavel, HandHeart, MessageSquare, Pencil, RefreshCw, Scale, Send, Trash2, UserPlus, Users, Video, Star, ShieldAlert } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { act, useLive } from "../lib/live.js";
import { fmtDate, fmtDateTime } from "../lib/format.js";
import { Alert, Async, Avatar, Badge, Button, Card, Empty, Field, Modal, Progress, StatusBadge, confirmDialog } from "../components/ui.jsx";
import { AssignModal, FeedbackItem, ReportBody, ReportModal, ReviewModal } from "../components/idea.jsx";
import { ShimmerButton, SpotlightCard, Spotlight, TimelineSteps } from "../components/aceternity/index.js";

const IDEA_LIFECYCLE = [
  { title: "Define Concept", desc: "Core problem statement, target customer segment & monetization model.", tag: "Phase 1" },
  { title: "AI Multi-Model Council", desc: "Consensus scoring across demand, competition, moat, and execution risk.", tag: "Phase 2" },
  { title: "Mentor & Expert Review", desc: "Advisory syncs, 1-on-1 strategic feedback, and scorecard diligence.", tag: "Phase 3" },
  { title: "Roadmap & Scaling", desc: "Agile milestone delivery from pilot launch to venture investment.", tag: "Phase 4" },
];

export default function IdeaDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const cfg = useConfig();
  const nav = useNavigate();
  const q = useLive(`/ideas/${id}`);
  const [modal, setModal] = useState(null); // review | assign | report-idea | {dispute: fb} | {report: fb}
  const [guidance, setGuidance] = useState({ comment: "", tags: "" });
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <Async q={q}>{(idea) => {
      const owner = idea.user?._id === user.id;
      const mine = idea.assignments?.filter((a) => a.assignee?._id === user.id) || [];
      const myMentor = mine.find((a) => a.kind === "mentor"), myEval = mine.find((a) => a.kind === "evaluation");
      const hasMentor = idea.assignments?.some((a) => a.kind === "mentor");
      const staffPick = ["mentor", "industry_expert"].includes(user.role) && idea.status !== "draft" && !(user.role === "mentor" ? myMentor : myEval);
      const done = idea.roadmap?.filter((m) => m.status === "done").length || 0;

      const sendGuidance = async () => {
        setBusy(true);
        const ok = await act(() => api.post(`/ideas/${id}/feedback`, { kind: "guidance", comment: guidance.comment, tags: guidance.tags.split(",").map((t) => t.trim()).filter(Boolean) }), "Guidance sent to the founder");
        setBusy(false); if (ok) setGuidance({ comment: "", tags: "" });
      };

      return (
        <>
          <div className="founder-hero-banner" style={{ marginBottom: 20 }}>
            <Spotlight className="founder-spotlight" fill="var(--primary)" />
            <div className="founder-hero-content">
              <div>
                <div className="row wrap gap-s" style={{ marginBottom: 10 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => nav(-1)} style={{ padding: "4px 8px", height: "auto" }}>
                    <ArrowLeft size={14} /> Back
                  </button>
                  <StatusBadge value={idea.status} />
                  <Badge kind="primary">{idea.industry}</Badge>
                  {idea.flagged && <Badge kind="danger"><Flag size={12} /> Flagged</Badge>}
                  {idea.pendingMentorRequest && <Badge kind="warning">Mentor requested</Badge>}
                </div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, margin: "6px 0", letterSpacing: "-0.02em" }}>
                  {idea.title}
                </h1>
                <p className="muted small" style={{ margin: 0 }}>
                  By <b>{idea.user?.name}</b> &bull; {fmtDate(idea.createdAt)} &bull; Budget: <b>{idea.budget}</b> &bull; Team: <b>{idea.teamSize}</b>
                </p>
              </div>
              <div className="row wrap no-print" style={{ gap: 8 }}>
                {owner && ["draft", "changes_requested"].includes(idea.status) && (
                  <ShimmerButton size="sm" variant="shimmer" onClick={() => nav(`/app/validate?edit=${id}`)}>
                    <Pencil size={14} style={{ marginRight: 6 }} /> Edit {idea.status === "changes_requested" && "& resubmit"}
                  </ShimmerButton>
                )}
                {owner && idea.status !== "draft" && (
                  <Button variant="outline" icon={RefreshCw} onClick={() => act(() => api.post(`/ideas/${id}/reanalyze`), "Report regenerated")}>
                    Re-analyse
                  </Button>
                )}
                {owner && idea.status !== "draft" && !hasMentor && !idea.pendingMentorRequest && cfg.feature("mentorRequests") && (
                  <ShimmerButton
                    variant="shimmer"
                    size="sm"
                    onClick={async () => {
                      const note = await confirmDialog({
                        title: "Request a mentor",
                        message: "Tell the admins what help you need. They will match you with a verified mentor.",
                        input: true,
                        confirmText: "Send request",
                        placeholder: "e.g. Go-to-market and pricing advice…",
                      });
                      if (note !== null) act(() => api.post(`/ideas/${id}/mentor-request`, { note }), "Request sent to admins");
                    }}
                  >
                    <HandHeart size={14} style={{ marginRight: 6 }} /> Request mentor
                  </ShimmerButton>
                )}
                {cfg.can("ideas.review") && idea.status !== "draft" && <Button icon={Gavel} onClick={() => setModal("review")}>Review</Button>}
                {cfg.can("ideas.assign") && idea.status !== "draft" && <Button variant="outline" icon={UserPlus} onClick={() => setModal("assign")}>Assign</Button>}
                {staffPick && (
                  <ShimmerButton
                    size="sm"
                    variant="shimmer"
                    onClick={() => act(() => api.post(`/ideas/${id}/claim`), "Idea added to your queue")}
                  >
                    <HandHeart size={14} style={{ marginRight: 6 }} /> Claim to {user.role === "mentor" ? "mentor" : "evaluate"}
                  </ShimmerButton>
                )}
                {myEval && (
                  <ShimmerButton
                    size="sm"
                    variant="shimmer"
                    onClick={() => nav(`/app/evaluate?idea=${id}`)}
                  >
                    <Star size={14} style={{ marginRight: 6 }} /> Evaluate
                  </ShimmerButton>
                )}
                {!owner && idea.status !== "draft" && cfg.feature("moderation") && <Button variant="ghost" icon={Flag} onClick={() => setModal("report-idea")}>Report</Button>}
                {(owner || cfg.can("ideas.delete")) && <Button variant="ghost" icon={Trash2} onClick={async () => { if (await confirmDialog({ title: "Delete idea?", message: "This cannot be undone.", confirmText: "Delete", danger: true })) { await act(() => api.delete(`/ideas/${id}`), "Idea deleted"); nav("/app/ideas"); } }} aria-label="Delete idea" />}
              </div>
            </div>
          </div>

          <div className="founder-roadmap-preview mb-l">
            <TimelineSteps steps={IDEA_LIFECYCLE} className="steps-4" />
          </div>

          {idea.reviewNote && ["rejected", "changes_requested", "archived"].includes(idea.status) && <div className="mb"><Alert kind={idea.status === "rejected" ? "error" : "warning"}><b>{idea.status === "changes_requested" ? "Changes requested" : idea.status === "rejected" ? "Not approved" : "Removed"}:</b> {idea.reviewNote}{idea.reviewedBy && <span className="faint"> — {idea.reviewedBy.name}</span>}</Alert></div>}
          {idea.status === "approved" && <div className="mb"><Alert kind="success">🎉 Approved{idea.reviewNote && <>: {idea.reviewNote}</>}</Alert></div>}

          <div className="grid g-main">
            <div className="col gap-l">
              <Card title="The idea" spotlight spotlightColor="rgba(0, 112, 243, 0.14)"><p className="pre muted">{idea.description}</p></Card>
              <ReportBody idea={idea} />
              <Card title={`Feedback & evaluations (${idea.feedback.length})`} icon={MessageSquare} spotlight spotlightColor="rgba(0, 112, 243, 0.14)">
                {myMentor && (
                  <div className="callout mb no-print"><b>Write guidance</b>
                    <div className="col mt-s"><textarea className="input" value={guidance.comment} onChange={(e) => setGuidance({ ...guidance, comment: e.target.value })} placeholder="Share specific, actionable advice…" />
                      <div className="row wrap"><input className="input grow" placeholder="Tags (comma separated)" value={guidance.tags} onChange={(e) => setGuidance({ ...guidance, tags: e.target.value })} /><Button icon={Send} loading={busy} disabled={!guidance.comment.trim()} onClick={sendGuidance}>Send</Button></div></div></div>)}
                {!idea.feedback.length ? <Empty icon={MessageSquare} title="No feedback yet">{owner ? "Request a mentor or wait for an expert evaluation." : "Be the first to share guidance."}</Empty> :
                  <div>{idea.feedback.map((f) => (
                    <FeedbackItem key={f._id} fb={f} actions={<>
                      {owner && f.kind === "evaluation" && f.dispute?.status !== "open" && <Button size="sm" variant="outline" icon={Scale} onClick={() => setModal({ dispute: f })}>Dispute</Button>}
                      {f.author !== user.id && f.status !== "removed" && cfg.feature("moderation") && <Button size="sm" variant="ghost" icon={Flag} onClick={() => setModal({ report: f })} aria-label="Report feedback" />}
                      {f.author === user.id && <Button size="sm" variant="ghost" icon={Trash2} aria-label="Delete feedback" onClick={async () => { if (await confirmDialog({ title: "Delete your feedback?", message: "This cannot be undone.", danger: true, confirmText: "Delete" })) act(() => api.delete(`/feedback/${f._id}`), "Feedback removed"); }} />}
                    </>} />))}</div>}
              </Card>
            </div>

            <div className="col">
              <Card title="Team" icon={Users} sub={idea.assignments?.length || 0} spotlight spotlightColor="rgba(168, 85, 247, 0.16)">
                {!idea.assignments?.length ? <p className="muted small">No mentor or evaluator assigned yet.</p> :
                  <div className="list">{idea.assignments.map((a) => <div className="list-item" key={a._id}><Avatar name={a.assignee?.name} size={34} /><div className="grow"><b className="small">{a.assignee?.name}</b><div className="tiny faint">{a.kind === "mentor" ? "Mentor" : "Evaluator"}{a.reEval && " · re-evaluation"}</div></div><StatusBadge value={a.stage} label={a.stage.replace("_", " ")} /></div>)}</div>}
              </Card>
              {cfg.feature("sessions") && (
                <Card title="Mentoring sessions" icon={Calendar} sub={idea.sessions?.length || 0} spotlight spotlightColor="rgba(6, 182, 212, 0.16)">
                  {!idea.sessions?.length ? <p className="muted small">No sessions scheduled.</p> :
                    <div className="list">{idea.sessions.map((s) => <div className="list-item" key={s._id}><div className="notif-ico"><Video size={16} /></div><div className="grow"><b className="small">{s.title}</b><div className="tiny faint">{fmtDateTime(s.scheduledAt)} · {s.durationMin} min · {s.mentor?.name}</div></div><Badge kind={s.status}>{s.status}</Badge></div>)}</div>}
                </Card>)}
              {idea.roadmap?.length > 0 && (
                <Card title="MVP roadmap" icon={Flag} sub={`${done}/${idea.roadmap.length}`} spotlight spotlightColor="rgba(34, 197, 94, 0.16)">
                  <Progress value={(done / idea.roadmap.length) * 100} />
                  <div className="list mt-s">{idea.roadmap.map((m) => <div className="list-item" key={m._id}><div className="grow small">{m.title}</div><Badge kind={m.status === "done" ? "success" : m.status === "doing" ? "warning" : "draft"}>{m.status}</Badge></div>)}</div>
                </Card>)}
              {cfg.can("reports.moderate") && (idea.openReports > 0 || idea.flagged) && (
                <SpotlightCard className="card" spotlightColor="rgba(239, 68, 68, 0.22)">
                  <div className="row between wrap gap-s">
                    <div className="row gap-s">
                      <Badge kind="danger">
                        <ShieldAlert size={12} /> {idea.openReports > 0 ? `${idea.openReports} open report${idea.openReports > 1 ? "s" : ""}` : "Flagged idea"}
                      </Badge>
                    </div>
                    <ShimmerButton to="/app/mod-ideas" size="sm" variant="danger">
                      Queue &rarr;
                    </ShimmerButton>
                  </div>
                  <p className="small muted mt-s">This idea has pending community reports or compliance flags that require moderator review.</p>
                </SpotlightCard>
              )}
            </div>
          </div>

          {modal === "review" && <ReviewModal idea={idea} onClose={() => setModal(null)} />}
          {modal === "assign" && <AssignModal idea={idea} onClose={() => setModal(null)} />}
          {modal === "report-idea" && <ReportModal targetType="idea" target={id} label="idea" onClose={() => setModal(null)} />}
          {modal?.report && <ReportModal targetType="feedback" target={modal.report._id} label="feedback" onClose={() => setModal(null)} />}
          {modal?.dispute && (
            <Modal open onClose={() => { setModal(null); setReason(""); }} title="Dispute this evaluation" width={500}
              footer={<><Button variant="outline" onClick={() => setModal(null)}>Cancel</Button><Button disabled={reason.trim().length < 10} onClick={async () => { const ok = await act(() => api.post(`/feedback/${modal.dispute._id}/dispute`, { reason }), "Dispute sent – the evaluator will re-evaluate"); if (ok) { setModal(null); setReason(""); } }}>Submit dispute</Button></>}>
              <p className="muted small mb">Explain what the evaluator missed. They will be asked to re-evaluate and respond.</p>
              <Field label="Your reason"><textarea className="input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. The scorecard ignored our existing partnership…" /></Field>
            </Modal>)}
        </>
      );
    }}</Async>
  );
}
