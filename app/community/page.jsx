// app/community/page.jsx
import { AuthGuard }     from "../components/auth";
import { CommunityFeed } from "../components/community";

export default function CommunityPage() {
  return (
    // AuthGuard shows AuthPage (sign-in/up) when user is logged out.
    // Shows a loading screen while the Supabase session is resolving.
    // Once logged in, renders CommunityFeed.
    <AuthGuard>
      <CommunityFeed />
    </AuthGuard>
  );
}
