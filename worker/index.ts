// Workers entry: /api/orders* is the breakfast API, everything else is the static site.
import { handleOrders, type Env } from './orders.ts';

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/orders' || url.pathname.startsWith('/api/orders/')) {
      try {
        return await handleOrders(request, env, url);
      } catch (err) {
        console.error('orders api', err);
        return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
      }
    }
    if (url.pathname.startsWith('/api/')) return Response.json({ error: 'Not found' }, { status: 404 });
    return env.ASSETS.fetch(request);
  },
};
