import { el, prefersReducedMotion } from "../util/dom";

/**
 * Feedback and reward effects. Each one has a still version: under reduced
 * motion the end state appears at once and decorative effects are skipped.
 */

export type StampTone = "good" | "bad" | "ship";

/** A rubber stamp that lands on `host`. Returns the stamp so it can be removed. */
export function stamp(host: HTMLElement, text: string, tone: StampTone): HTMLElement {
  host.querySelector(":scope > .stamp")?.remove();
  const node = el(`<span class="stamp" data-tone="${tone}" aria-hidden="true">${text}</span>`);
  host.classList.add("has-stamp");
  host.append(node);
  return node;
}

/** One short horizontal shake, for a wrong answer. */
export function shake(target: HTMLElement): void {
  target.classList.remove("is-shaking");
  void target.offsetWidth;
  target.classList.add("is-shaking");
  target.addEventListener("animationend", () => target.classList.remove("is-shaking"), {
    once: true,
  });
}

/** Count a number up inside `target`. */
export function countUp(
  target: HTMLElement,
  to: number,
  opts: { from?: number; ms?: number; format?: (n: number) => string } = {},
): void {
  const format = opts.format ?? ((n: number) => String(n));
  const from = opts.from ?? 0;
  if (prefersReducedMotion() || to === from) {
    target.textContent = format(to);
    return;
  }
  const ms = opts.ms ?? 700;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    const eased = 1 - (1 - t) ** 3;
    target.textContent = format(Math.round(from + (to - from) * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const CONFETTI_COLOURS = ["--accent", "--good", "--star", "--index-rule", "--note"];

/** Paper strips that burst from a point and fall. Skipped under reduced motion. */
export function confetti(origin: { x: number; y: number }, count = 36): void {
  if (prefersReducedMotion()) return;
  const layer = el('<div class="confetti" aria-hidden="true"></div>');
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const speed = 120 + Math.random() * 220;
    const strip = document.createElement("span");
    strip.style.cssText = [
      `--x:${origin.x}px`,
      `--y:${origin.y}px`,
      `--dx:${Math.cos(angle) * speed}px`,
      `--dy:${Math.sin(angle) * speed}px`,
      `--spin:${(Math.random() - 0.5) * 900}deg`,
      `--delay:${Math.random() * 120}ms`,
      `background:var(${CONFETTI_COLOURS[i % CONFETTI_COLOURS.length]})`,
    ].join(";");
    layer.append(strip);
  }
  document.body.append(layer);
  window.setTimeout(() => layer.remove(), 2000);
}

/** Centre of an element on screen, for aiming confetti. */
export function centreOf(target: Element): { x: number; y: number } {
  const r = target.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** Resolve after `ms`, or at once under reduced motion. A beat between rewards. */
export function beat(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, prefersReducedMotion() ? 0 : ms));
}
