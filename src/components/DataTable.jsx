import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Empty } from "./ui.jsx";

// Generic sortable, paginated table.  columns: [{ key, label, render?, sort?: (row)=>value, align?, hideM? }]
export default function DataTable({ columns, rows, pageSize = 10, empty, onRowClick, rowKey = "_id" }) {
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(0);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const val = (r) => (col.sort ? col.sort(r) : r[col.key]);
    return [...rows].sort((a, b) => { const x = val(a), y = val(b); const c = typeof x === "number" ? x - y : String(x ?? "").localeCompare(String(y ?? "")); return sort.dir === "asc" ? c : -c; });
  }, [rows, sort, columns]);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const cur = Math.min(page, pages - 1);
  const slice = sorted.slice(cur * pageSize, cur * pageSize + pageSize);
  if (!rows.length) return empty || <Empty title="Nothing here yet" />;
  return (
    <>
      <div className="table-wrap">
        <table className="table">
          <thead><tr>{columns.map((c) => (
            <th key={c.key} className={c.hideM ? "hide-m" : ""} style={{ textAlign: c.align || "left", cursor: c.sortable === false ? "default" : "pointer" }}
              onClick={() => c.sortable !== false && setSort((s) => (s?.key === c.key ? (s.dir === "asc" ? { key: c.key, dir: "desc" } : null) : { key: c.key, dir: "asc" }))}>
              {c.label}{sort?.key === c.key && (sort.dir === "asc" ? <ArrowUp size={12} style={{ marginLeft: 4 }} /> : <ArrowDown size={12} style={{ marginLeft: 4 }} />)}
            </th>))}</tr></thead>
          <tbody>
            {slice.map((r, i) => (
              <tr key={r[rowKey] || i} style={{ cursor: onRowClick ? "pointer" : "default", animationDelay: `${i * 25}ms` }} onClick={() => onRowClick?.(r)}>
                {columns.map((c) => <td key={c.key} className={c.hideM ? "hide-m" : ""} style={{ textAlign: c.align || "left" }}>{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="row between" style={{ padding: "12px 16px" }}>
          <span className="small muted">{cur * pageSize + 1}–{Math.min(sorted.length, (cur + 1) * pageSize)} of {sorted.length}</span>
          <div className="row gap-s">
            <button className="icon-btn" disabled={cur === 0} onClick={() => setPage(cur - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
            <span className="small">Page {cur + 1} / {pages}</span>
            <button className="icon-btn" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}
