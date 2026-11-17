import { useMemo, useState } from "react";
import { Download, History, ScrollText } from "lucide-react";
import { useLive } from "../lib/live.js";
import { ago, csvDownload, fmtDateTime, roleLabel } from "../lib/format.js";
import { Async, Badge, Button, Card, Empty, PageHeader, SearchBox, Tabs } from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";

export default function LogsView({ kind }) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("all");
  const logs = useLive("/logs", { params: { kind, limit: 300 } });
  const list = logs.data || [];
  const rows = useMemo(() => list.filter((l) => (level === "all" || l.level === level) && (!q || `${l.action} ${l.message} ${l.actorName} ${l.target}`.toLowerCase().includes(q.toLowerCase()))), [list, level, q]);
  const sys = kind === "system";
  return (
    <>
      <PageHeader title={sys ? "System logs" : "Audit & activity"} subtitle={sys ? "Server events, integration results and errors. New entries stream in live." : "A tamper-evident trail of who did what. New entries stream in live."}>
        <Button variant="outline" icon={Download} onClick={() => csvDownload(`${kind}-logs.csv`, rows.map((l) => ({ time: l.createdAt, level: l.level, actor: l.actorName || "system", action: l.action, target: l.target, message: l.message })))}>Export CSV</Button>
      </PageHeader>
      <div className="toolbar"><SearchBox value={q} onChange={setQ} placeholder="Search action, user or message…" />
        {sys && <Tabs value={level} onChange={setLevel} tabs={["all", "info", "warn", "error"].map((id) => ({ id, label: id === "all" ? "All" : id, count: id === "all" ? list.length : list.filter((l) => l.level === id).length }))} />}</div>
      <Card className="pad0"><Async q={logs}>{() => <DataTable pageSize={15} rows={rows} empty={<Empty icon={sys ? ScrollText : History} title="No log entries match" />} columns={[
        { key: "createdAt", label: "Time", render: (l) => <div><div>{ago(l.createdAt)}</div><div className="tiny faint">{fmtDateTime(l.createdAt)}</div></div> },
        ...(sys ? [{ key: "level", label: "Level", render: (l) => <Badge kind={l.level === "error" ? "danger" : l.level === "warn" ? "warning" : "info"}>{l.level}</Badge> }] : []),
        { key: "actorName", label: "Actor", hideM: true, render: (l) => l.actorName ? <div><b>{l.actorName}</b><div className="tiny faint">{roleLabel(l.actorRole)}</div></div> : <span className="faint">system</span> },
        { key: "action", label: "Action", render: (l) => <code style={{ color: "var(--accent)" }}>{l.action}</code> },
        { key: "target", label: "Target / details", sortable: false, render: (l) => <div className="small"><b>{l.target}</b><div className="muted">{l.message}</div></div> },
      ]} />}</Async></Card>
    </>
  );
}
