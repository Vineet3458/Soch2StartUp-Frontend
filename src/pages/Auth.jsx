import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, Lock, Mail, Rocket, Award, Sparkles, User, Wrench } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import { errMsg } from "../api/client.js";
import { Alert, Button, Field } from "../components/ui.jsx";
import { BrandMark } from "../components/Brand.jsx";
import PublicNav from "../components/PublicNav.jsx";

const DEMO = [
  ["Founder", "entrepreneur@soch2startup.com", "Founder@123"], ["Mentor", "mentor@soch2startup.com", "Mentor@123"], ["Expert", "expert@soch2startup.com", "Expert@123"],
  ["Moderator", "moderator@soch2startup.com", "Moderator@123"], ["Admin", "admin@soch2startup.com", "Admin@12345"], ["Superadmin", "superadmin@soch2startup.com", "Admin@12345"],
];

function AuthLayout({ children }) {
  const cfg = useConfig();
  return (
    <>
      <div className="pub"><PublicNav /></div>
      <div className="auth-page">
        <div className="auth-art">
          <div style={{ height: 56 }} />
          <div>
            <img className="astro" src="/assets/founderverse/astronaut-laptop.png" alt="" />
            <div className="center" style={{ marginTop: 32 }}>
              <h2 style={{ fontSize: 30 }}><span className="grad-text">{cfg.platform.tagline}</span></h2>
              <p className="muted" style={{ marginTop: 10 }}>AI validation · expert evaluation · mentor guidance — all in one live workspace.</p>
            </div>
          </div>
          <div className="row gap-l" style={{ justifyContent: "center" }}>
            {["AI-scored reports", "Real-time updates", "Role-based workspaces"].map((t) => <span key={t} className="chip"><Sparkles size={13} color="var(--primary)" />{t}</span>)}
          </div>
        </div>
        <div className="auth-form-side">{children}</div>
      </div>
    </>
  );
}

export function Login() {
  const { login } = useAuth();
  const { platform } = useConfig();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    try { await login(form.email, form.password); nav(loc.state?.from || "/app", { replace: true }); }
    catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };
  return (
    <AuthLayout>
      <form className="card auth-card glow-border" onSubmit={submit}>
        <div className="row" style={{ marginBottom: 18 }}><BrandMark size={44} /><div><h2>Welcome back</h2><p className="muted small">Sign in to your {platform.name} workspace</p></div></div>
        {platform.maintenance?.enabled && <Alert kind="warning"><Wrench size={0} /> {platform.maintenance.message || "Platform under maintenance. Only admins can sign in."}</Alert>}
        {error && <Alert kind="error">{error}</Alert>}
        <div className="col" style={{ marginTop: 14 }}>
          <Field label="Email address"><div className="input-icon"><Mail size={17} /><input className="input" type="email" autoComplete="email" placeholder="you@domain.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div></Field>
          <Field label="Password"><div className="input-icon"><Lock size={17} /><input className="input" type={show ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: 44 }} />
            <button type="button" className="btn-ghost" style={{ position: "absolute", right: 8, top: 8, border: "none", borderRadius: 8, padding: 6, background: "none", color: "var(--faint)" }} onClick={() => setShow(!show)} aria-label="Toggle password visibility">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></Field>
          <Button loading={busy} className="full" type="submit">Sign in</Button>
        </div>
        <p className="muted center small mt">New here? <Link to="/register">Create an account</Link></p>
        <hr className="divider" />
        <div className="tiny faint center" style={{ marginBottom: 8 }}>DEMO ACCOUNTS · click to fill</div>
        <div className="row wrap" style={{ justifyContent: "center", gap: 6 }}>
          {DEMO.map(([l, e, p]) => <button type="button" key={l} className="demo-pill" onClick={() => setForm({ email: e, password: p })}>{l}</button>)}
        </div>
      </form>
    </AuthLayout>
  );
}

const ROLE_OPTS = [["entrepreneur", "Founder", Rocket], ["mentor", "Mentor", GraduationCap], ["industry_expert", "Expert", Award]];
export function Register() {
  const { register } = useAuth();
  const { platform } = useConfig();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "entrepreneur" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    try { await register(form); nav("/app", { replace: true }); } catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };
  const needsVerify = platform.requireVerification && form.role !== "entrepreneur";
  return (
    <AuthLayout>
      <form className="card auth-card glow-border" onSubmit={submit}>
        <div className="row" style={{ marginBottom: 18 }}><BrandMark size={44} /><div><h2>Create your account</h2><p className="muted small">Validate, mentor or evaluate startup ideas</p></div></div>
        {!platform.registrationOpen && <Alert kind="warning">Registration is currently closed by the administrator.</Alert>}
        {error && <Alert kind="error">{error}</Alert>}
        <div className="col" style={{ marginTop: 14 }}>
          <Field label="I am a"><div className="role-pick">{ROLE_OPTS.map(([v, l, I]) => <button type="button" key={v} className={`role-opt ${form.role === v ? "on" : ""}`} onClick={() => setForm({ ...form, role: v })}><I size={20} />{l}</button>)}</div></Field>
          {needsVerify && <div className="hint">Mentor and expert accounts are reviewed by an admin before they can give feedback.</div>}
          <Field label="Full name"><div className="input-icon"><User size={17} /><input className="input" placeholder="Aarav Patel" value={form.name} onChange={set("name")} required maxLength={80} /></div></Field>
          <Field label="Email address"><div className="input-icon"><Mail size={17} /><input className="input" type="email" placeholder="you@domain.com" value={form.email} onChange={set("email")} required /></div></Field>
          <Field label="Password" hint="At least 6 characters"><div className="input-icon"><Lock size={17} /><input className="input" type="password" minLength={6} placeholder="••••••••" value={form.password} onChange={set("password")} required /></div></Field>
          <Button loading={busy} className="full" type="submit" disabled={!platform.registrationOpen}>Create account</Button>
        </div>
        <p className="muted center small mt">Already registered? <Link to="/login">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
}
