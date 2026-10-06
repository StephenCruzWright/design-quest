import { expect, type Page, test } from "@playwright/test";

const next = (page: Page) => page.getByRole("button", { name: "Next →" });

/** Page 1 is a goal gate: drag the demo until between ≥ 2× within. */
async function passPageOne(page: Page) {
  await page.getByLabel("Gap inside a dish").fill("8");
  await page.getByLabel("Gap between dishes").fill("24");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/#/level/spacing/lesson");
  await expect(page.getByRole("heading", { level: 1, name: "Space is a signal" })).toBeVisible();
});

test("a goal gate opens the next page only when the demo reaches the goal", async ({ page }) => {
  await expect(next(page)).toBeDisabled();
  await expect(page.getByText("Pass the checkpoint to open the next page.")).toBeVisible();
  await page.getByLabel("Gap between dishes").fill("20");
  await expect(next(page)).toBeDisabled();
  await passPageOne(page);
  await expect(next(page)).toBeEnabled();
});

test("a choice gate stays locked on a wrong answer and explains why", async ({ page }) => {
  await passPageOne(page);
  await next(page).click();
  await expect(page.getByRole("heading", { level: 1, name: "Between > within" })).toBeVisible();
  await expect(next(page)).toBeDisabled();

  const wrong = page.getByRole("button", { name: /The text above it/ });
  await wrong.click();
  await expect(wrong).toBeDisabled();
  await expect(
    page.getByText("Reading order doesn't create grouping.", { exact: false }),
  ).toBeVisible();
  await expect(next(page)).toBeDisabled();

  await page.getByRole("button", { name: /Neither: it sits halfway/ }).click();
  await expect(next(page)).toBeEnabled();
  await expect(page.getByText("Why:", { exact: false })).toBeVisible();
});

test("locked pages can't be skipped to, and passed pages are remembered", async ({ page }) => {
  await expect(page.getByRole("button", { name: /Page 3: .*locked/ })).toBeDisabled();
  await passPageOne(page);
  await page.reload();
  // The lesson resumes at the first page whose gate is still open.
  await expect(page.getByRole("heading", { level: 1, name: "Between > within" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Page 1: .*passed/ })).toBeEnabled();
});

test("reduced motion turns the sprite's animations into instant state changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await passPageOne(page);
  const duration = await page
    .locator(".gate .sprite .sp-fig")
    .evaluate((el) => getComputedStyle(el).animationDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});
