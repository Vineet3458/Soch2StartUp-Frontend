import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, Lightbulb, Pencil, Plus, Scale, Trash2, UserPlus, Gavel } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { act, useLive } from "../lib/live.js";
import { fmtDate } from "../lib/format.js";
import { Async, Badge, Button, Empty, PageHeader, SearchBox, SkeletonGrid, StatusBadge, Tabs, VerdictBadge, confirmDialog } from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";
import { AssignModal, IdeaCard, ReviewModal } from "../components/idea.jsx";

const FOUNDER_TABS = { all: null, drafts: ["draft"], submitted: ["submitted", "under_review"], validated: ["approved"], changes: ["changes_requested"] };
const ADMIN_TABS = { all: null, review: ["submitted", "under_review"], approved: ["approved"], rejected: ["rejected"], changes: ["changes_requested"], archived: ["archived"] };

export default function IdeasView() {
  const { user } = useAuth();
  return user.role === "entrepreneur" ? <FounderIdeas /> : <AdminIdeas />;
}

function FounderIdeas() {
  const nav = useNavigate();
  const cfg = useConfig();
  const [sp, setSp] = useSearchParams();
  const tab = sp.get("f") && FOUNDER_TABS[sp.get("f")] !== undefined ? sp.get("f") : "all";
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState([]);
  const ideas = useLive("/ideas");
  const list = ideas.data || [];
  const filtered = useMemo(() => list.filter((i) => (!FOUNDER_TABS[tab] || FOUNDER_TABS[tab].includes(i.status)) && (!q || (i.title + i.description + i.industry).toLowerCase().includes(q.toLowerCase()))), [list, tab, q]);
  const count = (k) => (FOUNDER_TABS[k] ? list.filter((i) => FOUNDER_TABS[k].includes(i.status)).length : list.length);
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 2 ? [p[1], id] : [...p, id]));
  const del = async (i) => { if (await confirmDialog({ title: "Delete idea?", message: `"${i.title}" and its feedback will be permanently removed.`, confirmText: "Delete", danger: true })) { await act(() => api.delete(`/ideas/${i._id}`), "Idea deleted"); setPicked((p) => p.filter((x) => x !== i._id)); } };

  return (
    <>
      <PageHeader title="My Ideas" subtitle="Everything you have submitted, drafted and validated — updated live as admins, mentors and experts respond.">
        {picked.length === 2 && cfg.feature("compareIdeas") && <Button variant="outline" icon={Scale} onClick={() => nav(`/app/compare?a=${picked[0]}&b=${picked[1]}`)}>Compare selected</Button>}
        <Button icon={Plus} onClick={() => nav("/app/validate")}>New idea</Button>
      </PageHeader>
      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Search your ideas…" />
        <Tabs value={tab} onChange={(t) => setSp(t === "all" ? {} : { f: t })} tabs={[["all", "All"], ["drafts", "Drafts"], ["submitted", "Submitted"], ["validated", "Validated"], ["changes", "Needs changes"]].map(([id, label]) => ({ id, label, count: count(id) }))} />
      </div>
      <Async q={ideas} skeleton={<SkeletonGrid n={3} h={260} cols="g3" />}>
        {() => !filtered.length ? (
          <Empty icon={Lightbulb} title={list.length ? "No ideas match" : "No ideas yet"}>{list.length ? "Try a different filter." : "Validate your first startup idea to see it here."}<div className="mt"><Link to="/app/validate" className="btn">Validate an idea</Link></div></Empty>
        ) : (
          <div className="grid g-auto stagger">
            {filtered.map((i) => (
              <IdeaCard key={i._id} idea={i} selected={picked.includes(i._id)} onSelect={cfg.feature("compareIdeas") ? toggle : undefined}
                actions={<>
                  <Button size="sm" variant="outline" icon={Eye} onClick={() => nav(`/app/ideas/${i._id}`)}>Open</Button>
                  {["draft", "changes_requested"].includes(i.status) && <Button size="sm" variant="outline" icon={Pencil} onClick={() => nav(`/app/validate?edit=${i._id}`)}>Edit</Button>}
                  <Button size="sm" variant="ghost" icon={Trash2} onClick={() => del(i)} aria-label="Delete" />
                </>} />))}
          </div>)}
      </Async>
    </>
  );
}

