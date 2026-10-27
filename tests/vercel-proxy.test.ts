import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import handler from '../api/orders.ts';

test('passes order requests through to the Worker, cookies included', async (t) => {
  const seen: { method?: string; url?: string; cookie?: string; body: string }[] = [];
  const server = createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      seen.push({ method: req.method, url: req.url, cookie: req.headers.cookie, body });
      res.writeHead(201, { 'content-type': 'application/json', 'set-cookie': 'oakwell_staff=x; Path=/api/orders' });
      res.end('{"ok":true}');
    });
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  t.after(() => server.close());
  const { port } = server.address() as { port: number };
  process.env.ORDERS_API_ORIGIN = `http://127.0.0.1:${port}`;

  const res = await handler(
    new Request('https://oakwellhotel.vercel.app/api/orders?sub=12', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', cookie: 'oakwell_staff=abc', host: 'evil' },
      body: '{"status":"done"}',
    }),
  );
  assert.equal(res.status, 201);
  assert.equal(res.headers.get('set-cookie'), 'oakwell_staff=x; Path=/api/orders');
  assert.deepEqual(seen[0], { method: 'PATCH', url: '/api/orders/12', cookie: 'oakwell_staff=abc', body: '{"status":"done"}' });

  const bad = await handler(new Request('https://x/api/orders?sub=..%2F..%2Fadmin'));
  assert.equal(bad.status, 404);
  assert.equal(seen.length, 1);
});

test('says plainly when the Worker address is not set', async () => {
  delete process.env.ORDERS_API_ORIGIN;
  const res = await handler(new Request('https://x/api/orders', { method: 'POST', body: '{}' }));
  assert.equal(res.status, 503);
});
