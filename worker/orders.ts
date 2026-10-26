// Breakfast order API.
//   POST  /api/orders          guests send a plate (public)
//   GET   /api/orders          the kitchen queue (staff)
//   PATCH /api/orders/:id      { status: 'done' | 'pending' } or { move: 'up' | 'down' } (staff)
//   POST  /api/orders/login    { password } -> staff cookie
//   POST  /api/orders/logout
import type { D1Database } from '@cloudflare/workers-types';
import { validateOrder } from '../src/data/menu.ts';
import { clearCookie, isStaff, safeEqual, sessionCookie } from './auth.ts';
import { ensureSchema } from './schema.ts';

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB: D1Database;
  STAFF_PASSWORD?: string;
}

interface Row {
  id: number;
  created_at: number;
  name: string;
  room: string;
  egg: string;
  egg_count: number;
  addons: string;
  sides: string;
  notes: string;
  status: 'pending' | 'done';
  position: number;
  done_at: number | null;
}

const ROOM_LIMIT = 6; // plates per room in ten minutes, to stop a stuck button flooding the kitchen
const DONE_WINDOW = 18 * 60 * 60 * 1000;

const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  Response.json(data, { status, headers: { 'cache-control': 'no-store', ...headers } });

const toOrder = (r: Row) => ({
  id: r.id,
  createdAt: r.created_at,
  name: r.name,
  room: r.room,
  egg: r.egg,
  eggCount: r.egg_count,
  addons: JSON.parse(r.addons),
  sides: JSON.parse(r.sides),
  notes: r.notes,
  status: r.status,
  doneAt: r.done_at,
});

async function readJson(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 8_000) return null;
  return request.json().catch(() => null);
}

export async function handleOrders(request: Request, env: Env, url: URL): Promise<Response> {
  const path = url.pathname.replace(/\/+$/, '');
  const method = request.method;

  if (path === '/api/orders/login' && method === 'POST') {
    if (!env.STAFF_PASSWORD) return json({ error: 'Staff password is not set up yet' }, 503);
    const body = (await readJson(request)) as { password?: unknown } | null;
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!password || !(await safeEqual(password, env.STAFF_PASSWORD))) {
      await new Promise((r) => setTimeout(r, 700));
      return json({ error: 'That password didn’t work' }, 401);
    }
    return json({ ok: true }, 200, { 'set-cookie': await sessionCookie(env.STAFF_PASSWORD) });
  }

  if (path === '/api/orders/logout' && method === 'POST') {
    return json({ ok: true }, 200, { 'set-cookie': clearCookie });
  }

  if (path === '/api/orders' && method === 'POST') {
    await ensureSchema(env.DB);
    const checked = validateOrder(await readJson(request));
    if ('error' in checked) return json({ error: checked.error }, 400);
    const o = checked.order;
    const now = Date.now();

    const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM orders WHERE room = ? AND created_at > ?')
      .bind(o.room, now - 10 * 60 * 1000)
      .first<{ n: number }>();
    if ((recent?.n ?? 0) >= ROOM_LIMIT) {
      return json({ error: 'The kitchen already has several plates for this room. Please ask at reception.' }, 429);
    }

    const row = await env.DB.prepare(
      `INSERT INTO orders (created_at, name, room, egg, egg_count, addons, sides, notes, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, (SELECT COALESCE(MAX(position), 0) + 1 FROM orders)) RETURNING id`,
    )
      .bind(now, o.name, o.room, o.egg, o.eggCount, JSON.stringify(o.addons), JSON.stringify(o.sides), o.notes)
      .first<{ id: number }>();
    return json({ ok: true, id: row?.id }, 201);
  }

  if (!(await isStaff(request, env.STAFF_PASSWORD))) return json({ error: 'Unauthorized' }, 401);
  await ensureSchema(env.DB);

  if (path === '/api/orders' && method === 'GET') {
    const { results } = await env.DB.prepare(
      `SELECT * FROM orders
       WHERE status = 'pending' OR done_at > ?
       ORDER BY status = 'done', CASE WHEN status = 'pending' THEN position ELSE -done_at END
       LIMIT 300`,
    )
      .bind(Date.now() - DONE_WINDOW)
      .all<Row>();
    return json({ orders: results.map(toOrder) });
  }

  const match = path.match(/^\/api\/orders\/(\d+)$/);
  if (match && method === 'PATCH') {
    const id = Number(match[1]);
    const body = (await readJson(request)) as { status?: unknown; move?: unknown } | null;
    const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<Row>();
    if (!order) return json({ error: 'Order not found' }, 404);

    if (body?.status === 'done' || body?.status === 'pending') {
      await env.DB.prepare('UPDATE orders SET status = ?, done_at = ? WHERE id = ?')
        .bind(body.status, body.status === 'done' ? Date.now() : null, id)
        .run();
      return json({ ok: true });
    }

    if (body?.move === 'up' || body?.move === 'down') {
      if (order.status !== 'pending') return json({ error: 'Only pending orders can move' }, 400);
      const up = body.move === 'up';
      const neighbour = await env.DB.prepare(
        `SELECT id, position FROM orders WHERE status = 'pending' AND position ${up ? '<' : '>'} ?
         ORDER BY position ${up ? 'DESC' : 'ASC'} LIMIT 1`,
      )
        .bind(order.position)
        .first<{ id: number; position: number }>();
      if (!neighbour) return json({ ok: true });
      await env.DB.batch([
        env.DB.prepare('UPDATE orders SET position = ? WHERE id = ?').bind(neighbour.position, id),
        env.DB.prepare('UPDATE orders SET position = ? WHERE id = ?').bind(order.position, neighbour.id),
      ]);
      return json({ ok: true });
    }

    return json({ error: 'Nothing to change' }, 400);
  }

  return json({ error: 'Not found' }, 404);
}
