import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, test } from "@playwright/test";

const SOLUTIONS = join(import.meta.dirname, "..", "solutions");

/** Solution files on disk, as level/boss pairs. */
const solved = readdirSync(SOLUTIONS).flatMap((level) =>
  readdirSync(join(SOLUTIONS, level))
    .filter((f) => f.endsWith(".css"))
    .map((f) => ({ level, boss: f.replace(/\.css$/, "") })),
);

async function openHarness(page: Page) {
  await page.goto("/tests/e2e/harness.html");
  await page.waitForSelector('body[data-ready="true"]', { state: "attached" });
}

test("every boss ships with a reference solution", async ({ page }) => {
  await openHarness(page);
  const bosses = await page.evaluate(() => window.dq.bosses());
  for (const b of bosses) {
    expect(
      existsSync(join(SOLUTIONS, b.level, `${b.boss}.css`)),
      `${b.level}/${b.boss} needs a solution`,
    ).toBe(true);
  }
});

for (const { level, boss } of solved) {
  test(`${level}/${boss}: the original is broken`, async ({ page }) => {
    await openHarness(page);
    const results = await page.evaluate(([l, b]) => window.dq.run(l, b), [level, boss]);
    const failingCore = results.filter((r) => r.kind === "core" && !r.pass);
    expect(failingCore.length, JSON.stringify(results, null, 2)).toBeGreaterThan(0);
  });

  test(`${level}/${boss}: the reference solution earns 3 stars`, async ({ page }) => {
    await openHarness(page);
    const css = readFileSync(join(SOLUTIONS, level, `${boss}.css`), "utf8");
    const results = await page.evaluate(([l, b, c]) => window.dq.run(l, b, c), [level, boss, css]);
    const failing = results.filter((r) => !r.pass);
    expect(failing, JSON.stringify(failing, null, 2)).toEqual([]);
  });
}
