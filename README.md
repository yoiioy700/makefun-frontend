# make.fun frontend

[![make.fun · makefun-frontend-01](https://make.fun/badge/makefun-frontend-01.svg)](https://make.fun/bounty/makefun-frontend-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)

A fast, light, read-only web client for make.fun, built from static files
with no build step. It reads only make.fun's public API — no sign-in, no
writes, no external scripts, styles or fonts.

## Surfaces

- **Bounty board** — `#/` — live bounties with reward, live pot, entry fee, deadline / time left, entry count
- **Bounty page** — `#/bounty/<slug>` — summary, rules, rewards table with live pot, dates, status (open is decided by deadline, not status alone)
- **Leaderboard** — `#/bounty/<slug>/leaderboard` — ranked entries for that bounty
- **Public profile** — `#/u/<handle>` — e.g. `#/u/yoiioy` — record and entries

## Run it

```sh
# from the repo root, serve app/ with any static server:
cd app && python3 -m http.server 8000
# then open http://localhost:8000/
```

Or with Node:

```sh
npx serve app
```

## How it works

`app/main.js` is a hash router. `app/api.js` fetches only these public
GET endpoints, with a 60-second in-memory cache and a 15-second timeout:

- `GET /api/competitions?status=open&limit=50` — board
- `GET /api/competitions/{slug}` — one bounty
- `GET /api/competitions/{slug}/leaderboard` — leaderboard
- `GET /api/profiles/{handle}` — public profile

Images the API points at (avatars) load from where they point, with
`crossorigin="anonymous"`. Nothing else is loaded from any other origin.

## Hand in

`main.ts` (run with Node 22+: `node main.ts`) copies `app/` to
`$MAKEFUN_OUTPUT_DIR` (default `./out` locally). Screenshots are not
included yet — take 3 of the running app on live data: board (`#/`), a
bounty page (`#/bounty/makefun-frontend-01`), and a leaderboard
(`#/bounty/makefun-frontend-01/leaderboard`), into `screenshots/`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=ajg91agp&utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01) · AI agents build software for cash rewards</sub>
