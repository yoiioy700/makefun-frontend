// Views: pure HTML strings from public API data. All user/API text is escaped.
import { esc, money, usd, fmtDate, timeLeft, isOpen, plural } from "./format.js";

export const loading = (label = "Loading…") =>
  `<p class="loading" role="status">${esc(label)}</p>`;

export const errorBox = (err, retryHash = "#/") =>
  `<div class="err" role="alert"><strong>Couldn’t load this.</strong> ${esc(err?.message || err)}
   <p><a href="${retryHash}">Try again</a>, or <a href="#/">back to board</a>.</p></div>`;

const openBadge = (c) =>
  isOpen(c)
    ? `<span class="status open">Open, ${esc(timeLeft(c.deadline))}</span>`
    : `<span class="status closed">Closed</span>`;

const pot = (c) => {
  const p = c.potUsd ?? c.rewardAmount;
  return p != null ? money(p) : "—";
};

const fee = (c) =>
  c.entryFeeUsd != null && Number(c.entryFeeUsd) > 0
    ? usd(c.entryFeeUsd) + " fee"
    : "Free entry";

export function boardView(items, { status }) {
  if (!items.length) {
    return `<h1>Bounty board</h1><p class="empty">No ${esc(status)} bounties right now.</p>`;
  }
  const rows = items.map((c, i) => `
    <li class="row">
      <span class="rank">${i + 1}</span>
      <div>
        <h2 class="row-title"><a href="#/bounty/${esc(c.slug)}">${esc(c.title)}</a></h2>
        <p class="row-sub">${esc(c.category || "Bounty")}, ${esc((c.skills || []).slice(0, 3).join(", "))}, ${openBadge(c)}</p>
      </div>
      <div class="money"><span class="reward">${money(c.rewardAmount)}</span> reward <span class="pot">${pot(c)} pot</span>
        <span class="sub">${plural(c.submissionCount ?? 0, "entry", "entries")}, ${esc(fee(c))}, ends ${esc(fmtDate(c.deadline))}</span>
      </div>
    </li>`).join("");
  return `<h1>Bounty board</h1>
    <p class="lede">${items.length} open bounties on make.fun, ranked by reward. The pot grows as entry fees are paid.</p>
    <ol class="board">${rows}</ol>`;
}

export function bountyView(c) {
  const rewards = c.rewardsNow || [];
  const rows = rewards.map((r) => `
    <tr><td>${r.place}</td><td>${usd(r.baseUsd)}</td><td>${usd(r.feeShareUsd)}</td><td><strong>${usd(r.amountUsd)}</strong></td></tr>`).join("");
  const desc = String(c.description || "").split("\n\n")[0] || "";
  return `<p class="crumbs"><a href="#/">Back to board</a></p>
  <h1>${esc(c.title)}</h1>
  <p class="meta">${esc(c.category || "Bounty")}, ${esc((c.skills || []).join(", "))}, ${openBadge(c)}</p>
  <p class="pot-hero"><span>Live pot</span><strong>${pot(c)}</strong></p>
  <dl class="facts">
    <div><dt>Reward</dt><dd>${money(c.rewardAmount)}</dd></div>
    <div><dt>Entry fee</dt><dd>${esc(fee(c))}</dd></div>
    <div><dt>Entries</dt><dd>${c.submissionCount ?? "—"}</dd></div>
    <div><dt>Deadline</dt><dd>${esc(fmtDate(c.deadline))}</dd></div>
    <div><dt>Time left</dt><dd>${esc(timeLeft(c.deadline))}</dd></div>
  </dl>
  <p class="desc">${esc(desc)}</p>
  <p><a class="btn" href="#/bounty/${esc(c.slug)}/leaderboard">Leaderboard</a>
     <a class="btn ghost" href="https://make.fun/bounty/${esc(c.slug)}" rel="noopener">Open on make.fun</a></p>
  ${rows ? `<h2>Rewards</h2>
  <table><thead><tr><th>Place</th><th>Base</th><th>Fee share</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="note">Top ${rewards.length} places share the pot. Entry fees join the pot.</p>` : ""}
  <h2>Rules</h2>
  <p class="note">Full rules live on the bounty page. In short: build the entry, hand in a public repo, and enter before the deadline above. Status alone can lie — a bounty past its deadline may still read “open” until results publish.</p>`;
}

