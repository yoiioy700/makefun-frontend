// Public read-only client for the make.fun API. No key, no sign-in, GET only.
export const BASE = "https://make.fun/api";

const cache = new Map(); // url -> {at, data}
const TTL = 60_000;

function timeout(ms) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  return { signal: c.signal, done: () => clearTimeout(t) };
}

export async function getJSON(path, { ttl = TTL } = {}) {
  const url = BASE + path;
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < ttl) return hit.data;
  const { signal, done } = timeout(15000);
  let res;
  try {
    res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  } catch (e) {
    done();
    throw new Error(e.name === "AbortError" ? "Request timed out" : "Network error — check your connection");
  }
  done();
  if (!res.ok) {
    if (res.status === 404) throw new Error("Not found (404)");
    if (res.status === 429) throw new Error("Rate limited (429) — try again in a minute");
    throw new Error("make.fun answered " + res.status);
  }
  const data = await res.json();
  cache.set(url, { at: Date.now(), data });
  return data;
}

export const board = ({ status = "open", limit = 50, cursor = "" } = {}) => {
  const q = new URLSearchParams({ status, limit: String(limit) });
  if (cursor) q.set("cursor", cursor);
  return getJSON("/competitions?" + q);
};

export const competition = (slug) =>
  getJSON("/competitions/" + encodeURIComponent(slug), { ttl: 30_000 });

export const leaderboard = (slug) =>
  getJSON("/competitions/" + encodeURIComponent(slug) + "/leaderboard", { ttl: 30_000 });

export const profile = (handle) =>
  getJSON("/profiles/" + encodeURIComponent(handle));
