import type { CheckResult } from "../engine/types";
import { esc } from "../util/dom";
import { mark } from "./marks";

/**
 * Renders check results; pass/fail is carried by icon and word, not colour alone.
 * Bonus checks stay locked while any core check fails, so a broken page is never
 * praised for a side detail.
 */
export function renderJudgePanel(
  host: HTMLElement,
  results: CheckResult[],
  previous: Map<string, boolean>,
): void {
  const coreDone = results.filter((r) => r.kind === "core").every((r) => r.pass);
  const row = (r: CheckResult) => {
    const flipped = previous.has(r.id) && previous.get(r.id) !== r.pass;
    return `
      <li class="check${flipped ? " is-flipped" : ""}" data-pass="${r.pass}">
        <span class="check-icon" aria-hidden="true">${r.pass ? "✓" : "✗"}</span>
        <div>
          <p class="check-label"><span class="visually-hidden">${r.pass ? "Passing:" : "Failing:"} </span>${esc(r.label)}</p>
          <p class="check-detail">${esc(r.detail)}</p>
        </div>
      </li>`;
  };
  const lockedRow = (r: CheckResult) => `
      <li class="check" data-locked="true">
        <span class="check-icon" aria-hidden="true">${mark("lock")}</span>
        <div>
          <p class="check-label"><span class="visually-hidden">Locked: </span>${esc(r.label)}</p>
          <p class="check-detail">Opens when every must-pass check is green.</p>
        </div>
      </li>`;
  const core = results.filter((r) => r.kind === "core");
  const bonus = results.filter((r) => r.kind === "bonus");
  host.innerHTML = `
    <h3 class="judge-heading">Must pass <span>${core.filter((r) => r.pass).length}/${core.length}</span></h3>
    <ul class="checks">${core.map(row).join("")}</ul>
    <h3 class="judge-heading">Bonus stars <span>${coreDone ? `${bonus.filter((r) => r.pass).length}/${bonus.length}` : "locked"}</span></h3>
    <ul class="checks">${bonus.map(coreDone ? row : lockedRow).join("")}</ul>`;
  previous.clear();
  for (const r of results) previous.set(r.id, coreDone || r.kind === "core" ? r.pass : false);
}
