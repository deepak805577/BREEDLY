"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) loadProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles").select("id, full_name, initials, avatar_url, avatar_color, primary_breed, bio, username, dog_name, dog_age, dog_photo_url, role")
        .eq("id", userId)
        .single();
      
      if (error) {
        console.error("Error loading profile:", error.message);
        // Fallback: If 'role' column doesn't exist, the query will fail.
        // We set an empty profile object so it's not null, preventing infinite loading.
        setProfile({ id: userId, role: "user" }); 
      } else if (data) {
        setProfile(data);
      } else {
        setProfile({ id: userId, role: "user" });
      }
    } catch (e) {
      console.error("Unexpected error in loadProfile:", e);
      setProfile({ id: userId, role: "user" });
    }
  }

  async function signUp({ email, password, fullName }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function updateProfile(updates) {
    if (!session?.user) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session.user.id);
    if (error) throw error;
    setProfile(prev => ({ ...prev, ...updates }));
  }

  const value = {
    session,
    user:        session?.user ?? null,
    profile,
    isLoading:   session === undefined,
    isLoggedIn:  !!session?.user,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    reloadProfile: () => session?.user && loadProfile(session.user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
