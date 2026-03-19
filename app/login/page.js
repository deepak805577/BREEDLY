"use client";
import { supabase } from '@/lib/supabase';
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);        // ADD THIS
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
    setLoading(true);                                    // ADD THIS

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      // Ensure profile exists (safe upsert with all fields)
      await supabase.from("profiles").upsert({
        id:           data.user.id,
        username:     data.user.user_metadata?.username || data.user.email.split("@")[0],
        full_name:    data.user.user_metadata?.full_name || "",
        avatar_url:   data.user.user_metadata?.avatar_url || "",
      }, { onConflict: 'id' });                         // FIXED: added onConflict

      // Your existing localStorage logic — unchanged
      localStorage.setItem("token", data.session.access_token);
      localStorage.setItem("username", data.user.email.split("@")[0]);

      // Your existing redirect logic — unchanged
     // Replace this:
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

// With this:
const { data: profile } = await supabase
  .from("profiles")
  .select("dog_name, primary_breed")
  .eq("id", data.user.id)
  .single();

const hasCompletedOnboarding = profile?.dog_name || profile?.primary_breed;

if (hasCompletedOnboarding) {
  router.replace("/");
} else {
  router.replace("/onboarding");
}

    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed");             // FIXED: show actual error
    } finally {
      setLoading(false);                                // ADD THIS
    }
  };

  /* ---------------- REGISTER ---------------- */
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
    // Step 1: Sign up with Supabase Auth
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

    // Step 2: Manually upsert profile as safety net
    // (in case the trigger hasn't fired yet)
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id:         data.user.id,
        username:   registerData.username.trim(),
        full_name:  "",
        avatar_url: "",
      }, { onConflict: "id" });

    // Log profile error but don't block — trigger may have already inserted
    if (profileError) console.warn("Profile upsert warning:", profileError.message);

   // Replace this:
alert("✅ Registered successfully! You can now login.");
setIsRegister(false);
setRegisterData({ username: "", email: "", password: "" });

// With this:
router.replace("/onboarding");

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

        {/* LOGIN FORM — only button changes */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
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

            {/* CHANGED: disabled + loading text */}
            <button className="btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p>or Login with social platforms</p>
            <div className="social-icons">
              <a href="#"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#"><i className="fa-brands fa-github"></i></a>
              <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
          </form>
        </div>

        {/* REGISTER FORM — only button changes */}
        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Register</h1>
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={registerData.username}
                onChange={(e) => handleChange(e, "register")}
                required
              />
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => handleChange(e, "register")}
                required
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => handleChange(e, "register")}
                required
              />
            </div>

            {/* CHANGED: disabled + loading text */}
            <button className="btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <p>or Register with social platforms</p>
            <div className="social-icons">
              <a href="#"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#"><i className="fa-brands fa-github"></i></a>
              <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
          </form>
        </div>

        {/* TOGGLE PANEL — completely unchanged */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Friend!</h1>
            <p>Don't have an account?</p>
            <button className="btn ghost" onClick={() => handleToggle("register")}>
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Login to continue</p>
            <button className="btn ghost" onClick={() => handleToggle("login")}>
              Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}