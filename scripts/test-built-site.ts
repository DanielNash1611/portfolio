import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import { CASE_STUDIES } from "../data/caseStudies";
import { systemChapters, systemHref } from "../content/product-system";
import { resumeVariants, workEntries } from "../content/portfolio";

async function main() {
  // Run only against our own child process, with no provider or database credentials.
  const probe = createServer();
  probe.listen(0, "127.0.0.1");
  await once(probe, "listening");
  const address = probe.address();
  assert.ok(address && typeof address !== "string");
  const port = address.port;
  await new Promise<void>((resolve) => probe.close(() => resolve()));
  const child = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      String(port),
    ],
    {
      env: {
        PATH: process.env.PATH,
        NODE_ENV: "production",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let output = "";
  child.stdout.on("data", (data) => {
    output += data;
  });
  child.stderr.on("data", (data) => {
    output += data;
  });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (child.exitCode !== null) throw new Error(output);
      try {
        ready = (await fetch(base)).ok;
      } catch {}
      if (ready) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(ready, output);
    for (const entry of CASE_STUDIES) {
      const response = await fetch(`${base}/case-studies/${entry.slug}`);
      assert.equal(response.status, 200, entry.slug);
      assert.ok(
        (await response.text()).includes(entry.title.replaceAll("&", "&amp;")),
        entry.slug,
      );
    }
    for (const entry of workEntries) {
      const response = await fetch(`${base}${entry.href}`);
      assert.equal(response.status, 200, entry.href);
      assert.ok((await response.text()).includes("<h1"), entry.href);
    }
    for (const route of [
      "/product-system",
      ...systemChapters.map((chapter) => systemHref(chapter.slug)),
    ]) {
      const response = await fetch(`${base}${route}`);
      assert.equal(response.status, 200, route);
      assert.ok((await response.text()).includes("<h1"), route);
    }
    for (const template of [
      "idea-intake",
      "living-prd",
      "agent-context",
      "evidence-review",
    ]) {
      const response = await fetch(
        `${base}/downloads/product-system/${template}.md`,
      );
      assert.equal(response.status, 200, template);
      assert.ok((await response.text()).length > 100, template);
    }
    for (const variant of resumeVariants) {
      const response = await fetch(`${base}/resumes/${variant.filename}`);
      assert.equal(response.status, 200);
      assert.ok(
        response.headers.get("content-type")?.includes("application/pdf"),
      );
      assert.equal(
        Buffer.from(await response.arrayBuffer())
          .subarray(0, 5)
          .toString(),
        "%PDF-",
      );
    }
    console.log(
      `Built site passed: ${CASE_STUDIES.length} case studies, ${workEntries.length} work pages, ${resumeVariants.length} PDF downloads, ${systemChapters.length + 1} Product System routes, 4 templates.`,
    );
  } finally {
    if (child.exitCode === null) {
      child.kill("SIGTERM");
      await once(child, "exit");
    }
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
