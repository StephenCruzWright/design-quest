import type { CheckResult } from "../engine/types";
import { esc } from "../util/dom";

/** Renders check results; pass/fail is carried by icon and word, not colour alone. */
export function renderJudgePanel(
  host: HTMLElement,
  results: CheckResult[],
  previous: Map<string, boolean>,
): void {
  const section = (kind: "core" | "bonus", heading: string) => {
    const items = results.filter((r) => r.kind === kind);
    return `
      <h3 class="judge-heading">${heading} <span>${items.filter((r) => r.pass).length}/${items.length}</span></h3>
      <ul class="checks">
        ${items
          .map((r) => {
            const flipped = previous.has(r.id) && previous.get(r.id) !== r.pass;
            return `
            <li class="check${flipped ? " is-flipped" : ""}" data-pass="${r.pass}">
              <span class="check-icon" aria-hidden="true">${r.pass ? "✓" : "✗"}</span>
              <div>
                <p class="check-label"><span class="visually-hidden">${r.pass ? "Passing:" : "Failing:"} </span>${esc(r.label)}</p>
                <p class="check-detail">${esc(r.detail)}</p>
              </div>
            </li>`;
          })
          .join("")}
      </ul>`;
  };
  host.innerHTML = section("core", "Must pass") + section("bonus", "Bonus stars");
  previous.clear();
  for (const r of results) previous.set(r.id, r.pass);
}
