require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles:user_id ( username, avatar_url, full_name ),
      posts:post_id ( id, content )
    `)
    .limit(1);
    
  if (error) {
    console.error("Fetch Error:", error);
  } else {
    console.log("Success:", data);
  }
}
test();
