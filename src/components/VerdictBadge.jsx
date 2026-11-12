export default function VerdictBadge({ verdict }) {
  return <span className={`badge badge-${verdict}`}>{verdict}</span>;
}
