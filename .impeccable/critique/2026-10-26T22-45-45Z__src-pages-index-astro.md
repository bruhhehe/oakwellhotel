---
target: home page
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
target_identity: "file:/home/user/oakwellhotel/src/pages/index.astro"
target_fingerprint: "sha256:f3a85987e2a0060070f14cb948275dbb7941df4b15711cce90eaec814bd35d87"
target_path: /home/user/oakwellhotel/src/pages/index.astro
timestamp: 2026-10-26T22-45-45Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Gallery/book state is clear; nothing confirms the WhatsApp hand-off |
| 2 | Match System / Real World | 2 | Polaroids, book and map are strong; copy is generic brochure voice |
| 3 | User Control and Freedom | 3 | Fine |
| 4 | Consistency and Standards | 3 | Address shown 5x, WhatsApp 5x |
| 5 | Error Prevention | 2 | Every Book CTA uses the placeholder WhatsApp number |
| 6 | Recognition Rather Than Recall | 3 | Breakfast details buried in contact list |
| 7 | Flexibility and Efficiency | n/a | One-visit brochure |
| 8 | Aesthetic and Minimalist Design | 2 | Repetition, fact strip, decorative gulls |
| 9 | Error Recovery | 2 | No fallback when WhatsApp is unavailable |
| 10 | Help and Documentation | n/a | Landing page |
| Total | | 20/32 | Acceptable, generic |

## Design Specificity Verdict
Assets are specific (real photos, pinned map, guest book); the scaffolding around them is template: "Your X by the Sea" hero with italic accent line, dark+ghost pills, dot-separated trust strip, four Title Case slogan H2s at identical size and padding, icon+label contact list, dot tagline footer. Copy never says what only this hotel can say (12 rooms, hosts who reply on WhatsApp, £9.49 breakfast). Detector: CLI 0 findings; in-page 3 (italic-serif-display on h1 span, cream-palette, edge-flush-cards on the scrolling gallery = false positive).

## Priority Issues
- [P0] Fabricated five-star ratings on every guest-book entry (no ratings exist). Fix: remove stars.
- [P1] Hero formula + fact strip: three non-features repeating headline and lede; sits on the water at 1280x720 (min 4.87:1). Fix: delete strip, rewrite lede with real facts, put reply promise under CTA, drop italic accent line.
- [P1] Placeholder WhatsApp number behind every CTA. Fix: real number, email fallback.
- [P1] Invented / agency-voice captions and closing copy ("many with views over the Irish Sea", "open through the day", "Ready for a Seaside Stay?"). Fix: literal labels, host voice.
- [P2] Redundancy + template contact list; uniform section rhythm; decorative gulls. Fix: trim contact to email + breakfast with price, delete gulls, sentence-case and vary H2s, tighten book.
- [P3] Guest book a11y: unreachable keydown handler, duplicate tab stops, double aria-live.

## Persona Red Flags
- Parent on a phone: first screen repeats sea/alcohol-free, no rooms/breakfast/how booking works; Book goes to a dead number; mobile gallery has no swipe cue.
- Low-vision grandparent on a laptop: 14px fact strip over sparkling water; small italic review text on parchment.
- Sceptical first-timer: identical five stars + polished quotes + tropical painting read as fake; honest photos are the most persuasive element.

## Questions to Consider
- What is left if you delete every sentence a Torquay hotel could also say?
- Who are the hosts? One signed line would beat any layout change.
