import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileBarChart, Printer } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLive } from "../lib/live.js";
import { fmtDate } from "../lib/format.js";
import { Async, Empty, PageHeader, SearchBox, VerdictBadge } from "../components/ui.jsx";
import { ReportBody } from "../components/idea.jsx";
import { ShimmerButton, SpotlightCard } from "../components/aceternity/index.js";

// Entrepreneurs see their own reports; admins see every validated idea. Both update live.
export default function ReportsView() {
  const { user } = useAuth();
  const q = useLive("/ideas");
  const [sel, setSel] = useState("");
  const [search, setSearch] = useState("");
  const ideas = useMemo(() => (q.data || []).filter((i) => i.report && (!search || (i.title + i.user?.name).toLowerCase().includes(search.toLowerCase()))).sort((a, b) => new Date(b.report.generatedAt) - new Date(a.report.generatedAt)), [q.data, search]);
  useEffect(() => { if (!sel && ideas.length) setSel(ideas[0]._id); }, [ideas, sel]);
  const cur = ideas.find((i) => i._id === sel) || ideas[0];
  const isAdmin = ["admin", "superadmin"].includes(user.role);

  return (
    <>
      <PageHeader title="Validation reports" subtitle={user.role === "entrepreneur" ? "Your AI-generated reports. Print any report as a PDF." : "AI validation reports for every submitted idea across the platform."}>
        {isAdmin && (
          <span className="live-pulse-badge hide-m" style={{ marginRight: 8 }}>
            <i className="live-pulse-dot" /> {ideas.length} PLATFORM REPORTS
          </span>
        )}
        {cur && (
          <ShimmerButton variant="outline" size="sm" onClick={() => window.print()} className="no-print">
            <Printer size={14} style={{ marginRight: 6 }} /> Print / PDF
          </ShimmerButton>
        )}
      </PageHeader>
      <Async q={q}>{() => !(q.data || []).some((i) => i.report) ? <Empty icon={FileBarChart} title="No reports yet">Validate an idea to generate your first report.<div className="mt"><Link to="/app/validate" className="btn">Validate an idea</Link></div></Empty> : (
        <div className="grid split">
          <SpotlightCard className="card tight no-print" spotlightColor="rgba(0, 112, 243, 0.16)" style={{ position: "sticky", top: 90 }}>
            <SearchBox value={search} onChange={setSearch} placeholder="Find a report…" />
            <div className="col mt-s" style={{ gap: 6, maxHeight: "65vh", overflowY: "auto" }}>
              {ideas.map((i) => (
                <button key={i._id} className={`nav-item ${cur?._id === i._id ? "active" : ""}`} style={{ alignItems: "flex-start", flexDirection: "column", gap: 4 }} onClick={() => setSel(i._id)}>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>{i.title}</span>
                  <span className="row small" style={{ gap: 8 }}><b className="mono">{i.report.score}</b><VerdictBadge verdict={i.report.verdict} /><span className="faint">{fmtDate(i.report.generatedAt)}</span></span>
                </button>))}
            </div>
          </SpotlightCard>
          <div>{cur && <ReportBody idea={cur} />}</div>
        </div>)}</Async>
    </>
  );
}
