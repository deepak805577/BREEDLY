"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

/**
 * Drop-in auth page for BreedLy.
 * Handles sign-in, sign-up, and Google OAuth.
 *
 * Usage (Next.js App Router):
 *   // app/login/page.jsx
 *   import AuthPage from "@/components/auth/AuthPage";
 *   export default AuthPage;
 */
export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode]       = useState("signin"); // "signin" | "signup"
  const [form, setForm]       = useState({ fullName: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp({ email: form.email, password: form.password, fullName: form.fullName });
        setSuccess("Check your email for a confirmation link! 🐾");
      } else {
        await signIn({ email: form.email, password: form.password });
        // AuthContext + onAuthStateChange handles the rest
      }
    } catch (err) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');
        .auth-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-root {
          font-family: 'Nunito', sans-serif;
          min-height: 100vh;
          background: #FBF2F8;
          display: flex; align-items: center; justify-content: center;
          padding: 24px 16px;
        }
        .auth-input {
          width: 100%;
          border: 2px solid #EDD8F5;
          border-radius: 14px;
          padding: 12px 14px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 600;
          color: #2D2340; background: #FAF5FF;
          outline: none; transition: border-color 0.15s;
        }
        .auth-input:focus { border-color: #3B4FC8; }
        .auth-input::placeholder { color: #C4AED4; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-card { animation: fadeUp 0.35s ease forwards; }
      `}</style>

      <div className="auth-root">
        <div
          className="auth-card"
          style={{
            width: "100%", maxWidth: 420,
            background: "#fff",
            borderRadius: 28,
            border: "2px solid #EDD8F5",
            padding: "32px 28px 28px",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 64, height: 64, borderRadius: 20,
              background: "#3B4FC8", marginBottom: 12,
              fontSize: 30,
            }}>
              🐾
            </div>
            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 30, color: "#3B4FC8", lineHeight: 1 }}>
              BreedLy
            </div>
            <div style={{ fontSize: 13, color: "#9B8AAB", fontWeight: 600, marginTop: 4 }}>
              {mode === "signin" ? "Welcome back to the pack!" : "Join the dog-loving community"}
            </div>
          </div>

          {/* Mode toggle */}
          <div style={{
            display: "flex", background: "#F3EAF6",
            borderRadius: 16, padding: 4, marginBottom: 24,
          }}>
            {["signin", "signup"].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                style={{
                  flex: 1, padding: "9px 0",
                  borderRadius: 12, border: "none",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800, fontSize: 14, cursor: "pointer",
                  transition: "all 0.18s",
                  background: mode === m ? "#3B4FC8" : "transparent",
                  color: mode === m ? "#fff" : "#7B5EA7",
                }}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            style={{
              width: "100%", padding: "12px",
              background: "#fff", border: "2px solid #EDD8F5",
              borderRadius: 14, cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800, fontSize: 14, color: "#2D2340",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              marginBottom: 18, transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#3B4FC8"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#EDD8F5"}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: "#EDD8F5" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#C4AED4" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#EDD8F5" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "signup" && (
              <input
                className="auth-input"
                type="text"
                placeholder="Your name"
                value={form.fullName}
                onChange={set("fullName")}
                required
              />
            )}
            <input
              className="auth-input"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={set("email")}
              required
              autoComplete="email"
            />
            <div style={{ position: "relative" }}>
              <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={set("password")}
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                minLength={mode === "signup" ? 8 : undefined}
                style={{ paddingRight: 44 }}
              />
            </div>

            {mode === "signin" && (
              <div style={{ textAlign: "right" }}>
                <ForgotPassword />
              </div>
            )}

            {/* Feedback */}
            {error && (
              <div style={{
                background: "#FCEBEB", border: "1.5px solid #F7C1C1",
                borderRadius: 12, padding: "10px 14px",
                fontSize: 13, fontWeight: 700, color: "#A32D2D",
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                background: "#EAF3DE", border: "1.5px solid #C0DD97",
                borderRadius: 12, padding: "10px 14px",
                fontSize: 13, fontWeight: 700, color: "#3B6D11",
              }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading ? "#C5B0DF" : "#3B4FC8",
                color: "#fff", border: "none", borderRadius: 16,
                fontFamily: "'Fredoka One', cursive",
                fontSize: 18, cursor: loading ? "default" : "pointer",
                letterSpacing: "0.5px", marginTop: 4,
                transition: "opacity 0.15s, transform 0.1s",
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {loading
                ? "Please wait..."
                : mode === "signin" ? "Sign In 🐾" : "Join the Pack 🐶"
              }
            </button>
          </form>

          {mode === "signup" && (
            <p style={{ fontSize: 11, color: "#C4AED4", textAlign: "center", marginTop: 14, fontWeight: 600, lineHeight: 1.5 }}>
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function ForgotPassword() {
  const [sent, setSent]   = useState(false);
  const [open, setOpen]   = useState(false);
  const [email, setEmail] = useState("");
  const { } = useAuth();

  async function handleReset() {
    if (!email) return;
    const { supabase } = await import("../../../lib/supabase");
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSent(true);
  }

  if (!open) {
    return (
      <span
        onClick={() => setOpen(true)}
        style={{ fontSize: 12, fontWeight: 700, color: "#7B5EA7", cursor: "pointer", textDecoration: "underline" }}
      >
        Forgot password?
      </span>
    );
  }

  return (
    <div style={{ background: "#FAF5FF", borderRadius: 12, padding: "10px 12px", marginTop: 4 }}>
      {sent ? (
        <span style={{ fontSize: 12, fontWeight: 700, color: "#3B6D11" }}>Reset link sent! Check your inbox 📬</span>
      ) : (
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              flex: 1, border: "1.5px solid #EDD8F5", borderRadius: 10,
              padding: "6px 10px", fontSize: 12, fontFamily: "'Nunito', sans-serif",
              fontWeight: 600, outline: "none", background: "#fff",
            }}
          />
          <button
            onClick={handleReset}
            style={{
              background: "#3B4FC8", color: "#fff", border: "none",
              borderRadius: 10, padding: "6px 12px",
              fontSize: 12, fontWeight: 800, cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
