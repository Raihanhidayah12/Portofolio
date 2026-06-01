/**
 * Replaces the admin account: removes old "admin" user(s), creates fresh Auth user + profile.
 * profiles.password stores scrypt hash; login uses Supabase Auth (hashed in auth.users).
 *
 * Requires .env: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *                 ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME
 *
 * Usage: npm run reset-admin
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

const email = env.ADMIN_EMAIL;
const password = env.ADMIN_PASSWORD;
const username = env.ADMIN_USERNAME || "admin";

if (!supabaseUrl || !serviceRoleKey || !email || !password) {
  console.error("Set VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD in .env");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: profileRow } = await admin
  .from("profiles")
  .select("id, username")
  .eq("username", username)
  .maybeSingle();

if (profileRow) {
  const { error: delErr } = await admin.auth.admin.deleteUser(profileRow.id);
  if (delErr) console.warn("Delete existing admin auth user:", delErr.message);
  else console.log(`Removed previous admin (id: ${profileRow.id})`);
}

const { data: authList } = await admin.auth.admin.listUsers({ perPage: 200 });
for (const u of authList?.users || []) {
  if (u.email === email && u.id !== profileRow?.id) {
    await admin.auth.admin.deleteUser(u.id);
    console.log(`Removed duplicate auth user: ${email}`);
  }
}

const passwordHash = hashPassword(password);

const { data: authData, error: authError } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (authError) {
  console.error("Failed to create auth user:", authError.message);
  process.exit(1);
}

const userId = authData.user.id;

const { error: profileError } = await admin.from("profiles").insert({
  id: userId,
  username,
  role: "admin",
  gmail: email,
  password: passwordHash,
});

if (profileError) {
  console.error("Profile insert failed:", profileError.message);
  console.error("Auth user exists — fix profile manually or delete user in Dashboard.");
  process.exit(1);
}

console.log(`
Admin account ready.

  Email:    ${email}
  Password: (use plain password at /login — stored hashed in profiles.password)
  Username: ${username}
  User ID:  ${userId}

  profiles.password (hash): ${passwordHash.slice(0, 48)}...
`);
