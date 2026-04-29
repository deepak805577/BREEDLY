import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req) {
  try {
    const body = await req.json();
    const { subscription, user_id } = body;

    if (!subscription || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert or update the push subscription in the database
    const { error } = await supabase.from("push_subscriptions").upsert({
      user_id: user_id,
      endpoint: subscription.endpoint,
      auth: subscription.keys.auth,
      p256dh: subscription.keys.p256dh,
      created_at: new Date()
    }, { onConflict: "endpoint" }); // Ensure endpoint is unique

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscription error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
