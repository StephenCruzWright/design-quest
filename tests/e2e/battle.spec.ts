import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, test } from "@playwright/test";

const SOLUTIONS = join(import.meta.dirname, "..", "solutions");

/** A save with the spacing lesson and trial done, so its clients are open. */
async function seed(page: Page) {
  // Written before the app boots, because the store reads the save once on load.
  await page.addInitScript(() => {
    const level = { lessonDone: true, lessonPage: 99, quizBest: 5, quizTotal: 5, bosses: {} };
    localStorage.setItem(
      "design-quest/save/v1",
      JSON.stringify({
        v: 1,
        xp: 0,
        badges: {},
        rules: [],
        drafts: {},
        settings: { theme: "light", hard: false, reducedMotion: true },
        player: { name: "Test", look: 0 },
        createdAt: new Date().toISOString(),
        levels: { spacing: level },
      }),
    );
  });
}

test("fixing every core check beats the foe and brings back the client", async ({ page }) => {
  await seed(page);
  await page.goto("/#/level/spacing/boss/bakery");
  const arena = page.locator(".boss-arena .arena");
  await expect(arena.locator(".arena-name")).toHaveText("The Cram");
  await expect(arena).toHaveAttribute("data-phase", "fight");
  await expect(arena.locator(".foe")).toBeVisible();
  await expect(arena.locator(".arena-hp-label")).not.toHaveText(/HP 0\//);

  const css = readFileSync(join(SOLUTIONS, "spacing", "bakery.css"), "utf8");
  await page.locator(".cm-content").click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText(css);

  await expect(arena).toHaveAttribute("data-phase", "won");
  await expect(arena.locator(".arena-hp-label")).toHaveText(/HP 0\//);
  await expect(arena.locator(".foe")).toBeHidden();
  await expect(arena.locator(".arena-client")).toBeVisible();
  await expect(arena.locator(".arena-caption")).toContainText("Rosa, owner");
});

test("a right trial answer takes one HP off the foe; a wrong one takes none", async ({ page }) => {
  await seed(page);
  await page.goto("/#/level/spacing/trial");
  const label = page.locator(".trial-battle .arena-hp-label");
  await expect(label).toHaveText("HP 5/5");

  await page.locator('.option[data-i="0"]').click();
  // The right option is marked once any answer is in.
  const right = await page.locator('.option[data-state="right"]').getAttribute("data-i");
  await expect(label).toHaveText(right === "0" ? "HP 4/5" : "HP 5/5");
});
