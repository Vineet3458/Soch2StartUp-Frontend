import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Flag, Gavel, HandHeart, MessageSquare, Pencil, RefreshCw, Scale, Send, Trash2, UserPlus, Users, Video, Star } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { act, useLive } from "../lib/live.js";
import { fmtDate, fmtDateTime } from "../lib/format.js";
import { Alert, Async, Avatar, Badge, Button, Card, Empty, Field, Modal, Progress, StatusBadge, confirmDialog } from "../components/ui.jsx";
import { AssignModal, FeedbackItem, ReportBody, ReportModal, ReviewModal } from "../components/idea.jsx";

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
          <button className="btn btn-ghost btn-sm" onClick={() => nav(-1)} style={{ marginBottom: 10 }}><ArrowLeft size={16} /> Back</button>
          <div className="page-head">
            <div>
              <div className="row wrap gap-s" style={{ marginBottom: 8 }}><StatusBadge value={idea.status} /><Badge kind="primary">{idea.industry}</Badge>{idea.flagged && <Badge kind="danger"><Flag size={12} /> Flagged</Badge>}{idea.pendingMentorRequest && <Badge kind="warning">Mentor requested</Badge>}</div>
              <h1>{idea.title}</h1>
              <p>By <b>{idea.user?.name}</b> · {fmtDate(idea.createdAt)} · Budget {idea.budget} · Team {idea.teamSize}</p>
            </div>
            <div className="row wrap no-print">
              {owner && ["draft", "changes_requested"].includes(idea.status) && <Button icon={Pencil} onClick={() => nav(`/app/validate?edit=${id}`)}>Edit {idea.status === "changes_requested" && "& resubmit"}</Button>}
              {owner && idea.status !== "draft" && <Button variant="outline" icon={RefreshCw} onClick={() => act(() => api.post(`/ideas/${id}/reanalyze`), "Report regenerated")}>Re-analyse</Button>}
              {owner && idea.status !== "draft" && !hasMentor && !idea.pendingMentorRequest && cfg.feature("mentorRequests") && <Button variant="outline" icon={HandHeart} onClick={async () => { const note = await confirmDialog({ title: "Request a mentor", message: "Tell the admins what help you need. They will match you with a verified mentor.", input: true, confirmText: "Send request", placeholder: "e.g. Go-to-market and pricing advice…" }); if (note !== null) act(() => api.post(`/ideas/${id}/mentor-request`, { note }), "Request sent to admins"); }}>Request mentor</Button>}
              {cfg.can("ideas.review") && idea.status !== "draft" && <Button icon={Gavel} onClick={() => setModal("review")}>Review</Button>}
              {cfg.can("ideas.assign") && idea.status !== "draft" && <Button variant="outline" icon={UserPlus} onClick={() => setModal("assign")}>Assign</Button>}
              {staffPick && <Button icon={HandHeart} onClick={() => act(() => api.post(`/ideas/${id}/claim`), "Idea added to your queue")}>Claim to {user.role === "mentor" ? "mentor" : "evaluate"}</Button>}
              {myEval && <Button icon={Star} onClick={() => nav(`/app/evaluate?idea=${id}`)}>Evaluate</Button>}
              {!owner && idea.status !== "draft" && cfg.feature("moderation") && <Button variant="ghost" icon={Flag} onClick={() => setModal("report-idea")}>Report</Button>}
              {(owner || cfg.can("ideas.delete")) && <Button variant="ghost" icon={Trash2} onClick={async () => { if (await confirmDialog({ title: "Delete idea?", message: "This cannot be undone.", confirmText: "Delete", danger: true })) { await act(() => api.delete(`/ideas/${id}`), "Idea deleted"); nav("/app/ideas"); } }} aria-label="Delete idea" />}
            </div>
          </div>

          {idea.reviewNote && ["rejected", "changes_requested", "archived"].includes(idea.status) && <div className="mb"><Alert kind={idea.status === "rejected" ? "error" : "warning"}><b>{idea.status === "changes_requested" ? "Changes requested" : idea.status === "rejected" ? "Not approved" : "Removed"}:</b> {idea.reviewNote}{idea.reviewedBy && <span className="faint"> — {idea.reviewedBy.name}</span>}</Alert></div>}
          {idea.status === "approved" && <div className="mb"><Alert kind="success">🎉 Approved{idea.reviewNote && <>: {idea.reviewNote}</>}</Alert></div>}

          <div className="grid g-main">
            <div className="col gap-l">
              <Card title="The idea"><p className="pre muted">{idea.description}</p></Card>
              <ReportBody idea={idea} />
              <Card title={`Feedback & evaluations (${idea.feedback.length})`} icon={MessageSquare}>
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
              <Card title="Team" icon={Users} sub={idea.assignments?.length || 0}>
                {!idea.assignments?.length ? <p className="muted small">No mentor or evaluator assigned yet.</p> :
                  <div className="list">{idea.assignments.map((a) => <div className="list-item" key={a._id}><Avatar name={a.assignee?.name} size={34} /><div className="grow"><b className="small">{a.assignee?.name}</b><div className="tiny faint">{a.kind === "mentor" ? "Mentor" : "Evaluator"}{a.reEval && " · re-evaluation"}</div></div><StatusBadge value={a.stage} label={a.stage.replace("_", " ")} /></div>)}</div>}
              </Card>
              {cfg.feature("sessions") && (
                <Card title="Mentoring sessions" icon={Calendar} sub={idea.sessions?.length || 0}>
                  {!idea.sessions?.length ? <p className="muted small">No sessions scheduled.</p> :
                    <div className="list">{idea.sessions.map((s) => <div className="list-item" key={s._id}><div className="notif-ico"><Video size={16} /></div><div className="grow"><b className="small">{s.title}</b><div className="tiny faint">{fmtDateTime(s.scheduledAt)} · {s.durationMin} min · {s.mentor?.name}</div></div><Badge kind={s.status}>{s.status}</Badge></div>)}</div>}
                </Card>)}
              {idea.roadmap?.length > 0 && (
                <Card title="MVP roadmap" icon={Flag} sub={`${done}/${idea.roadmap.length}`}>
                  <Progress value={(done / idea.roadmap.length) * 100} />
                  <div className="list mt-s">{idea.roadmap.map((m) => <div className="list-item" key={m._id}><div className="grow small">{m.title}</div><Badge kind={m.status === "done" ? "success" : m.status === "doing" ? "warning" : "draft"}>{m.status}</Badge></div>)}</div>
                </Card>)}
              {cfg.can("reports.moderate") && idea.openReports > 0 && <Card><Badge kind="danger">{idea.openReports} open report(s)</Badge><p className="small muted mt-s">Resolve them in the <Link to="/app/mod-ideas">moderation queue</Link>.</p></Card>}
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
