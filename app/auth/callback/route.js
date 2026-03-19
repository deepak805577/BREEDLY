// app/auth/callback/route.js
// Supabase redirects here after Google OAuth and email confirmation.
// This route exchanges the code for a session and redirects to /community.

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to community after successful auth
  return NextResponse.redirect(`${requestUrl.origin}/community`);
}
