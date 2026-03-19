import { AuthGuard }   from "../components/auth";
import { UserProfile } from "../components/profile";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <UserProfile />
    </AuthGuard>
  );
}
