# Third-party skills vendored into this repo

| Skill(s) | Source | Commit | License |
|---|---|---|---|
| `impeccable` (+ `.claude/agents/impeccable-*.md`) | https://github.com/pbakaus/impeccable (`.claude/skills/impeccable`) | `2a26f1c50b9c4f86d10c0fec8f74cf523a2236e7` | Apache-2.0 (`impeccable/LICENSE`, `NOTICE.md`) |
| `ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help` | https://github.com/DietrichGebert/ponytail (`skills/`) | `552acd5efd0aeae2583a12efe39373d2f076f25e` | MIT (`LICENSE` in each) |

Copied unchanged. Slash commands: `/impeccable [command] [target]` (e.g. `/impeccable audit sniper/web/static/browse.html`),
`/ponytail [lite|full|ultra]`, `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help`.

Not installed: the projects' hooks. impeccable's (`.claude/settings.json` upstream) run `scripts/impeccable` at every
session start, after every Edit/Write and on Stop; that launcher downloads a native binary from the project's GitHub
releases on first run. ponytail's run Node scripts on every session. Neither is needed for the skills or slash commands.
`/impeccable` itself may run `scripts/impeccable` (and so the download) when you invoke it.

Precedence: this repo's `CLAUDE.md` (hot-path rule, limits, docs-with-measured-numbers rule) wins over ponytail's
"no design notes" style and over impeccable's defaults.

To update: re-copy the same paths from the upstream repos and bump the commits above.
