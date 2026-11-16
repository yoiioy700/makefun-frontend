// Hash router. Routes: #/ | #/bounty/:slug | #/bounty/:slug/leaderboard | #/u/:handle
import { board, competition, leaderboard, profile } from "./api.js";
import { loading, errorBox, boardView, bountyView, leaderboardView, profileView, notFound } from "./views.js";

const view = document.getElementById("view");
let run = 0; // guards against out-of-order fetches

function render(html) { view.innerHTML = html; window.scrollTo(0, 0); }
async function load(fn, label) {
  const id = ++run;
  render(loading(label));
  try {
    const html = await fn();
    if (id === run) { render(html); window.__shotReady = true; }
  } catch (e) {
    if (id === run) render(errorBox(e, location.hash || "#/"));
  }
}

function routes() {
  const h = location.hash.replace(/^#/, "") || "/";
  const parts = h.split("/").filter(Boolean);
  if (parts.length === 0) {
    document.title = "make.fun — Bounty Board";
    return load(async () => {
      const data = await board({ status: "open", limit: 50 });
      return boardView(data.items || [], { status: "open" });
    }, "Loading live bounties…");
  }
  if (parts[0] === "bounty" && parts[1] && parts.length === 2) {
    document.title = "Bounty — make.fun";
    return load(async () => bountyView(await competition(parts[1])), "Loading bounty…");
  }
  if (parts[0] === "bounty" && parts[1] && parts[2] === "leaderboard") {
    document.title = "Leaderboard — make.fun";
    return load(async () => leaderboardView(await leaderboard(parts[1])), "Loading leaderboard…");
  }
  if (parts[0] === "u" && parts[1]) {
    document.title = parts[1] + " — make.fun";
    return load(async () => profileView(await profile(parts[1])), "Loading profile…");
  }
  render(notFound());
}

// Search box: "u/handle" goes to a profile, anything else tries a bounty slug.
document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("q").value.trim().replace(/^#?\/?/, "");
  if (!q) return;
  location.hash = q.startsWith("u/") ? "#/" + q : "#/bounty/" + q;
});

window.__shotReady = false;
window.addEventListener("hashchange", () => { window.__shotReady = false; routes(); });
routes();
