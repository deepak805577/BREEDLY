"use client";
import { supabase } from '@/lib/supabase';
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./authPage.css";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleToggle = (type) => setIsRegister(type === "register");

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    formType === "login"
      ? setLoginData({ ...loginData, [name]: value })
      : setRegisterData({ ...registerData, [name]: value });
  };

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      // Ensure profile exists (only insert if it doesn't exist to avoid overwriting existing details)
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!existingProfile) {
        await supabase.from("profiles").insert({
          id:           data.user.id,
          username:     data.user.user_metadata?.username || data.user.email.split("@")[0],
          full_name:    data.user.user_metadata?.full_name || "",
          avatar_url:   data.user.user_metadata?.avatar_url || "",
        });
      }

      localStorage.setItem("token", data.session.access_token);
      localStorage.setItem("username", data.user.email.split("@")[0]);

      const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");
      const hasDog = localStorage.getItem("dogProfile");

      if (redirectAfterLogin) {
        router.replace(redirectAfterLogin);
      } else if (!hasDog) {
        router.replace("/");
      } else {
        router.replace("/");
      }

    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REGISTER ---------------- */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.username.trim().length < 3) {
      alert("Username must be at least 3 characters");
      return;
    }

    if (registerData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            username: registerData.username || "user"
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Signup failed — no user returned");

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id:         data.user.id,
          username:   registerData.username.trim(),
          full_name:  "",
          avatar_url: "",
        }, { onConflict: "id" });

      if (profileError) console.warn("Profile upsert warning:", profileError.message);

      alert("✅ Registered successfully! You can now login.");
      setIsRegister(false);
      setRegisterData({ username: "", email: "", password: "" }); // clear form

    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${isRegister ? "active" : ""}`}>
      <div className={`container ${isRegister ? "active" : ""}`}>

        {/* LOGIN FORM */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Welcome Back</h1>
            <p>Login to reconnect with the pack</p>
            
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={loginData.email}
                onChange={(e) => handleChange(e, "login")}
                required
              />
            </div>
            
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => handleChange(e, "login")}
                required
              />
            </div>
            
            <div className="forgot-link">
              <a href="#">Forgot password?</a>
            </div>

            <button className="btn" disabled={loading}>
              {loading ? (
                <>
                  <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                  Logging in...
                </>
              ) : "Login"}
            </button>

            <div className="social-title">or connect with</div>
            
            <div className="social-icons">
              <a href="#" aria-label="Login with Google">
                <GoogleIcon />
              </a>
              <a href="#" aria-label="Login with Facebook">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Login with Github">
                <GithubIcon />
              </a>
            </div>
          </form>
        </div>

        {/* REGISTER FORM */}
        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Join the Pack</h1>
            <p>Create an account to start your journey</p>
            
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Choose a Username"
                value={registerData.username}
                onChange={(e) => handleChange(e, "register")}
                required
              />
            </div>
            
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={registerData.email}
                onChange={(e) => handleChange(e, "register")}
                required
              />
            </div>
            
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Choose a Password"
                value={registerData.password}
                onChange={(e) => handleChange(e, "register")}
                required
              />
            </div>

            <button className="btn" disabled={loading}>
              {loading ? (
                <>
                  <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                  Creating Account...
                </>
              ) : "Create Account"}
            </button>

            <div className="social-title">or register with</div>
            
            <div className="social-icons">
              <a href="#" aria-label="Register with Google">
                <GoogleIcon />
              </a>
              <a href="#" aria-label="Register with Facebook">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Register with Github">
                <GithubIcon />
              </a>
            </div>
          </form>
        </div>

        {/* TOGGLE PANEL */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Friend!</h1>
            <p>Ready to start your canine adventure? Join us today.</p>
            <button className="btn ghost" onClick={() => handleToggle("register")}>
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Log in with your credentials to return to your dashboard.</p>
            <button className="btn ghost" onClick={() => handleToggle("login")}>
              Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── CUSTOM HIGH-FIDELITY VECTOR ICONS ─────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}