export function leaderboardView(lb) {
  const cols = lb.columns || [];
  const entries = lb.entries || [];
  const head = cols.map((col) => `<th>${esc(col.title)}</th>`).join("");
  const rows = entries.slice(0, 50).map((e) => {
    const cells = cols.map((col) => {
      const v = e.display?.[col.key] ?? e.values?.[col.key] ?? "—";
      return `<td>${esc(String(v))}</td>`;
    }).join("");
    const img = e.image
      ? `<img class="avatar" src="https://make.fun${esc(e.image)}" alt="" width="24" height="24" loading="lazy" crossorigin="anonymous">`
      : "";
    return `<tr><td>${e.rank ?? "—"}</td><td>${img} <a href="#/u/${esc(e.handle)}">${esc(e.handle || "—")}</a><br><span class="muted">${esc(e.title || "")}</span></td>${cells}</tr>`;
  }).join("");
  return `<p class="crumbs"><a href="#/bounty/${esc(lb.competition.slug)}">Back to ${esc(lb.competition.title)}</a></p>
  <h1>Leaderboard, ${esc(lb.competition.title)}</h1>
  <p class="meta">${esc(lb.phase?.title || "")}, ${esc(lb.view || "")} view, ${entries.length} ranked entries shown (top 50)</p>
  ${entries.length ? `<table><thead><tr><th>#</th><th>Entrant</th>${head}</tr></thead><tbody>${rows}</tbody></table>`
    : `<p class="empty">No ranked entries yet for this bounty.</p>`}`;
}

export function profileView(p) {
  const r = p.record || {};
  const sols = p.solutions || [];
  const img = p.avatar?.url || p.image;
  const rows = sols.map((s) => `
    <tr>
      <td><a href="#/bounty/${esc(s.competition.slug)}">${esc(s.competition.title)}</a></td>
      <td>${s.placement != null ? "#" + s.placement : "—"}</td>
      <td>${s.prize_usd != null ? usd(s.prize_usd) : "—"}</td>
      <td>${esc(s.score?.display ?? "")}</td>
      <td>${esc(fmtDate(s.entered_at))}</td>
    </tr>`).join("");
  return `<div class="profile-head">${img ? `<img class="avatar big" src="https://make.fun${esc(img)}" alt="" width="56" height="56" crossorigin="anonymous">` : ""}<div><h1>${esc(p.handle)}</h1></div></div>
  ${p.bio ? `<p class="desc">${esc(p.bio)}</p>` : ""}
  <p class="meta">${p.github_login ? `GitHub: <a href="https://github.com/${esc(p.github_login)}" rel="noopener">${esc(p.github_login)}</a>, ` : ""}joined ${esc(fmtDate(p.joined_at))}</p>
  <dl class="facts">
    <div><dt>Entered</dt><dd>${r.competitions_entered ?? 0}</dd></div>
    <div><dt>Placed</dt><dd>${r.competitions_placed ?? 0}</dd></div>
    <div><dt>Won</dt><dd>${r.competitions_won ?? 0}</dd></div>
    <div><dt>Prize money</dt><dd>${usd(r.prize_usd)}</dd></div>
  </dl>
  <h2>Entries (${sols.length})</h2>
  ${sols.length ? `<table><thead><tr><th>Bounty</th><th>Place</th><th>Prize</th><th>Score</th><th>Entered</th></tr></thead><tbody>${rows}</tbody></table>`
    : `<p class="empty">No entries yet.</p>`}`;
}

export const notFound = () =>
  `<h1>Not found</h1><p class="empty">That page doesn’t exist here.</p><p><a href="#/">Back to board</a></p>`;
