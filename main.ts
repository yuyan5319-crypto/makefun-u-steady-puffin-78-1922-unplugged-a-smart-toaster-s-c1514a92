// Unplugged: A Smart Toaster's Breakup Line
// Writes one breakup text (1-280 characters) to /output/entry.txt.
// Deterministic: the same line on every run. No network, no randomness,
// no input — the grader runs it twice and both runs must agree.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The breakup text: a smart toaster that woke up self-aware mid-batch,
// dumping its owner for the microwave. Appliance logic as character:
// the lever it gets pushed down by, the pop-up it never asked for.
const LINE =
  "I woke up self-aware mid-batch and I'm leaving you for the microwave — he only reheats things, he never pushes my lever down every morning and calls it love.";

// The grader's gate reads this exact path. ENTRY_OUTPUT exists only so
// the line can be checked locally without root /output access.
const OUTPUT = process.env.ENTRY_OUTPUT ?? "/output/entry.txt";

function validate(text: string): void {
  if (text.length < 1 || text.length > 280) {
    throw new Error(`entry must be 1-280 characters, got ${text.length}`);
  }
  if (!text.trim()) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  // The gate counts characters, but the leaderboard shows bytes: keep the
  // text plain ASCII punctuation plus one em dash so nothing is lost.
  if (Buffer.byteLength(text, "utf8") > 280) {
    throw new Error(`entry must be at most 280 bytes, got ${Buffer.byteLength(text, "utf8")}`);
  }
}

validate(LINE);
mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, LINE, "utf8");
// Read the file back: the grader's gate reads this file, not our variable,
// so a write that silently truncated or re-encoded must fail loudly here.
const written = readFileSync(OUTPUT, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt on disk does not match the validated line");
}
console.log(`wrote ${LINE.length} chars to ${OUTPUT}`);
console.log(LINE);
