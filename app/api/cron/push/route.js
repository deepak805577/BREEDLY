import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

webpush.setVapidDetails(
  "mailto:contact@breedly.com",
  process.env.NEXT_PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

export async function GET(req) {
  try {
    // 0. Vercel Security Check
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get current time in HH:MM format
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMins = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${currentHours}:${currentMins}`;

    // 2. Fetch all dogs
    const { data: dogs, error: dogError } = await supabase.from("dogs").select("*");
    if (dogError) throw dogError;

    // 3. Find notifications that need to be sent right now
    const pushPromises = [];

    for (const dog of dogs) {
      let pushMessage = null;

      // Check Meals
      const meals = dog.meals || [];
      const dueMeal = meals.find(m => m.reminder && m.time === timeString);
      if (dueMeal) pushMessage = { title: `Time to feed ${dog.name}!`, body: `${dueMeal.label} is scheduled now.` };

      // Check Daily Routines
      const routines = (dog.checklist || {}).daily_routine || [];
      const dueRoutine = routines.find(r => r.reminder && r.time === timeString);
      if (dueRoutine) pushMessage = { title: `Activity for ${dog.name}!`, body: `${dueRoutine.label} is scheduled now.` };

      // 8 PM Nag (20:00)
      if (timeString === "20:00") {
        const d = new Date();
        const mk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const checks = (dog.checklist || {})[mk] || {};
        
        // Count unchecked
        let total = 0;
        let done = 0;
        if (dog.checklist && dog.checklist.items) { // fallback
           // simplistic check for MVP cron
        }
      }

      if (pushMessage) {
        // Fetch subscriptions for this user
        const { data: subs } = await supabase
          .from("push_subscriptions")
          .select("*")
          .eq("user_id", dog.user_id);

        if (subs && subs.length > 0) {
          for (const sub of subs) {
            const pushConfig = {
              endpoint: sub.endpoint,
              keys: { auth: sub.auth, p256dh: sub.p256dh }
            };
            pushPromises.push(
              webpush.sendNotification(pushConfig, JSON.stringify(pushMessage))
                .catch(err => {
                  if (err.statusCode === 410) { // Unsubscribed
                    supabase.from("push_subscriptions").delete().eq("id", sub.id).then();
                  }
                })
            );
          }
        }
      }
    }

    await Promise.all(pushPromises);
    return NextResponse.json({ success: true, sent: pushPromises.length });

  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
