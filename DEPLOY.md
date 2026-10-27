# Deploying

The site deploys to **Cloudflare** and **Vercel** from the same `main` branch.

- **Cloudflare** serves the static Astro pages from a Worker. The Worker also runs the breakfast
  order API (`/api/orders`) and stores plates in a D1 database.
- **Vercel** serves the same static pages. Its `/api/orders` is a small edge function
  (`api/orders.ts`) that passes requests through to the Cloudflare Worker, so both sites share one
  kitchen queue and one staff login. Set up Cloudflare first.

Every push to `main` rebuilds both once the repo is connected.

# Cloudflare

## 1. The orders database

Nothing to do. `wrangler.jsonc` names a D1 database (`oakwell-orders`) without an id, so the
first deploy creates it and later deploys reuse it. The Worker creates its `orders` table the first
time it is used (`worker/schema.ts`).

## 2. Connect the repo in Cloudflare

1. If the setup screen says "Missing git connection", give Cloudflare's GitHub app access to
   `bruhhehe/oakwellhotel`: GitHub **Settings** > **Applications** > **Cloudflare Workers and Pages** >
   **Configure** > **Repository access**.
2. Cloudflare dashboard > **Workers & Pages** > **Create** > **Import a repository** > `bruhhehe/oakwellhotel`.
3. Settings:
   - Project name: `oakwellhotel` (must match `name` in `wrangler.jsonc`)
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Production branch: `main`
4. **Deploy.** The Node version comes from `.node-version`.

## 3. Staff password

Worker > **Settings** > **Variables and Secrets** > **Add** > type **Secret**:

| Name | Value |
|---|---|
| `STAFF_PASSWORD` | The password staff type at `/orders`. Changing it signs every device out. |

`keep_vars` in `wrangler.jsonc` stops deploys from wiping it. Never commit it: `.dev.vars` is git-ignored.

## 4. Move oakwellhotel.com over from Vercel

1. Worker > **Settings** > **Domains & Routes** > **Add** > **Custom domain** > `oakwellhotel.com`,
   then the same for `www.oakwellhotel.com`.
2. If the domain's DNS is on Cloudflare, the records are added for you. Remove any old records that
   point at Vercel (`cname.vercel-dns.com` or `76.76.21.21`). If DNS is elsewhere, move the
   nameservers to Cloudflare (recommended) or add the CNAME it shows.
3. Redirect `www` to the bare domain: **Rules** > **Redirect Rules** > "Redirect from WWW to root".
4. Once the new site is live, remove the domain from the Vercel project so it stops answering.

Orders placed on the old Vercel site are not copied over; the queue starts empty.

## 5. Check after the first deploy

- Build a plate at `/breakfast` and send it. Sign in at `/orders` and you should see it. Mark it done,
  then undo. Do the same on the Vercel address: the order shows up in the same queue.
- A made-up URL shows the 404 page. `/sitemap-index.xml` and `/robots.txt` load.

# Vercel

1. Vercel dashboard > **Add New** > **Project** > import `bruhhehe/oakwellhotel`. If it isn't listed,
   use **Adjust GitHub App Permissions** and give Vercel access to the repo.
2. Vercel reads `vercel.json`: framework Astro, build `npm run build`, output `dist`. Leave the
   defaults. Production branch: `main`.
3. **Settings** > **Environment Variables**, for Production (and Preview if you want orders there too):

   | Name | Value |
   |---|---|
   | `ORDERS_API_ORIGIN` | The Cloudflare Worker's address, e.g. `https://oakwellhotel.<your-subdomain>.workers.dev` (Worker > **Settings** > **Domains & Routes**). No trailing slash. |

   Redeploy after adding it. Until it is set, `/breakfast` shows "Breakfast orders aren't connected
   yet" when a guest sends a plate.
4. The staff password is the Cloudflare `STAFF_PASSWORD`; Vercel doesn't need its own.

## Which host gets oakwellhotel.com

A domain can only point at one of them. Pick one for `oakwellhotel.com` and `www`; the other keeps
working on its own address (`*.vercel.app` or `*.workers.dev`), which is handy as a backup.

- **Vercel:** project > **Settings** > **Domains** > add `oakwellhotel.com` and follow the DNS records
  it shows. If the old Next.js project still holds the domain, remove it there first.
- **Cloudflare:** see step 4 above.

Keep `ORDERS_API_ORIGIN` on the `*.workers.dev` address either way, not on oakwellhotel.com, so
Vercel never loops back to itself.

## Local development

```sh
npm install
npm run dev                 # pages only, at localhost:4321 (order sending will fail: no API)
echo 'STAFF_PASSWORD="test"' > .dev.vars
npm run preview             # full site + API + local database, at localhost:8787
```
