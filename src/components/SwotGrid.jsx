const BOXES = [
  { key: "strengths", title: "💪 Strengths", cls: "s" },
  { key: "weaknesses", title: "🔧 Weaknesses", cls: "w" },
  { key: "opportunities", title: "🌱 Opportunities", cls: "o" },
  { key: "threats", title: "⚡ Threats", cls: "t" },
];

export default function SwotGrid({ swot }) {
  return (
    <div className="grid grid-2">
      {BOXES.map((b) => (
        <div key={b.key} className={`swot swot-${b.cls}`}>
          <h4>{b.title}</h4>
          <ul>{swot[b.key]?.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
