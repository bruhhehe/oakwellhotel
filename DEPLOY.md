# Deploying to Cloudflare

The site is static Astro pages served by a Cloudflare Worker. The Worker also runs the breakfast
order API (`/api/orders`), which stores plates in a D1 database. Every push to `main` rebuilds and
publishes it once the repo is connected.

## 1. Create the orders database (once)

```sh
npx wrangler login
npx wrangler d1 create oakwell-orders
```

Copy the `database_id` it prints into `wrangler.jsonc` (replace the `0000…` placeholder), commit,
then create the table:

```sh
npm run db:migrate
```

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
  then undo.
- A made-up URL shows the 404 page. `/sitemap-index.xml` and `/robots.txt` load.

## Local development

```sh
npm install
npm run dev                 # pages only, at localhost:4321 (order sending will fail: no API)
echo 'STAFF_PASSWORD="test"' > .dev.vars
npx wrangler d1 migrations apply oakwell-orders --local
npm run preview             # full site + API + local database, at localhost:8787
```
