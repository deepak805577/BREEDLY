"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // sign out from Supabase
      localStorage.removeItem("username"); // clear stored username
      localStorage.removeItem("token"); // optional, if you saved token
      alert("✅ Logged out successfully!");
      router.push("/login"); // redirect to login
    } catch (err) {
      console.error(err);
      alert("Logout failed!");
    }
  };

  return (
    <button
      className="btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
