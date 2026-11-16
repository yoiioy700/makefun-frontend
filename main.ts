// Entrypoint: hand the app in. Copies app/ and screenshots/ beside this file
// to the output dir and writes dossier.json with buildDossier from the
// vendored make.fun library — the dossier the judge reads, and the gate
// requires it byte for byte what that library writes. Leave
// vendor/makefun-frontend.ts unchanged: it is the kit's copy (sha256
// 4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240, as in the
// kit manifest). The library only reads app/ and screenshots/ and writes
// the dossier; it makes no network calls and spawns no processes.
// Run with Node 22+: `node main.ts`.
// Output dir: $MAKEFUN_OUTPUT_DIR, or /output when that is set by the
// grader, otherwise ./out (local default, never /output on a dev machine
// unless MAKEFUN_OUTPUT_DIR says so).
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const root = dirname(fileURLToPath(import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR || join(root, "out");

mkdirSync(out, { recursive: true });
const src = join(root, "app");
if (!existsSync(src)) throw new Error("app/ not found next to main.ts");
cpSync(src, join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(root, "screenshots")))
  cpSync(join(root, "screenshots"), join(out, "screenshots"), {
    recursive: true,
  });

// The scorer's own caps: only text_max_bytes shapes the bytes; the others
// refuse an entry the scorer would refuse (more than 3 screenshots or one
// over 256 KiB; more than 993 files and directories in app/ or 16 MiB of
// app files).
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 3, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
console.log(`Handed in app/ + screenshots/ + dossier.json -> ${out}`);
