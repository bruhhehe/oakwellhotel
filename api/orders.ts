// Vercel: the breakfast order API lives on the Cloudflare Worker (with its D1 database), so this
// edge function passes /api/orders* through to it. Guests and staff on either host share one queue.
// Set ORDERS_API_ORIGIN in Vercel to the Worker's address, e.g. https://oakwellhotel.<you>.workers.dev
export const config = { runtime: 'edge' };

const SUB_PATH = /^(login|logout|\d+)?$/;

export default async function handler(request: Request): Promise<Response> {
  const origin = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env
    .ORDERS_API_ORIGIN;
  if (!origin) {
    return Response.json({ error: 'Breakfast orders aren’t connected yet. Please order at reception.' }, { status: 503 });
  }

  // vercel.json rewrites /api/orders/:sub to /api/orders?sub=:sub
  const url = new URL(request.url);
  const sub = url.searchParams.get('sub') ?? '';
  if (!SUB_PATH.test(sub)) return Response.json({ error: 'Not found' }, { status: 404 });

  const headers = new Headers();
  for (const name of ['content-type', 'cookie', 'accept']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const upstream = await fetch(new URL(`/api/orders${sub ? `/${sub}` : ''}`, origin), {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
    redirect: 'manual',
  });

  const out = new Headers();
  for (const name of ['content-type', 'cache-control', 'set-cookie']) {
    const value = upstream.headers.get(name);
    if (value) out.set(name, value);
  }
  return new Response(upstream.body, { status: upstream.status, headers: out });
}
