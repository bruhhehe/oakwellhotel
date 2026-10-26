# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static pages) served by a Cloudflare Worker, with D1 storing breakfast orders. Chosen by the
owner to match their other Cloudflare site (`invigotouch`). Replaces the earlier Next.js build on Vercel.

## Users

Families planning a seaside break in Blackpool who want a calm, alcohol-free hotel close to the beach
and attractions. They browse on their phones, look at the rooms, check the location, read what other
guests said, then message the hotel to book. (Confirmed by the owner.)

Two secondary audiences already served by the existing site: guests staying in rooms 1–12 who order
breakfast from `/breakfast`, and staff who work through those orders at `/orders`.

## Product Purpose

Turn a family's "is this the right place?" into a booking message. Success is a WhatsApp or email
enquiry with dates and group size.

## Positioning

A family-run, alcohol-free hotel on South Promenade, facing the sea, a walk from Pleasure Beach and
Sandcastle Waterpark. Booking is a direct conversation with the hosts, not a booking engine.

## Operating Context

- Booking happens over WhatsApp; the hosts usually reply within a few hours. Email:
  `oakwellhotel@gmail.com`.
- Breakfast is £9.49, served 9:30–11:00. Guests build a plate (one egg style with 1–3 eggs, add-ons,
  sides with counts, a note) and it lands in the kitchen queue.
- Staff sign in to `/orders` with a shared password, mark plates done, undo, and reorder the queue.

## Capabilities and Constraints

- Address: 357 South Promenade, Blackpool. Google Maps link is in `src/data/site.ts`.
- The WhatsApp number on the old site was a placeholder (`440000000000`). It lives in one place,
  `src/data/site.ts`, until the owner supplies a real number. **Open decision.**
- 12 rooms (breakfast room selector 1–12).

## Brand Commitments

The owner asked to keep every existing design choice: Fraunces and Inter, the cream / sea / sand
palette, the painted seaside background, the polaroid gallery with tape, the illustrated Blackpool
map, the blue guest book for reviews, and the tinted breakfast builder. Work on this site refines
fundamentals; it does not replace the look.

## Evidence on Hand

- Photos: `public/slideshowimages/gallery-1…8.jpg` (rooms, lounge, coffee bar, kids corner,
  hallway, sunset).
- Illustrations: `public/images/oakwellbackground.png`, `src/assets/oakwellmap.png`,
  `src/assets/reviewbook.png`.
- Twelve guest reviews carried over from the old site (`src/data/reviews.ts`). No star ratings,
  awards, prices per night or distances exist; do not invent them.

## Product Principles

1. Every page ends in a way to get in touch.
2. Real photos and real facts over decoration.
3. Phone first: most families arrive on a phone, and so does every breakfast order.
4. Calm and family-friendly in tone, never salesy.

## Accessibility & Inclusion

Readable on small phones without zooming (the old guest book text fell below 9px). Keyboard and
screen-reader access for the gallery, guest book and breakfast builder. Respect reduced motion.
