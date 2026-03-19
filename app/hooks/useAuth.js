export { useAuth } from "../context/AuthContext";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // or "next/router" for Pages Router
import { useAuth } from "../context/AuthContext";

/**
 * Redirect unauthenticated users to /login.
 * Use at the top of any protected page component.
 *
 * @example
 * export default function CommunityPage() {
 *   useRequireAuth();
 *   return <CommunityFeed />;
 * }
 */
export function useRequireAuth(redirectTo = "/login") {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace(redirectTo);
    }
  }, [isLoggedIn, isLoading, redirectTo, router]);

  return { isLoading };
}
