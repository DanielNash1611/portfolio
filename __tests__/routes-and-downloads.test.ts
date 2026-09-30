import assert from "node:assert/strict";
import test from "node:test";
import { readFile, access } from "node:fs/promises";
import { resumeVariants, workEntries } from "@/content/portfolio";
import { getPageContextByPath } from "@/lib/portfolio-guide/context";

test("published work routes have a page and matching guide context", async () => {
  for (const entry of workEntries) {
    await access(`app${entry.href}/page.tsx`);
    const context = getPageContextByPath(entry.href);
    assert.ok(context, entry.href);
    assert.equal(context.href, entry.href);
  }
});

test("every advertised resume download is a nonempty PDF", async () => {
  assert.ok(resumeVariants.length > 0);
  for (const variant of resumeVariants) {
    const bytes = await readFile(`public/resumes/${variant.filename}`);
    assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
    assert.ok(bytes.byteLength > 1000, variant.filename);
    assert.ok(bytes.subarray(-1024).toString().includes("%%EOF"));
  }
});
