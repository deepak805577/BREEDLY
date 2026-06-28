import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from("dogs")
    .select(`*`)
    .limit(1);
    
  if (error) {
    console.error("Fetch Error:", error.message, error.details, error.hint);
  } else {
    console.log("Success:", data);
  }
}
test();
