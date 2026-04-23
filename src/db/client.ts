import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as ownedSchema from "./schema";
import * as externalSchema from "./external";

const fullSchema = { ...ownedSchema, ...externalSchema };
type FullSchema = typeof fullSchema;

let _db: NeonHttpDatabase<FullSchema> | null = null;
let _readDb: NeonHttpDatabase<FullSchema> | null = null;

export function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  _db = drizzle(neon(url), { schema: fullSchema });
  return _db;
}

export function getReadDb() {
  if (_readDb) return _readDb;
  const url = process.env.DATABASE_READ_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  _readDb = drizzle(neon(url), { schema: fullSchema });
  return _readDb;
}

export type Database = NeonHttpDatabase<FullSchema>;
