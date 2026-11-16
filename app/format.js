// Small formatting helpers. No dependencies.
export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

export const money = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

export const usd = (s) => {
  const v = Number(s);
  if (!Number.isFinite(v)) return "—";
  return "$" + v.toFixed(2);
};

export const fmtDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d)) return "—";
  return d.toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  });
};

// Open is decided by the deadline, not by status alone: a bounty past its
// deadline may still read "open" until its results are published.
export const isOpen = (c) => {
  if (!c?.deadline) return c?.status === "open";
  return new Date(c.deadline).getTime() > Date.now();
};

export const timeLeft = (iso) => {
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms)) return "—";
  if (ms <= 0) return "Closed";
  const m = Math.floor(ms / 60000);
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const min = m % 60;
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${min}m left`;
  return `${min}m left`;
};

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
