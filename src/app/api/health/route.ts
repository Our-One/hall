import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getReadDb } from "@/db/client";

/**
 * GET /api/health — lightweight health check.
 * Verifies database connectivity. No auth required.
 */
export async function GET() {
  try {
    const db = getReadDb();
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "degraded" }, { status: 503 });
  }
}
