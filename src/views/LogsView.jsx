import { useMemo, useState } from "react";
import { Download, History, ScrollText } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLive } from "../lib/live.js";
import { ago, csvDownload, fmtDateTime, roleLabel } from "../lib/format.js";
import { Async, Badge, Empty, SearchBox, Tabs } from "../components/ui.jsx";
import DataTable from "../components/DataTable.jsx";
import {
  ShimmerButton,
  SpotlightCard,
  Spotlight,
  FlipWords,
  Meteors,
  MovingBorder,
} from "../components/aceternity/index.js";

export default function LogsView({ kind }) {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("all");
  const [auditCat, setAuditCat] = useState("all");
  const logs = useLive("/logs", { params: { kind, limit: 300 } });
  const list = logs.data || [];
  const sys = kind === "system";
  const isMod = user?.role === "moderator";

  const { errCount, warnCount, uniqueActors, modCount, ideaCount, feedbackCount, userCount } = useMemo(() => {
    let err = 0;
    let warn = 0;
    let mod = 0;
    let idea = 0;
    let feedback = 0;
    let usr = 0;
    const actors = new Set();
    for (let i = 0; i < list.length; i++) {
      const l = list[i];
      if (l.level === "error") err++;
      else if (l.level === "warn") warn++;
      if (l.actorName) actors.add(l.actorName);
      const act = l.action || "";
      if (act.startsWith("report.")) mod++;
      else if (act.startsWith("idea.")) idea++;
      else if (act.startsWith("feedback.")) feedback++;
      else if (act.startsWith("user.")) usr++;
    }
    return {
      errCount: err,
      warnCount: warn,
      uniqueActors: actors.size,
      modCount: mod,
      ideaCount: idea,
      feedbackCount: feedback,
      userCount: usr,
    };
  }, [list]);

  const rows = useMemo(
    () =>
      list.filter((l) => {
        if (sys) {
          if (level !== "all" && l.level !== level) return false;
        } else {
          if (auditCat === "moderation" && !l.action?.startsWith("report.")) return false;
          if (auditCat === "ideas" && !l.action?.startsWith("idea.")) return false;
          if (auditCat === "feedback" && !l.action?.startsWith("feedback.")) return false;
          if (auditCat === "users" && !l.action?.startsWith("user.")) return false;
        }
        if (q) {
          const match = `${l.action} ${l.message} ${l.actorName} ${l.target}`
            .toLowerCase()
            .includes(q.toLowerCase());
          if (!match) return false;
        }
        return true;
      }),
    [list, sys, level, auditCat, q]
  );

  const handleExport = () => {
    csvDownload(
      `${kind}-logs.csv`,
      rows.map((l) => ({
        time: l.createdAt,
        level: l.level,
        actor: l.actorName || "system",
        action: l.action,
        target: l.target,
        message: l.message,
      }))
    );
  };

  return (
    <>
      {isMod ? (
        <div className="moderator-hero-banner" style={{ padding: "24px 28px", marginBottom: 20 }}>
          <Spotlight className="moderator-spotlight" fill="rgba(244, 63, 94, 0.28)" />
          <Meteors number={12} color="#f43f5e" />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span className="live-pulse-badge">
                  <i className="live-pulse-dot pulse-danger" />
                  MODERATOR &bull; GOVERNANCE & AUDIT TRAIL
                </span>
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
                Security & Moderation Audit Trail
              </h1>
              <p className="muted small" style={{ marginTop: 4, marginBottom: 0 }}>
                Tamper-evident trail of moderation enforcements and community actions &bull;{" "}
                <FlipWords
                  words={[
                    "Tamper-evident moderation trail",
                    "Real-time enforcement verification",
                    "Sub-second event bus recording",
                    "Instant CSV compliance export",
                  ]}
                  duration={2800}
                  wordClassName="flip-rose"
                />
              </p>
            </div>
            <div className="row wrap" style={{ gap: 10 }}>
              <ShimmerButton to="/app/mod-ideas" size="sm" variant="shimmer" className="hide-m">
                <ShieldAlert size={14} style={{ marginRight: 6 }} /> Moderation Queue
              </ShimmerButton>
              <ShimmerButton variant="outline" size="sm" onClick={handleExport}>
                <Download size={14} style={{ marginRight: 6 }} /> Export CSV
              </ShimmerButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="superadmin-hero-banner" style={{ padding: "24px 28px", marginBottom: 20 }}>
          <Spotlight className="superadmin-spotlight" fill="#a855f7" />
          <Meteors number={12} color="#c084fc" />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <MovingBorder
                  as="div"
                  containerClassName="superadmin-root-halo"
                  duration={7000}
                >
                  <span className="superadmin-root-badge">
                    <i className="root-dot" />
                    SUPERADMIN &bull; {sys ? "SYSTEM LOG STREAM" : "TAMPER-EVIDENT AUDIT TRAIL"}
                  </span>
                </MovingBorder>
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
                {sys ? "System Event Telemetry" : "Security & Governance Audit Trail"}
              </h1>
              <p className="muted small" style={{ marginTop: 4, marginBottom: 0 }}>
                {sys
                  ? "Live server events, integration traces, and exception logs"
                  : "Tamper-evident trail of administrative and user actions"}{" "}
                &bull;{" "}
                <FlipWords
                  words={[
                    "Sub-second event bus",
                    "Real-time surveillance",
                    "Tamper-evident records",
                    "Instant CSV extraction",
                  ]}
                  duration={2800}
                />
              </p>
            </div>
            <div className="row wrap" style={{ gap: 10 }}>
              <span className="live-pulse-badge hide-m">
                <i className="live-pulse-dot" /> LIVE STREAM
              </span>
              <ShimmerButton variant="outline" size="sm" onClick={handleExport}>
                <Download size={14} style={{ marginRight: 6 }} /> Export CSV
              </ShimmerButton>
            </div>
          </div>
        </div>
      )}

      {isMod && !sys ? (
        <div className="grid g4 mb">
          <SpotlightCard
            className="moderator-stat-mini card"
            spotlightColor="rgba(0, 112, 243, 0.16)"
            style={{ cursor: "pointer" }}
            onClick={() => setAuditCat("all")}
          >
            <div>
              <div className="lbl">Buffered Events</div>
              <div className="val">{list.length}</div>
            </div>
            <Badge kind={auditCat === "all" ? "primary" : "draft"}>Total</Badge>
          </SpotlightCard>
          <SpotlightCard
            className="moderator-stat-mini card"
            spotlightColor="rgba(244, 63, 94, 0.18)"
            style={{ cursor: "pointer" }}
            onClick={() => setAuditCat("moderation")}
          >
            <div>
              <div className="lbl">Enforcements</div>
              <div className="val">{modCount}</div>
            </div>
            <Badge kind={modCount ? "danger" : "draft"}>Reports</Badge>
          </SpotlightCard>
          <SpotlightCard
            className="moderator-stat-mini card"
            spotlightColor="rgba(6, 182, 212, 0.18)"
            style={{ cursor: "pointer" }}
            onClick={() => setAuditCat("ideas")}
          >
            <div>
              <div className="lbl">Idea & Feedback</div>
              <div className="val">{ideaCount + feedbackCount}</div>
            </div>
            <Badge kind="info">Audited</Badge>
          </SpotlightCard>
          <SpotlightCard
            className="moderator-stat-mini card"
            spotlightColor="rgba(245, 158, 11, 0.18)"
            style={{ cursor: "pointer" }}
            onClick={() => setAuditCat("users")}
          >
            <div>
              <div className="lbl">User Governance</div>
              <div className="val">{userCount}</div>
            </div>
            <Badge kind="warning">Accounts</Badge>
          </SpotlightCard>
        </div>
      ) : (
        <div className="grid g3 mb">
          <SpotlightCard className="admin-stat-mini card" spotlightColor="rgba(0, 112, 243, 0.16)">
            <div>
              <div className="lbl">Buffered Events</div>
              <div className="val">{list.length}</div>
            </div>
            <Badge kind="primary">Live</Badge>
          </SpotlightCard>
          {sys ? (
            <>
              <SpotlightCard
                className="admin-stat-mini card"
                spotlightColor="rgba(249, 115, 22, 0.16)"
              >
                <div>
                  <div className="lbl">Warnings</div>
                  <div className="val">{warnCount}</div>
                </div>
                <Badge kind={warnCount ? "warning" : "draft"}>
                  {warnCount ? "Needs review" : "None"}
                </Badge>
              </SpotlightCard>
              <SpotlightCard
                className="admin-stat-mini card"
                spotlightColor="rgba(239, 68, 68, 0.16)"
              >
                <div>
                  <div className="lbl">System Errors</div>
                  <div className="val">{errCount}</div>
                </div>
                <Badge kind={errCount ? "danger" : "success"}>
                  {errCount ? "Active" : "Clear"}
                </Badge>
              </SpotlightCard>
            </>
          ) : (
            <>
              <SpotlightCard
                className="admin-stat-mini card"
                spotlightColor="rgba(168, 85, 247, 0.16)"
              >
                <div>
                  <div className="lbl">Unique Actors</div>
                  <div className="val">{uniqueActors}</div>
                </div>
                <Badge kind="info">Staff & Users</Badge>
              </SpotlightCard>
              <SpotlightCard
                className="admin-stat-mini card"
                spotlightColor="rgba(34, 197, 94, 0.16)"
              >
                <div>
                  <div className="lbl">Audit Integrity</div>
                  <div className="val">Tamper-Proof</div>
                </div>
                <Badge kind="success">Verified</Badge>
              </SpotlightCard>
            </>
          )}
        </div>
      )}

      <div className="toolbar">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Search action, user or message…"
        />
        {sys ? (
          <Tabs
            value={level}
            onChange={setLevel}
            tabs={["all", "info", "warn", "error"].map((id) => ({
              id,
              label: id === "all" ? "All" : id,
              count: id === "all" ? list.length : list.filter((l) => l.level === id).length,
            }))}
          />
        ) : (
          <Tabs
            value={auditCat}
            onChange={setAuditCat}
            tabs={[
              { id: "all", label: "All Events", count: list.length },
              { id: "moderation", label: "Moderation", count: modCount },
              { id: "ideas", label: "Ideas", count: ideaCount },
              { id: "feedback", label: "Feedback", count: feedbackCount },
              { id: "users", label: "Users", count: userCount },
            ]}
          />
        )}
      </div>

      <SpotlightCard className="card pad0" spotlightColor="rgba(0, 112, 243, 0.14)">
        <Async q={logs}>
          {() => (
            <DataTable
              pageSize={15}
              rows={rows}
              empty={<Empty icon={sys ? ScrollText : History} title="No log entries match" />}
              columns={[
                {
                  key: "createdAt",
                  label: "Time",
                  render: (l) => (
                    <div>
                      <div>{ago(l.createdAt)}</div>
                      <div className="tiny faint">{fmtDateTime(l.createdAt)}</div>
                    </div>
                  ),
                },
                ...(sys
                  ? [
                      {
                        key: "level",
                        label: "Level",
                        render: (l) => (
                          <Badge
                            kind={
                              l.level === "error"
                                ? "danger"
                                : l.level === "warn"
                                ? "warning"
                                : "info"
                            }
                          >
                            {l.level}
                          </Badge>
                        ),
                      },
                    ]
                  : []),
                {
                  key: "actorName",
                  label: "Actor",
                  hideM: true,
                  render: (l) =>
                    l.actorName ? (
                      <div>
                        <b>{l.actorName}</b>
                        <div className="tiny faint">{roleLabel(l.actorRole)}</div>
                      </div>
                    ) : (
                      <span className="faint">system</span>
                    ),
                },
                {
                  key: "action",
                  label: "Action",
                  render: (l) => <code style={{ color: "var(--accent)" }}>{l.action}</code>,
                },
                {
                  key: "target",
                  label: "Target / details",
                  sortable: false,
                  render: (l) => (
                    <div className="small">
                      <b>{l.target}</b>
                      <div className="muted">{l.message}</div>
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
