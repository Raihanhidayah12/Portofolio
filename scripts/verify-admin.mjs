import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(resolve(root, ".env"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const email = env.ADMIN_EMAIL || "admin@portfolio.admin";
const password = env.ADMIN_PASSWORD || "Portfolio@Admin2026";

const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

const { data: auth, error: authErr } = await sb.auth.signInWithPassword({
  email,
  password,
});
if (authErr) {
  console.error("LOGIN GAGAL:", authErr.message);
  console.error("\nJalankan supabase/CREATE-ADMIN-NOW.sql di SQL Editor Supabase dulu.");
  process.exit(1);
}

const { data: profile, error: profErr } = await sb
  .from("profiles")
  .select("role, username")
  .eq("id", auth.user.id)
  .single();

if (profErr || profile?.role !== "admin") {
  console.error("PROFILE ADMIN TIDAK ADA:", profErr?.message || profile);
  process.exit(1);
}

console.log("OK — Admin siap login & upload.");
console.log("  Email:", email);
console.log("  User ID:", auth.user.id);
console.log("  Role:", profile.role);
