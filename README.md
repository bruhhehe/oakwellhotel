# Oakwell Hotel Blackpool

The website for Oakwell, a family-run, alcohol-free hotel on South Promenade, Blackpool:
[oakwellhotel.com](https://oakwellhotel.com).

- `/`: the hotel. Seaside hero, photo gallery, Blackpool map, guest book of reviews, booking.
- `/breakfast`: guests build a breakfast plate and send it to the kitchen.
- `/orders`: the staff kitchen queue (password protected).

Built with Astro. Hosted on Cloudflare (a Worker with a D1 database for orders) and on Vercel (the
same pages, with `/api/orders` passed through to the Worker so both share one kitchen queue).
Deployment steps are in [DEPLOY.md](DEPLOY.md).

## Editing content

| What | Where |
|---|---|
| WhatsApp number, email, address, map link | `src/data/site.ts` |
| Guest book reviews | `src/data/reviews.ts` |
| Gallery photos and captions | `src/data/gallery.ts` (images in `src/assets/gallery/`) |
| Breakfast menu, price, serving time | `src/data/menu.ts` (shared with the order API) |

**The WhatsApp number is still the placeholder from the old site** (`440000000000`). Put the real
number in `src/data/site.ts`, with the country code and no `+` (for example `447700900123`).

## Scripts

- `npm run dev`: local pages at localhost:4321
- `npm run preview`: build, then run the full site with the order API through Wrangler
- `npm run check`: type check plus tests
