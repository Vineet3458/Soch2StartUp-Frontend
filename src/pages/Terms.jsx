import { Link } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";
import PublicNav from "../components/PublicNav.jsx";
import { useConfig } from "../context/ConfigContext.jsx";

export default function Terms() {
  const { platform } = useConfig();
  const name = platform?.name || "Soch2Startup";

  return (
    <div className="pub">
      <PublicNav />
      <div className="container" style={{ maxWidth: 840, margin: "40px auto 80px", padding: "0 20px" }}>
        <Link to="/" className="row gap-s small muted mb" style={{ display: "inline-flex", alignItems: "center" }}>
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="card" style={{ padding: "36px 32px" }}>
          <div className="row gap-m" style={{ alignItems: "center", marginBottom: 24 }}>
            <div className="ico g-cyan" style={{ width: 44, height: 44 }}>
              <Scale size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: 28, margin: 0 }}>Terms of Service</h1>
              <p className="muted small" style={{ margin: "4px 0 0" }}>
                Effective Date: November 19, 2026 · User Agreement & Acceptable Use Policy
              </p>
            </div>
          </div>

          <div className="col gap-l" style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>1. Acceptance of Terms</h2>
              <p>
                By creating an account or accessing {name}, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use or access the platform.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>2. User Roles & Account Responsibilities</h2>
              <ul style={{ paddingLeft: 20 }}>
                <li><strong>Account Confidentiality:</strong> You are responsible for safeguarding your login credentials and ensuring all passwords meet strength requirements.</li>
                <li><strong>Role Verification:</strong> Accounts registered as Mentors or Industry Experts are subject to administrative verification prior to being granted advisory privileges.</li>
                <li><strong>Accurate Information:</strong> Users must provide factual and genuine information regarding startup ideas, professional credentials, and identity.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>3. Intellectual Property & Confidentiality</h2>
              <p>
                Entrepreneurs retain 100% full intellectual property ownership of the ideas, business models, and pitch materials submitted to {name}. Mentors and Experts agree to evaluate submissions with professional integrity and confidentiality.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>4. AI-Generated Insights Disclaimer</h2>
              <p>
                The validation reports, SWOT models, market analyses, and financial projections produced by our AI council are automated advisory tools. They do not constitute formal investment, legal, or financial advice. Founders should independently verify key market signals before allocating capital.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>5. Acceptable Use Policy</h2>
              <p>Users must not:</p>
              <ul style={{ paddingLeft: 20 }}>
                <li>Submit misleading, fraudulent, offensive, or infringing intellectual content.</li>
                <li>Attempt to bypass rate limiters, reverse engineer AI prompts, or abuse automated analysis endpoints.</li>
                <li>Transmit malicious payloads, stored scripts, or invalid URL schemes into session or resource links.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>6. Account Termination & Erasure</h2>
              <p>
                We reserve the right to suspend or block accounts violating platform rules. Users may terminate their accounts and exercise their right to data erasure at any time via self-service deletion in profile settings.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>7. Contact & Support</h2>
              <p>
                Questions regarding these Terms should be directed to:
              </p>
              <div className="card" style={{ background: "var(--bg-subtle)", padding: 16, marginTop: 8 }}>
                <p style={{ margin: 0 }}><strong>Support Team:</strong> Legal & Platform Operations</p>
                <p style={{ margin: "4px 0 0" }}><strong>Email:</strong> {platform?.supportEmail || "support@soch2startup.com"}</p>
                <p style={{ margin: "4px 0 0" }}><strong>Platform:</strong> {name}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
