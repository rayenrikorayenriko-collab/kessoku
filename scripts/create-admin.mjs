#!/usr/bin/env node
/**
 * Kessoku Family (KSF) — Admin bootstrap
 * ---------------------------------------------------------------------------
 * Creates (or updates) the first admin account so you can sign in at /admin.
 *
 * Usage:
 *   1. Fill SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL and ADMIN_PASSWORD in `.env.local`
 *      (the service_role key is SERVER-ONLY and must never reach the browser).
 *   2. Run:  npm run admin:create
 *
 * The service_role key is used here only, from your own machine/CI. It is never
 * bundled into the frontend build because this file lives outside of `src/`.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/** Minimal .env.local / .env loader (no extra dependency needed). */
function loadEnvFile(file) {
  const path = resolve(root, file);
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

if (!url) fail("NEXT_PUBLIC_SUPABASE_URL belum diisi di .env.local");
if (!serviceRoleKey)
  fail("SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local (server-only)");
if (!email) fail("ADMIN_EMAIL belum diisi di .env.local");
if (!password) fail("ADMIN_PASSWORD belum diisi di .env.local");

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log(`\n→ Membuat / memperbarui akun admin: ${email}`);

  // Try to create the user first.
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (createError) {
    // If it already exists, just reset the password instead of failing.
    if (/already|exists|registered/i.test(createError.message)) {
      const { data: list, error: listError } = await admin.auth.admin.listUsers();
      if (listError) fail(listError.message);
      const existing = list.users.find((u) => u.email === email);
      if (!existing) fail(`Akun ${email} tidak ditemukan untuk direset.`);
      const { error: updateError } = await admin.auth.admin.updateUserById(
        existing.id,
        { password }
      );
      if (updateError) fail(updateError.message);
      console.log(`✔ Password akun ${email} berhasil diperbarui.`);
      return;
    }
    fail(createError.message);
  }

  console.log(`✔ Akun admin ${email} berhasil dibuat.`);
  console.log("  Buka /admin untuk masuk, lalu ganti password dari menu Ganti Password.\n");
}

main().catch((error) => fail(error?.message ?? String(error)));
