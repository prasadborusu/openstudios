const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || "";
    if (value.trim().startsWith('"') && value.trim().endsWith('"')) {
      value = value.trim().slice(1, -1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tables = [
  "product_subscriptions",
  "email_list",
  "user_subscribers",
  "subscribers_data",
  "notify_list"
];

async function run() {
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .limit(1);

    if (error) {
      console.log(`Table '${table}' query error:`, error.message);
    } else {
      console.log(`Success! Table '${table}' exists!`);
    }
  }
}

run();
