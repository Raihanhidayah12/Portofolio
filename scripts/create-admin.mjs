/**
 * Creates a Supabase Auth user and admin profile row.
 *
 * Requires in .env:
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (Settings → API Keys → secret key)
 *
 * Optional:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME
 *
 * Usage: npm run create-admin
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { hashPassword } from "./password-hash.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

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
const supabaseUrl =
  env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(`
Missing configuration in .env:

  VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=sb_secret_...   (or legacy service_role JWT)

Get the secret key from Supabase Dashboard → Project Settings → API Keys → Secret key.
Never commit this key or expose it in the frontend.
`);
  process.exit(1);
}

const email = env.ADMIN_EMAIL;
const password = env.ADMIN_PASSWORD || `Admin@${randomBytes(10).toString("hex")}`;
const username = env.ADMIN_USERNAME || "admin";

if (!email) {
  console.error(`
Set ADMIN_EMAIL in .env before running, for example:

  ADMIN_EMAIL=you@example.com
  ADMIN_PASSWORD=YourSecurePassword123!
  ADMIN_USERNAME=admin
`);
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existing } = await admin
  .from("profiles")
  .select("id, username")
  .eq("username", username)
  .maybeSingle();

if (existing) {
  console.error(`Profile with username "${username}" already exists (id: ${existing.id}).`);
  process.exit(1);
}

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
const passwordHash = hashPassword(password);

const { error: profileError } = await admin.from("profiles").insert({
  id: userId,
  username,
  role: "admin",
  gmail: email,
  password: passwordHash,
});

if (profileError) {
  console.error("Auth user created but profile insert failed:", profileError.message);
  console.error(`
Run this in Supabase SQL Editor (replace if needed):

  INSERT INTO public.profiles (id, username, role, gmail, password)
  VALUES ('${userId}', '${username}', 'admin', '${email}', '${passwordHash.replace(/'/g, "''")}');
`);
  process.exit(1);
}

console.log(`
Admin account created successfully.

  Email:    ${email}
  Password: ${password}
  Username: ${username}
  User ID:  ${userId}

Login at: /login

If login still fails, run supabase/policies-profiles.sql in the SQL Editor.
`);
