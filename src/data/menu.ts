// The breakfast menu. Shared by the order page and the Worker, so what guests can pick
// and what the kitchen accepts never drift apart.
export const EGG_STYLES = ['Omelette', 'Fried Eggs', 'Scrambled Eggs', 'Boiled Eggs'] as const;
export const EGG_COUNTS = [1, 2, 3] as const;
export const ADDONS = ['Cheese', 'Tomato', 'Masala spices', 'Mushroom'] as const;
export const SIDES = ['Beans', 'Hash Browns', 'Sausages'] as const;
export const SIDE_COUNTS: Partial<Record<Side, readonly number[]>> = {
  'Hash Browns': [1, 2, 3],
  Sausages: [1, 2],
};
export const ROOMS = Array.from({ length: 12 }, (_, i) => String(i + 1));
export const PRICE = '£9.49';
export const SERVED = '9:30–11:00';
export const NOTES_MAX = 500;
export const NAME_MAX = 60;

export type EggStyle = (typeof EGG_STYLES)[number];
export type Addon = (typeof ADDONS)[number];
export type Side = (typeof SIDES)[number];

export interface OrderInput {
  name: string;
  room: string;
  egg: EggStyle;
  eggCount: number;
  addons: Addon[];
  sides: { name: Side; count?: number }[];
  notes: string;
}

/** Returns the cleaned order, or a message saying what to fix. */
export function validateOrder(body: unknown): { order: OrderInput } | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Order is missing' };
  const b = body as Record<string, unknown>;

  const name = typeof b.name === 'string' ? b.name.trim() : '';
  if (!name) return { error: 'Add your name' };
  if (name.length > NAME_MAX) return { error: `Keep your name under ${NAME_MAX} characters` };

  const room = typeof b.room === 'string' || typeof b.room === 'number' ? String(b.room).trim() : '';
  if (!ROOMS.includes(room)) return { error: 'Choose a room from 1 to 12' };

  if (!EGG_STYLES.includes(b.egg as EggStyle)) return { error: 'Pick how you would like your eggs' };
  const eggCount = Number(b.eggCount);
  if (!(EGG_COUNTS as readonly number[]).includes(eggCount)) return { error: 'Choose 1, 2 or 3 eggs' };

  const addonsIn = Array.isArray(b.addons) ? b.addons : [];
  if (!addonsIn.every((a) => ADDONS.includes(a as Addon))) return { error: 'Unknown add-on' };
  const addons = ADDONS.filter((a) => addonsIn.includes(a));

  const sidesIn = Array.isArray(b.sides) ? b.sides : [];
  const sides: OrderInput['sides'] = [];
  for (const s of sidesIn) {
    const sideName = (s as { name?: unknown })?.name as Side;
    if (!SIDES.includes(sideName) || sides.some((x) => x.name === sideName)) return { error: 'Unknown side' };
    const counts = SIDE_COUNTS[sideName];
    if (counts) {
      const count = Number((s as { count?: unknown }).count);
      if (!counts.includes(count)) return { error: `Choose how many ${sideName.toLowerCase()}` };
      sides.push({ name: sideName, count });
    } else {
      sides.push({ name: sideName });
    }
  }

  const notes = typeof b.notes === 'string' ? b.notes.trim() : '';
  if (notes.length > NOTES_MAX) return { error: `Keep notes under ${NOTES_MAX} characters` };

  return { order: { name, room, egg: b.egg as EggStyle, eggCount, addons, sides, notes } };
}
