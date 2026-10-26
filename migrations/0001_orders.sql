-- Breakfast orders. position orders the kitchen queue; staff can move plates up or down.
CREATE TABLE IF NOT EXISTS orders (
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
);

CREATE INDEX IF NOT EXISTS orders_status_position ON orders (status, position);
CREATE INDEX IF NOT EXISTS orders_created ON orders (created_at);
