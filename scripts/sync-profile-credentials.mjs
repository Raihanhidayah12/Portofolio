/**
 * Syncs gmail + password on profiles from Auth email and .env ADMIN_PASSWORD.
 * Run after: supabase/add-profiles-gmail-password.sql
 *
 * Usage: npm run sync-profile-credentials
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { hashPassword } from "./password-hash.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const path = resolve(root, ".env");
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith("#"))
      .map((line) => {
        const i = line.indexOf("=");
        return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
      })
  );
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const adminPassword = env.ADMIN_PASSWORD;
const adminEmail = env.ADMIN_EMAIL;

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: profiles, error: listError } = await admin
  .from("profiles")
  .select("id, username, role, gmail, password");

if (listError) {
  if (listError.message.includes("gmail") || listError.code === "42703") {
    console.error(`
Kolom gmail/password belum ada. Jalankan dulu di Supabase SQL Editor:
  supabase/add-profiles-gmail-password.sql
`);
  }
  console.error("Failed to list profiles:", listError.message);
  process.exit(1);
}

const { data: authList, error: authError } = await admin.auth.admin.listUsers();
if (authError) {
  console.error("Failed to list auth users:", authError.message);
  process.exit(1);
}

const emailById = Object.fromEntries(
  (authList.users || []).map((u) => [u.id, u.email])
);

for (const profile of profiles || []) {
  const gmail = emailById[profile.id] || adminEmail || null;
  const password =
    profile.role === "admin" && adminPassword
      ? hashPassword(adminPassword)
      : profile.password;

  const { error: updateError } = await admin
    .from("profiles")
    .update({ gmail, password })
    .eq("id", profile.id);

  if (updateError) {
    console.error(`Update failed for ${profile.username}:`, updateError.message);
    process.exit(1);
  }
  console.log(`Updated ${profile.username}: gmail=${gmail}`);
}

console.log("\nDone. Refresh Table Editor → profiles.");
