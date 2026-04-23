import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getReadDb } from "@/db/client";

/**
 * GET /api/health — health + env diagnostics.
 *
 * Returns which required env vars are missing (by NAME only — names are not
 * secrets). Values are never exposed. DB error messages are redacted in
 * production because they may contain connection-string fragments.
 */
export async function GET() {
  const required = [
    "DATABASE_URL",
    "AUTH_SECRET",
    "AUTH_TRUST_HOST",
    "RESEND_API_KEY",
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "R2_PUBLIC_URL",
    "ADMIN_EMAILS",
  ];
  const envMissing = required.filter((k) => !process.env[k]);

  let dbStatus: "ok" | "degraded" = "degraded";
  let dbError: string | null = null;
  try {
    const db = getReadDb();
    await db.execute(sql`SELECT 1`);
    dbStatus = "ok";
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }

  const ok = dbStatus === "ok" && envMissing.length === 0;
  const showErrorDetail =
    process.env.NODE_ENV !== "production" ||
    process.env.VERCEL_ENV === "preview";

  return NextResponse.json(
    {
      status: ok ? "ok" : "degraded",
      db: dbStatus,
      // env var NAMES are safe to expose — they tell operators what to fix.
      envMissing,
      // error message may contain connection strings, so redact in prod.
      dbError: showErrorDetail ? dbError : dbError ? "[redacted — check Vercel logs]" : null,
    },
    { status: ok ? 200 : 503 },
  );
}
