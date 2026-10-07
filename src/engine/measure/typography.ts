import type { FamilyUse, HeadingSetting, ProseParagraph } from "../judges/typography";
import { describe, hasOwnText, isRendered, styleOf } from "./dom";

/**
 * Client pages mark intent for the typography checks:
 *   [data-dq-prose]  a block of running text; its paragraphs are the body text
 */

export interface LineBox {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/** The rendered lines of an element's text, read from a DOM Range and merged by row. */
export function lineBoxes(el: Element): LineBox[] {
  const range = el.ownerDocument.createRange();
  range.selectNodeContents(el);
  const rects = Array.from(range.getClientRects())
    .filter((r) => r.width > 0 && r.height > 0)
    .sort((a, b) => a.top - b.top);
  const lines: LineBox[] = [];
  for (const r of rects) {
    const mid = (r.top + r.bottom) / 2;
    const line = lines.find((l) => mid > l.top && mid < l.bottom);
    if (line) {
      line.left = Math.min(line.left, r.left);
      line.right = Math.max(line.right, r.right);
      line.top = Math.min(line.top, r.top);
      line.bottom = Math.max(line.bottom, r.bottom);
    } else lines.push({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
  }
  return lines;
}

/** Lines, with the last one counted as the share of the widest line it fills. */
export function fullLines(lines: LineBox[]): number {
  if (lines.length <= 1) return lines.length;
  const widest = Math.max(...lines.map((l) => l.right - l.left));
  const last = lines[lines.length - 1];
  return lines.length - 1 + (widest > 0 ? (last.right - last.left) / widest : 1);
}

export const textLength = (el: Element) =>
  (el.textContent ?? "").replace(/\s+/g, " ").trim().length;

/**
 * The used line height in px. A unitless or length line-height computes to px.
 * `normal` depends on the font, so it is read from the rendered lines instead.
 */
function usedLineHeight(el: Element, lines: LineBox[]): number {
  const cs = styleOf(el);
  const set = Number.parseFloat(cs.lineHeight);
  if (Number.isFinite(set)) return set;
  if (lines.length >= 2) return (lines[lines.length - 1].top - lines[0].top) / (lines.length - 1);
  const box = el.getBoundingClientRect().height;
  const pad = ["padding-top", "padding-bottom", "border-top-width", "border-bottom-width"]
    .map((p) => Number.parseFloat(cs.getPropertyValue(p)) || 0)
    .reduce((a, b) => a + b, 0);
  return Math.max(box - pad, 0) / Math.max(lines.length, 1);
}

const CODE = "code, pre, kbd, samp";

/** The first family in a computed font-family stack, without quotes. */
export function primaryFamily(stack: string): string {
  const first = stack.split(",")[0] ?? "";
  return first.trim().replace(/^["']|["']$/g, "");
}

export function measureTypography(doc: Document): {
  paragraphs: ProseParagraph[];
  headings: HeadingSetting[];
  families: FamilyUse[];
} {
  const prose = Array.from(doc.body.querySelectorAll("[data-dq-prose] p")).filter(
    (p) => isRendered(p) && textLength(p) > 0,
  );
  const paragraphs = prose.map((p): ProseParagraph => {
    const lines = lineBoxes(p);
    const next = p.nextElementSibling;
    const rect = p.getBoundingClientRect();
    const gapAfter =
      next && prose.includes(next) ? next.getBoundingClientRect().top - rect.bottom : null;
    const block = p.closest("[data-dq-prose]");
    return {
      // Body paragraphs rarely carry a class, so name them by their block.
      where: p.classList.length === 0 && block ? `${describe(block)} p` : describe(p),
      chars: textLength(p),
      lines: lines.length,
      fullLines: fullLines(lines),
      fontSize: Number.parseFloat(styleOf(p).fontSize),
      lineHeight: usedLineHeight(p, lines),
      gapAfter,
    };
  });

  const headings = Array.from(doc.body.querySelectorAll("h1, h2, h3, h4, h5, h6"))
    .filter((h) => isRendered(h) && textLength(h) > 0)
    .map(
      (h): HeadingSetting => ({
        where: describe(h),
        fontSize: Number.parseFloat(styleOf(h).fontSize),
        lineHeight: usedLineHeight(h, lineBoxes(h)),
      }),
    );

  const families = Array.from(doc.body.querySelectorAll("*"))
    .filter((el) => hasOwnText(el) && isRendered(el) && !el.closest(CODE))
    .map(
      (el): FamilyUse => ({
        family: primaryFamily(styleOf(el).fontFamily),
        where: describe(el),
        chars: Array.from(el.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => (n.textContent ?? "").trim())
          .join("").length,
      }),
    );

  return { paragraphs, headings, families };
}
