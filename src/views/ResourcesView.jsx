import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bookmark, BookmarkCheck, FileText, Megaphone, Pencil, Pin, Plus, Trash2 } from "lucide-react";
import api from "../api/client.js";
import { useConfig } from "../context/ConfigContext.jsx";
import { act, useLive } from "../lib/live.js";
import { ago, roleLabel } from "../lib/format.js";
import { Async, Badge, Button, Card, Empty, Field, Modal, PageHeader, SearchBox, Tabs, confirmDialog } from "../components/ui.jsx";

const KINDS = [["all", "All"], ["guideline", "Guidelines"], ["template", "Templates"], ["playbook", "Playbooks"], ["announcement", "Announcements"], ["article", "Articles"]];
const ROLES = ["entrepreneur", "mentor", "industry_expert", "moderator", "admin"];
const blank = { title: "", kind: "guideline", category: "General", summary: "", body: "", audience: [], pinned: false };

export default function ResourcesView() {
  const cfg = useConfig();
  const [sp, setSp] = useSearchParams();
  const saved = sp.get("saved") === "1";
  const kind = saved ? "all" : sp.get("kind") === "template" ? "template" : KINDS.some(([k]) => k === sp.get("kind")) ? sp.get("kind") : "all";
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null); // resource being read
  const [edit, setEdit] = useState(null); // form
  const res = useLive("/resources");
  const manager = cfg.can("resources.manage");
  const list = res.data || [];
  const rows = useMemo(() => list.filter((r) => (saved ? r.saved : kind === "all" || r.kind === kind) && (!q || (r.title + r.summary + r.category).toLowerCase().includes(q.toLowerCase()))), [list, saved, kind, q]);
  const toggle = (r, e) => { e.stopPropagation(); act(() => api.post(`/resources/${r._id}/save`), r.saved ? "Removed from saved" : "Saved to your library"); };

  return (
    <>
      <PageHeader title={saved ? "Saved resources" : "Resource hub"} subtitle="Guidelines, templates, playbooks and announcements. New content appears here instantly.">
        {manager && <Button icon={Plus} onClick={() => setEdit({ ...blank, kind: kind === "all" ? "guideline" : kind })}>New resource</Button>}
      </PageHeader>
      <div className="toolbar"><SearchBox value={q} onChange={setQ} placeholder="Search resources…" />
        {!saved && <Tabs value={kind} onChange={(k) => setSp(k === "all" ? {} : { kind: k })} tabs={KINDS.map(([id, label]) => ({ id, label, count: id === "all" ? list.length : list.filter((r) => r.kind === id).length }))} />}</div>
      <Async q={res}>{() => !rows.length ? <Empty icon={saved ? Bookmark : FileText} title={saved ? "Nothing saved yet" : "No resources found"}>{saved ? "Bookmark resources to find them here." : "Try another category."}</Empty> : (
        <div className="grid g-auto stagger">{rows.map((r) => (
          <Card key={r._id} hover className="link" onClick={() => setOpen(r)}>
            <div className="row between"><div className="row wrap gap-s"><Badge kind={r.kind === "announcement" ? "warning" : "primary"}>{r.kind === "announcement" && <Megaphone size={12} />}{r.kind}</Badge><Badge>{r.category}</Badge>{r.pinned && <Pin size={14} color="var(--warning)" />}</div>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={(e) => toggle(r, e)} aria-label={r.saved ? "Unsave" : "Save"}>{r.saved ? <BookmarkCheck size={16} color="var(--primary)" /> : <Bookmark size={16} />}</button></div>
            <h3 style={{ margin: "12px 0 6px", fontSize: 17 }}>{r.title}</h3><p className="muted small" style={{ minHeight: 40 }}>{r.summary || r.body.slice(0, 110)}</p>
            <div className="row between tiny faint mt-s"><span>{r.authorName} · {ago(r.createdAt)}</span><span>{r.saveCount} saved</span></div>
            {manager && <div className="row mt-s" onClick={(e) => e.stopPropagation()}><Button size="sm" variant="outline" icon={Pencil} onClick={() => setEdit({ ...r })}>Edit</Button><Button size="sm" variant="ghost" icon={Trash2} aria-label="Delete" onClick={async () => { if (await confirmDialog({ title: "Delete resource?", message: r.title, danger: true, confirmText: "Delete" })) act(() => api.delete(`/resources/${r._id}`), "Resource deleted"); }} /></div>}
          </Card>))}</div>)}</Async>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open?.title} width={680}>
        {open && <><div className="row wrap gap-s mb"><Badge kind="primary">{open.kind}</Badge><Badge>{open.category}</Badge>{open.audience?.length > 0 && <Badge kind="info">For: {open.audience.map(roleLabel).join(", ")}</Badge>}</div><p className="pre">{open.body || open.summary}</p></>}
      </Modal>
      {edit && <ResourceForm init={edit} onClose={() => setEdit(null)} />}
    </>
  );
}

function ResourceForm({ init, onClose }) {
  const [f, setF] = useState(init);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const save = async () => { setBusy(true); const ok = await act(() => (f._id ? api.put(`/resources/${f._id}`, f) : api.post("/resources", f)), f._id ? "Resource updated" : "Resource published"); setBusy(false); if (ok) onClose(); };
  return (
    <Modal open onClose={onClose} title={f._id ? "Edit resource" : "New resource"} width={640} footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button loading={busy} disabled={!f.title.trim()} onClick={save}>{f._id ? "Save changes" : "Publish"}</Button></>}>
      <div className="col">
        <Field label="Title"><input className="input" value={f.title} onChange={set("title")} maxLength={140} /></Field>
        <div className="grid g2"><Field label="Type"><select className="input" value={f.kind} onChange={set("kind")}>{["guideline", "announcement", "template", "playbook", "article"].map((k) => <option key={k}>{k}</option>)}</select></Field><Field label="Category"><input className="input" value={f.category} onChange={set("category")} /></Field></div>
        <Field label="Summary"><input className="input" value={f.summary} onChange={set("summary")} maxLength={300} /></Field>
        <Field label="Content"><textarea className="input" style={{ minHeight: 140 }} value={f.body} onChange={set("body")} /></Field>
        <Field label="Visible to" hint="Leave empty to show to everyone. Announcements also notify the selected roles instantly.">
          <div className="row wrap">{ROLES.map((r) => <label key={r} className="chip chip-btn" style={{ cursor: "pointer" }}><input type="checkbox" className="check" checked={f.audience.includes(r)} onChange={(e) => setF({ ...f, audience: e.target.checked ? [...f.audience, r] : f.audience.filter((x) => x !== r) })} />{roleLabel(r)}</label>)}</div></Field>
        <label className="row small" style={{ cursor: "pointer" }}><input type="checkbox" className="check" checked={f.pinned} onChange={(e) => setF({ ...f, pinned: e.target.checked })} /> Pin to the top</label>
      </div>
    </Modal>
  );
}
