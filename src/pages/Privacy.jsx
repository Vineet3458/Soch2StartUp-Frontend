import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import PublicNav from "../components/PublicNav.jsx";
import { useConfig } from "../context/ConfigContext.jsx";

export default function Privacy() {
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
            <div className="ico g-purple" style={{ width: 44, height: 44 }}>
              <Shield size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: 28, margin: 0 }}>Privacy Policy</h1>
              <p className="muted small" style={{ margin: "4px 0 0" }}>
                Effective Date: November 19, 2026 · Digital Personal Data Protection (DPDP) Act 2023 Compliant
              </p>
            </div>
          </div>

          <div className="col gap-l" style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>1. Introduction & Overview</h2>
              <p>
                Welcome to {name}. We are dedicated to respecting and protecting the privacy of all our users—entrepreneurs, mentors, industry experts, and administrators. This Privacy Policy details how we collect, process, store, and safeguard your personal data in accordance with the provisions of India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act).
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>2. Data We Collect</h2>
              <ul style={{ paddingLeft: 20 }}>
                <li><strong>Identity & Account Data:</strong> Full name, email address, password hash (salted using bcrypt), account role, and profile details.</li>
                <li><strong>Startup & Evaluation Data:</strong> Startup idea titles, descriptions, target industries, budgets, team sizes, AI analysis reports, mentor session notes, and evaluation rubrics.</li>
                <li><strong>Technical & Usage Data:</strong> Real-time event subscription tickets, IP addresses, browser user agent, session timestamps, and security audit logs.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>3. Purpose of Data Processing</h2>
              <p>Your data is processed strictly for legitimate uses:</p>
              <ul style={{ paddingLeft: 20 }}>
                <li>To provide automated AI-driven feasibility and market validation of startup concepts.</li>
                <li>To match founders with verified mentors and industry experts for collaborative feedback.</li>
                <li>To maintain platform security, prevent unauthorized access or abuse, and satisfy legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>4. Your Rights as a Data Principal (DPDP Act 2023)</h2>
              <p>Under Chapter III of the DPDP Act 2023, you hold the following rights regarding your digital personal data:</p>
              <ul style={{ paddingLeft: 20 }}>
                <li><strong>Right to Access:</strong> You may view all personal information and ideas stored in your account through your profile settings.</li>
                <li><strong>Right to Correction & Updating:</strong> You may update your profile details and preferences at any time.</li>
                <li><strong>Right to Erasure (Right to be Forgotten):</strong> You have the right to request deletion of your account and associated personal data. Initiating account deletion permanently removes your profile, ideas, and assignments.</li>
                <li><strong>Right to Grievance Redressal:</strong> You may register concerns with our designated Grievance Officer.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>5. Data Security Measures</h2>
              <p>
                We employ industry-standard administrative, physical, and technical defenses including bcrypt password hashing with DoS protection, HS256-locked JSON Web Tokens, strict Content Security Policy (CSP), rate limiting, and Server-Side Request Forgery (SSRF) filters.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>6. Data Retention & Erasure</h2>
              <p>
                Personal data is retained only for as long as necessary to fulfill the purposes for which it was collected or to comply with statutory legal requirements. Users can initiate immediate data erasure via account settings or through an API request to <code>DELETE /api/auth/me</code>.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, color: "var(--text)", marginBottom: 8 }}>7. Grievance Officer & Contact Information</h2>
              <p>
                In compliance with the DPDP Act 2023, our Grievance Officer may be reached at:
              </p>
              <div className="card" style={{ background: "var(--bg-subtle)", padding: 16, marginTop: 8 }}>
                <p style={{ margin: 0 }}><strong>Grievance Officer:</strong> Data Protection & Security Desk</p>
                <p style={{ margin: "4px 0 0" }}><strong>Email:</strong> {platform?.supportEmail || "privacy@soch2startup.com"}</p>
                <p style={{ margin: "4px 0 0" }}><strong>Platform:</strong> {name}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
