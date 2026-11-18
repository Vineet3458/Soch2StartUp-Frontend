// Crisp vector version of the Soch2Startup "S" mark (Vercel-style)
export function BrandMark({ size = 38 }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="10" fill="var(--text)" />
      <path d="M31.5 13.5H19.2c-3.1 0-5.2 2-5.2 4.7 0 2.4 1.5 3.8 4.6 4.6l8 2c1.3.3 1.9.8 1.9 1.6 0 1-.9 1.7-2.4 1.7H14.5l-1.7 4.4h15.6c4 0 6.6-2.1 6.6-5.4 0-2.7-1.7-4.2-5-5l-7.6-1.9c-1.2-.3-1.7-.7-1.7-1.4 0-.8.8-1.4 2.1-1.4h12.7l1.5-4.3z" fill="var(--bg)" />
    </svg>
  );
}

export function BrandName({ name = "Soch2Startup" }) {
  const m = name.match(/^(.*?)(\d)(.*)$/);
  return <span className="brand-name">{m ? <>{m[1]}<b>{m[2]}</b>{m[3]}</> : name}</span>;
}
