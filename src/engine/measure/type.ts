import type { TextBlock, TypeSnapshot } from "../judges/hierarchy";
import { textContrast } from "./color";
import { describe, hasOwnText, isRendered, styleOf } from "./dom";

/**
 * Client pages mark intent for the hierarchy checks:
 *   [data-dq-focus="Label"]  the one thing the client needs seen first
 *   [data-dq-quiet]          secondary text (dates, captions) that should step back
 */

const HEADING = /^H([1-6])$/;

function headingLevel(el: Element): number {
  const h = el.closest("h1, h2, h3, h4, h5, h6");
  const m = h?.tagName.match(HEADING);
  return m ? Number(m[1]) : 0;
}

function ownChars(el: Element): number {
  return Array.from(el.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => (n.textContent ?? "").replace(/\s+/g, " ").trim())
    .join("").length;
}

/** Chars-weighted median of a numeric property over blocks. */
function weightedMedian(blocks: TextBlock[], pick: (b: TextBlock) => number): number {
  const sorted = blocks.slice().sort((a, b) => pick(a) - pick(b));
  const total = sorted.reduce((n, b) => n + b.chars, 0);
  let seen = 0;
  for (const b of sorted) {
    seen += b.chars;
    if (seen >= total / 2) return pick(b);
  }
  return 0;
}

export function measureType(doc: Document): TypeSnapshot {
  const blocks: TextBlock[] = Array.from(doc.body.querySelectorAll("*"))
    .filter((el) => hasOwnText(el) && isRendered(el))
    .map((el) => {
      const cs = styleOf(el);
      const focus = el.closest("[data-dq-focus]");
      return {
        where: describe(el),
        heading: headingLevel(el),
        fontSize: Number.parseFloat(cs.fontSize),
        weight: Number.parseFloat(cs.fontWeight) || 400,
        chars: ownChars(el),
        contrast: textContrast(el),
        focus: focus ? focus.getAttribute("data-dq-focus") || describe(focus) : null,
        quiet: el.closest("[data-dq-quiet]") !== null,
      };
    })
    .filter((b) => b.chars > 0);
  const body = blocks.filter((b) => b.heading === 0 && !b.focus && !b.quiet);
  return {
    blocks,
    body: {
      fontSize: weightedMedian(body, (b) => b.fontSize),
      weight: weightedMedian(body, (b) => b.weight),
      contrast: weightedMedian(body, (b) => b.contrast),
    },
  };
}
