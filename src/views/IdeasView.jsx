import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, Lightbulb, Pencil, Plus, Scale, Trash2, UserPlus, Gavel } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { act, useLive } from "../lib/live.js";
import { fmtDate } from "../lib/format.js";
import { Async, Badge, Button, Card, Empty, PageHeader, SearchBox, SkeletonGrid, StatusBadge, Tabs, VerdictBadge, confirmDialog } from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";
import { AssignModal, IdeaCard, ReviewModal } from "../components/idea.jsx";
import { FlipWords, ShimmerButton, SpotlightCard } from "../components/aceternity/index.js";

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
      <PageHeader
        title="My Ideas"
        subtitle={
          <>
            Everything you have submitted, drafted and validated &bull;{" "}
            <FlipWords
              words={[
                "AI validation reports",
                "real-time review status",
                "expert mentor feedback",
                "head-to-head comparison",
              ]}
              duration={2800}
            />
          </>
        }
      >
        {picked.length === 2 && cfg.feature("compareIdeas") && <Button variant="outline" icon={Scale} onClick={() => nav(`/app/compare?a=${picked[0]}&b=${picked[1]}`)}>Compare selected</Button>}
        <ShimmerButton variant="shimmer" size="sm" onClick={() => nav("/app/validate")}><Plus size={15} style={{ marginRight: 6 }} /> New idea</ShimmerButton>
      </PageHeader>
      <div className="grid g4 mb">
        <SpotlightCard className="founder-stat-mini card" spotlightColor="rgba(168, 85, 247, 0.18)">
          <div><div className="lbl">Total Ideas</div><div className="val">{list.length}</div></div>
          <Badge kind="primary">Portfolio</Badge>
        </SpotlightCard>
        <SpotlightCard className="founder-stat-mini card" spotlightColor="rgba(34, 197, 94, 0.18)">
          <div><div className="lbl">Validated & Approved</div><div className="val">{count("validated")}</div></div>
          <Badge kind="success">Approved</Badge>
        </SpotlightCard>
        <SpotlightCard className="founder-stat-mini card" spotlightColor="rgba(245, 166, 35, 0.18)">
          <div><div className="lbl">Awaiting Review</div><div className="val">{count("submitted")}</div></div>
          <Badge kind="warning">Pending</Badge>
        </SpotlightCard>
        <SpotlightCard className="founder-stat-mini card" spotlightColor="rgba(6, 182, 212, 0.18)">
          <div><div className="lbl">Drafts & Edits</div><div className="val">{count("drafts") + count("changes")}</div></div>
          <span className="tiny faint mono">WIP</span>
        </SpotlightCard>
      </div>
      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Search your ideas…" />
        <Tabs value={tab} onChange={(t) => setSp(t === "all" ? {} : { f: t })} tabs={[["all", "All"], ["drafts", "Drafts"], ["submitted", "Submitted"], ["validated", "Validated"], ["changes", "Needs changes"]].map(([id, label]) => ({ id, label, count: count(id) }))} />
      </div>
      <Async q={ideas} skeleton={<SkeletonGrid n={3} h={260} cols="g3" />}>
        {() => !filtered.length ? (
          <Empty icon={Lightbulb} title={list.length ? "No ideas match" : "No ideas yet"}>
            {list.length ? "Try a different filter." : "Validate your first startup idea to see it here."}
            <div className="mt"><ShimmerButton size="md" variant="shimmer" onClick={() => nav("/app/validate")}><Plus size={15} style={{ marginRight: 6 }} /> Validate an idea</ShimmerButton></div>
          </Empty>
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
      <div className="grid g4 mb">
        <SpotlightCard className="admin-stat-mini card" spotlightColor="rgba(249, 115, 22, 0.18)">
          <div><div className="lbl">Awaiting Review</div><div className="val">{count("review")}</div></div>
          <Badge kind="warning">Pending</Badge>
        </SpotlightCard>
        <SpotlightCard className="admin-stat-mini card" spotlightColor="rgba(34, 197, 94, 0.18)">
          <div><div className="lbl">Approved</div><div className="val">{count("approved")}</div></div>
          <Badge kind="success">Approved</Badge>
        </SpotlightCard>
        <SpotlightCard className="admin-stat-mini card" spotlightColor="rgba(234, 179, 8, 0.18)">
          <div><div className="lbl">Needs Changes</div><div className="val">{count("changes")}</div></div>
          <Badge kind="warning">Changes</Badge>
        </SpotlightCard>
        <SpotlightCard className="admin-stat-mini card" spotlightColor="rgba(168, 85, 247, 0.18)">
          <div><div className="lbl">Total Submissions</div><div className="val">{list.length}</div></div>
          <span className="tiny faint mono">Ideas</span>
        </SpotlightCard>
      </div>
      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Search by title, founder or industry…" />
        <select className="input" value={industry} onChange={(e) => setIndustry(e.target.value)}><option value="">All industries</option>{industries.map((x) => <option key={x}>{x}</option>)}</select>
      </div>
      <div className="mb"><Tabs value={tab} onChange={(t) => setSp(t === "all" ? {} : { s: t })} tabs={[["all", "All"], ["review", "Pending review"], ["approved", "Approved"], ["changes", "Changes requested"], ["rejected", "Rejected"], ["archived", "Archived"]].map(([id, label]) => ({ id, label, count: count(id) }))} /></div>
      <Card className="pad0" spotlight>
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
      </Card>
      {review && <ReviewModal idea={review} onClose={() => setReview(null)} />}
      {assign && <AssignModal idea={assign} onClose={() => setAssign(null)} />}
    </>
  );
}
