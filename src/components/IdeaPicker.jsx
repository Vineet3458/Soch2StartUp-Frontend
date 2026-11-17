import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLive } from "../lib/live.js";

// Shared "choose one of my ideas" control. The selection lives in the URL (?idea=) and the idea data is live.
export function useIdeaPicker({ needReport = false, statuses } = {}) {
  const q = useLive("/ideas");
  const [sp, setSp] = useSearchParams();
  const all = (q.data || []).filter((i) => (!needReport || i.report) && (!statuses || statuses.includes(i.status)));
  const selId = sp.get("idea");
  const cur = all.find((i) => i._id === selId) || all[0];
  useEffect(() => { if (cur && cur._id !== selId) setSp({ idea: cur._id }, { replace: true }); }, [cur?._id]);
  const picker = all.length > 0 && (
    <select className="input" style={{ maxWidth: 380 }} value={cur?._id || ""} onChange={(e) => setSp({ idea: e.target.value })} aria-label="Choose idea">
      {all.map((i) => <option key={i._id} value={i._id}>{i.title}</option>)}
    </select>
  );
  return { q, ideas: all, idea: cur, picker };
}
