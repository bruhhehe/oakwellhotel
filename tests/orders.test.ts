import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateOrder } from '../src/data/menu.ts';
import { isStaff, safeEqual, sessionCookie } from '../worker/auth.ts';

const plate = { name: ' Sara ', room: '7', egg: 'Fried Eggs', eggCount: 2, addons: ['Tomato', 'Cheese'], sides: [{ name: 'Beans' }, { name: 'Sausages', count: 2 }], notes: '' };

test('accepts a full plate and tidies it', () => {
  const r = validateOrder(plate);
  assert.ok('order' in r);
  assert.equal(r.order.name, 'Sara');
  assert.deepEqual(r.order.addons, ['Cheese', 'Tomato']);
  assert.deepEqual(r.order.sides, [{ name: 'Beans' }, { name: 'Sausages', count: 2 }]);
});

test('rejects what the menu does not offer', () => {
  assert.ok('error' in validateOrder({ ...plate, name: '' }));
  assert.ok('error' in validateOrder({ ...plate, room: '13' }));
  assert.ok('error' in validateOrder({ ...plate, egg: 'Poached Eggs' }));
  assert.ok('error' in validateOrder({ ...plate, eggCount: 4 }));
  assert.ok('error' in validateOrder({ ...plate, addons: ['Bacon'] }));
  assert.ok('error' in validateOrder({ ...plate, sides: [{ name: 'Sausages', count: 3 }] }));
  assert.ok('error' in validateOrder({ ...plate, sides: [{ name: 'Hash Browns' }] }));
  assert.ok('error' in validateOrder({ ...plate, notes: 'x'.repeat(501) }));
  assert.ok('error' in validateOrder(null));
});

test('staff cookie signs in, expires, and dies with a password change', async () => {
  const now = Date.now();
  const cookie = (await sessionCookie('kitchen', now)).split(';')[0];
  const req = new Request('https://x/api/orders', { headers: { cookie } });
  assert.equal(await isStaff(req, 'kitchen', now), true);
  assert.equal(await isStaff(req, 'new-password', now), false);
  assert.equal(await isStaff(req, 'kitchen', now + 13 * 3600 * 1000), false);
  assert.equal(await isStaff(new Request('https://x'), 'kitchen'), false);
  assert.equal(await safeEqual('a', 'a'), true);
  assert.equal(await safeEqual('a', 'b'), false);
});
