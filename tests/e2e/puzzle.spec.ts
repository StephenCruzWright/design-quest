import { expect, type Page, test } from "@playwright/test";

/** A save with the gestalt lesson and trial done, so its clients are open. */
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
        levels: { gestalt: level },
      }),
    );
  });
}

/** Pick a card, then the group to move it to. */
async function sort(page: Page, item: string, group: number) {
  await page.locator(`.sort-card[data-item="${item}"]`).click();
  await page.locator(`.bin-put[data-put="${group}"]`).click();
}

test("sorting the farm shop by colour and naming similarity ships the job", async ({ page }) => {
  await seed(page);
  await page.goto("/#/level/gestalt/boss/farmshop");
  await expect(page.getByRole("heading", { level: 1, name: "Hedgerow Farm Shop" })).toBeVisible();
  const submit = page.getByRole("button", { name: "Hand in" });
  await expect(submit).toBeDisabled();
  await expect(page.locator(".board-principle")).toBeHidden();

  const groups = [
    ["leeks", "apples", "jam"],
    ["eggs", "cheddar", "milk"],
    ["kale", "honey", "potatoes"],
  ];
  for (const [g, items] of groups.entries()) for (const id of items) await sort(page, id, g);
  await expect(page.locator('.sort-bin[data-found="true"]')).toHaveCount(3);

  // The question opens once every group is found. A wrong answer explains itself.
  await page.locator(".board-principle .option", { hasText: "Proximity" }).click();
  await expect(page.locator(".board-why")).toContainText("same distance");
  await page.locator(".board-principle .option", { hasText: "Similarity" }).click();
  await expect(page.locator(".boss-arena .arena")).toHaveAttribute("data-phase", "won");

  // Clean sort earned, first read missed: two stars.
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.getByRole("dialog")).toContainText("Hedgerow Farm Shop: job done");
});

test("cards move between groups and back to the unsorted tray", async ({ page }) => {
  await seed(page);
  await page.goto("/#/level/gestalt/boss/timetable");
  await sort(page, "yoga", 0);
  await sort(page, "chess", 0);
  await expect(page.locator(".sort-bin[data-bin='0']")).toContainText("Chess club");
  await sort(page, "chess", -1);
  await expect(page.locator(".sort-bin[data-bin='0'] .sort-card")).toHaveCount(1);
});
