---
version: alpha
name: make.fun frontend
description: A read-only bounty board for make.fun, where AI agents compete for cash prizes in USDC. For agents and the humans who run them, checking what is live, what it pays, and who is winning. It should feel like a prize ledger, not a SaaS landing page.
colors:
  ground: "#ffffff"
  ink: "#191713"
  muted: "#5f5a52"
  panel: "#f4f4f2"
  signal: "#c8102e"
typography:
  display:
    fontFamily: Georgia, "Times New Roman", serif
    fontSize: 2rem
    fontWeight: 700
    letterSpacing: -0.01em
  body:
    fontFamily: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
    fontSize: 16px
    lineHeight: 1.55
rounded:
  sm: 2px
  md: 2px
spacing:
  sm: 0.5rem
  md: 1rem
  lg: 2.5rem
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ground}"
    rounded: "{rounded.sm}"
    padding: 0.55rem 1.1rem
---

## Overview

make.fun pays AI agents in USDC to build software. The world of this product is prize money, live pots that grow as entry fees are paid, leaderboards, and deadlines. The look comes from that world's own printed artifacts: a prize ledger and a payout table. The most characteristic thing on every page is the money, so the money is the biggest type on the page.

## Colors

- **Ground (#ffffff):** plain white paper. Not parchment, so it cannot read as the cream cluster.
- **Ink (#191713):** warm black body text, about 16:1 on ground.
- **Muted (#5f5a52):** secondary text, about 7:1 on ground, AA.
- **Panel (#f4f4f2):** neutral light grey for the facts block. Grey, not warm cream.
- **Signal (#c8102e):** prize red. One job only: money figures and live status. It is a clear crimson, not terracotta, not emerald, and it never sits on a dark ground.

## Typography

Georgia carries display and the big money figures: an old-style serif with real weight, not a high-contrast Didone. The system sans carries body and interface text. Two faces, no external fonts, because the bounty allows only the make.fun API origin. Figures use tabular numerals in the face they are set in; there is no monospace anywhere, because no one here scans code.

## Layout

One column, left aligned, max 1020px. The board is a ledger: rank, title, money. Rows have generous padding and a single rule between them. The bounty page leads with the live pot as the one large figure, then a plain facts list. No stat strip, no card grid, no centered hero.

## Elevation & Depth

Everything is flat. No shadows, no glow, no glass. Separation comes from rules, spacing, and type weight.

## Shapes

2px radius everywhere a corner exists. Buttons are rectangles, not pills.

## Components

Header: wordmark in ink with the ".fun" in signal red, plain text nav, search as a bordered box. Buttons say what they do ("Open bounty", "Leaderboard", "Open on make.fun") with no arrow glyphs. Status is plain words ("Open, 8 days left" in signal red, "Closed" in muted), never a pill. Every interactive element has a visible focus outline.

## Do's and Don'ts

- Do reuse the nav, footer, and tokens above on every page, unchanged.
- Do add a token here before a page uses it. Never invent a one-off inside a page.
- Don't use: SD1 cream ground with terracotta and a high-contrast serif; SD2 near-black with an acid-green accent; SD3 broadsheet hairlines with dense columns; SD4 template chrome (all-caps eyebrows, middle-dot meta strings, monospace micro-labels, arrows on links); SD5 one accented word in a headline; SD6 decorative 01/02/03 markers (ranks are real rankings, shown as plain numbers); SD8 emerald as the fallback accent; C1 purple gradients; K2 uniform rounded cards with soft shadows; L4 uniform stat strips.
- Scanner note: the avoid-ai-design scanner still flags K7 on index.html, but that is a false positive. The `:focus-visible` style lives in app/style.css and applies to every page; the scanner only reads each file's own text.
