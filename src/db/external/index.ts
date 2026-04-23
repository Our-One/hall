// Tables NOT owned by Hall but queried by Hall in the shared Neon DB.
// These tables are managed (created, migrated) by other Our.one repos —
// Hall mirrors their schema definitions for type-safe queries only.
//
// Auth tables: managed by Our-One/our-one (the marketing site).
//
// IMPORTANT: keep these schema definitions in sync with the source-of-truth
// repo. If columns change there, change them here too.
export * from "./auth";
