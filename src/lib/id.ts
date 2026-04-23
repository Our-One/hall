import { ulid } from "ulidx";

/**
 * Generate a time-sortable unique ID (ULID).
 * ULIDs are lexicographically sortable, 128-bit, and avoid B-tree fragmentation
 * that random UUIDs cause at scale.
 */
export function generateId(): string {
  return ulid();
}
