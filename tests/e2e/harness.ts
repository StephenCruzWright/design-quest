/**
 * Test-only page served by Vite in dev. It exposes the real sandbox + judges so
 * Playwright can run any CSS against any boss in a real browser.
 */

import { Sandbox } from "../../src/engine/sandbox";
import type { CheckResult } from "../../src/engine/types";
import { LEVELS } from "../../src/levels";

declare global {
  interface Window {
    dq: {
      bosses: () => { level: string; boss: string }[];
      run: (level: string, boss: string, css?: string, hard?: boolean) => Promise<CheckResult[]>;
    };
  }
}

window.dq = {
  bosses: () => LEVELS.flatMap((l) => l.bosses.map((b) => ({ level: l.id, boss: b.id }))),
  async run(levelId, bossId, css, hard = false) {
    const level = LEVELS.find((l) => l.id === levelId)!;
    const boss = level.bosses.find((b) => b.id === bossId)!;
    const sandbox = new Sandbox(document.body);
    const sheet = css ?? boss.css;
    await sandbox.load(boss.html, sheet);
    const results = level.judge(sandbox.doc, sheet, { hard });
    sandbox.destroy();
    return results;
  },
};
document.body.dataset.ready = "true";