function AdminIdeas() {
  const nav = useNavigate();
  const cfg = useConfig();
  const [sp, setSp] = useSearchParams();
  const tab = ADMIN_TABS[sp.get("s")] !== undefined && sp.get("s") ? sp.get("s") : "all";
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState("");
  const [review, setReview] = useState(null);
  const [assign, setAssign] = useState(null);
  const ideas = useLive("/ideas");
  const list = ideas.data || [];
  const rows = useMemo(() => list.filter((i) => (!ADMIN_TABS[tab] || ADMIN_TABS[tab].includes(i.status)) && (!industry || i.industry === industry) && (!q || (i.title + i.user?.name + i.industry).toLowerCase().includes(q.toLowerCase()))), [list, tab, industry, q]);
  const count = (k) => (ADMIN_TABS[k] ? list.filter((i) => ADMIN_TABS[k].includes(i.status)).length : list.length);
  const del = async (i) => { if (await confirmDialog({ title: "Delete idea?", message: `"${i.title}" will be removed with all feedback and assignments.`, confirmText: "Delete", danger: true })) await act(() => api.delete(`/ideas/${i._id}`), "Idea deleted"); };
  const industries = [...new Set(list.map((i) => i.industry))];
  const live = (live, d) => (cfg.can(live) ? d : null);

  return (
    <>
      <PageHeader title="Startup Ideas" subtitle="Review, assign and manage every submitted idea. Decisions notify founders instantly." />
      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Search by title, founder or industry…" />
        <select className="input" value={industry} onChange={(e) => setIndustry(e.target.value)}><option value="">All industries</option>{industries.map((x) => <option key={x}>{x}</option>)}</select>
      </div>
      <div className="mb"><Tabs value={tab} onChange={(t) => setSp(t === "all" ? {} : { s: t })} tabs={[["all", "All"], ["review", "Pending review"], ["approved", "Approved"], ["changes", "Changes requested"], ["rejected", "Rejected"], ["archived", "Archived"]].map(([id, label]) => ({ id, label, count: count(id) }))} /></div>
      <div className="card pad0">
        <Async q={ideas} skeleton={<div className="skeleton" style={{ height: 300 }} />}>
          {() => <DataTable rows={rows} empty={<Empty icon={Lightbulb} title="No ideas in this view" />} onRowClick={(i) => nav(`/app/ideas/${i._id}`)} columns={[
            { key: "title", label: "Idea", render: (i) => <div><b>{i.title}</b><div className="tiny faint">{i.industry} · {fmtDate(i.createdAt)}</div></div> },
            { key: "user", label: "Founder", hideM: true, sort: (i) => i.user?.name, render: (i) => i.user?.name },
            { key: "score", label: "AI score", sort: (i) => i.report?.score ?? -1, render: (i) => i.report ? <span className="row gap-s"><b className="mono">{i.report.score}</b><VerdictBadge verdict={i.report.verdict} /></span> : "—" },
            { key: "expertScore", label: "Expert", hideM: true, sort: (i) => i.expertScore ?? -1, render: (i) => i.expertScore ?? "—" },
            { key: "status", label: "Status", render: (i) => <div className="row wrap gap-s"><StatusBadge value={i.status} />{i.flagged && <Badge kind="danger">Flagged</Badge>}</div> },
            { key: "team", label: "Team", hideM: true, sortable: false, render: (i) => i.assignments?.length ? <span className="small">{i.assignments.map((a) => a.assignee?.name?.split(" ")[0]).join(", ")}</span> : <span className="faint small">Unassigned</span> },
            { key: "actions", label: "", sortable: false, render: (i) => (
              <div className="actions" onClick={(e) => e.stopPropagation()}>
                {live("ideas.review", <Button size="sm" icon={Gavel} onClick={() => setReview(i)} disabled={i.status === "draft"}>Review</Button>)}
                {live("ideas.assign", <Button size="sm" variant="outline" icon={UserPlus} onClick={() => setAssign(i)}>Assign</Button>)}
                {live("ideas.delete", <Button size="sm" variant="ghost" icon={Trash2} onClick={() => del(i)} aria-label="Delete" />)}
              </div>) },
          ]} />}
        </Async>
      </div>
      {review && <ReviewModal idea={review} onClose={() => setReview(null)} />}
      {assign && <AssignModal idea={assign} onClose={() => setAssign(null)} />}
    </>
  );
}
