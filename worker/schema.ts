// The orders table. The Worker creates it on first use, so a fresh D1 database needs no setup.
// position orders the kitchen queue; staff can move plates up or down.
import type { D1Database } from '@cloudflare/workers-types';

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at INTEGER NOT NULL,
    name TEXT NOT NULL,
    room TEXT NOT NULL,
    egg TEXT NOT NULL,
    egg_count INTEGER NOT NULL,
    addons TEXT NOT NULL DEFAULT '[]',
    sides TEXT NOT NULL DEFAULT '[]',
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done')),
    position INTEGER NOT NULL,
    done_at INTEGER
  )`,
  'CREATE INDEX IF NOT EXISTS orders_status_position ON orders (status, position)',
  'CREATE INDEX IF NOT EXISTS orders_created ON orders (created_at)',
];

let ready: Promise<unknown> | undefined;

export function ensureSchema(db: D1Database) {
  ready ??= db.batch(STATEMENTS.map((s) => db.prepare(s))).catch((err) => {
    ready = undefined;
    throw err;
  });
  return ready;
}
