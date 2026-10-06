/**
 * Ada Kern's portrait, in the same line style as the player sprite. Her
 * expression is a data attribute, so a reaction is one attribute change.
 */

export type AdaExpression = "neutral" | "eyebrow" | "nod";

export function adaHtml(expr: AdaExpression = "neutral", size: "s" | "l" = "s"): string {
  return `<span class="ada-portrait ada-${size}" data-expr="${expr}" aria-hidden="true">
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false">
      <path class="ada-coat" d="M9 64c2-10 10-15 23-15s21 5 23 15z"/>
      <path class="ada-collar" d="M26 50l6 7 6-7"/>
      <g class="ada-head">
        <circle class="sp-skin" cx="32" cy="30" r="14"/>
        <path class="ada-hair" d="M16 38V27c0-9 7-15 16-15s16 6 16 15v11h-4V25c-7 2-16 1-22-3-1 4-2 9-2 16z"/>
        <path class="ada-pencil" d="M47 21l7-9"/>
        <g class="ada-glasses"><rect x="22.5" y="28" width="8" height="5.5" rx="1"/><rect x="33.5" y="28" width="8" height="5.5" rx="1"/><path d="M30.5 30.5h3"/></g>
        <circle class="ada-eye" cx="26.5" cy="31" r="1.1"/><circle class="ada-eye" cx="37.5" cy="31" r="1.1"/>
        <path class="ada-brow-l" d="M23 25.5h6"/>
        <path class="ada-brow-r" d="M35 25.5h6"/>
        <path class="ada-mouth-flat" d="M28.5 38.5h7"/>
        <path class="ada-mouth-smile" d="M28 37.5q4 3 8 0"/>
      </g>
    </svg>
  </span>`;
}

export function setAdaExpression(host: ParentNode, expr: AdaExpression): void {
  const portrait = host.querySelector<HTMLElement>(".ada-portrait");
  if (!portrait) return;
  delete portrait.dataset.expr;
  void portrait.offsetWidth;
  portrait.dataset.expr = expr;
}
