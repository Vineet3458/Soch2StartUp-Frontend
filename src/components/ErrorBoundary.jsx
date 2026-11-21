import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem("token");
    } catch { /* ignore */ }
    window.location.href = "/login";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 20%, #171d2b 0%, #090c10 100%)",
          color: "#f1f5f9",
          padding: "24px",
          fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
        }}>
          <div style={{
            maxWidth: "520px",
            width: "100%",
            background: "rgba(22, 27, 34, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "36px",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)"
          }}>
            <div style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "9999px",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#f87171",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "16px",
              border: "1px solid rgba(239, 68, 68, 0.3)"
            }}>
              UI Component Notice
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px", color: "#ffffff" }}>
              Something went wrong
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
              An unexpected issue occurred while rendering this view.
              {this.state.error?.message && (
                <code style={{
                  display: "block",
                  marginTop: "10px",
                  padding: "8px 12px",
                  background: "rgba(0,0,0,0.4)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#fca5a5",
                  wordBreak: "break-word"
                }}>
                  {this.state.error.message}
                </code>
              )}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: "#4f46e5",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#cbd5e1",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
