import { Suspense }     from "react";
import { AuthGuard }   from "../components/auth";
import { UserProfile } from "../components/profile";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div style={{ padding: 24, textAlign: "center", color: "var(--accent-dark)", fontFamily: "var(--font-body)", fontSize: 14 }}>Loading profile...</div>}>
        <UserProfile />
      </Suspense>
    </AuthGuard>
  );
}
