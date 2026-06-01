import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

console.log(`
Tabel profiles masih kosong = skrip SQL belum jalan ATAU user Auth belum dibuat.

=== Cara termudah (Dashboard) ===

1) Authentication → Users → Add user
   Email:    admin@portfolio.admin
   Password: Portfolio@Admin2026
   Centang:  Auto Confirm User
   → Salin "User UID"

2) SQL Editor → buka file:
   supabase/setup-admin-dashboard.sql
   → Ganti USER_ID_DI_BAWAH dengan UUID tadi → Run

3) Table Editor → profiles → harus ada 1 baris (role: admin)

4) Login: http://localhost:5173/login

File SQL: ${resolve(root, "supabase/setup-admin-dashboard.sql")}
`);
