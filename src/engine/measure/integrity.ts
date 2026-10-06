import type { TextSample } from "../judges/integrity";
import { colorAlpha, describe, hasOwnText, styleOf } from "./dom";

/** Extent of an element's own text nodes, from their rendered line boxes. */
function ownTextRect(el: Element): { left: number; right: number } | null {
  const doc = el.ownerDocument;
  let left = Infinity;
  let right = -Infinity;
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType !== Node.TEXT_NODE || (node.textContent ?? "").trim() === "") continue;
    const range = doc.createRange();
    range.selectNodeContents(node);
    for (const r of Array.from(range.getClientRects())) {
      if (r.width === 0 && r.height === 0) continue;
      left = Math.min(left, r.left);
      right = Math.max(right, r.right);
    }
  }
  return Number.isFinite(left) ? { left, right } : null;
}

function opacityChain(el: Element): number {
  let alpha = 1;
  for (let node: Element | null = el; node; node = node.parentElement) {
    alpha *= Number.parseFloat(styleOf(node).opacity) || 0;
  }
  return alpha;
}

/** Every element that carries its own text, outside [data-dq-ignore]. */
export function measureIntegrity(doc: Document): TextSample[] {
  return Array.from(doc.body.querySelectorAll("*"))
    .filter((el) => hasOwnText(el) && !el.closest("[data-dq-ignore]"))
    .map((el) => {
      const cs = styleOf(el);
      const rect = ownTextRect(el);
      const visible = cs.visibility !== "hidden" && rect !== null;
      return {
        where: describe(el),
        rendered: visible,
        fontSize: Number.parseFloat(cs.fontSize),
        opacity: opacityChain(el),
        colorAlpha: colorAlpha(cs.color),
        left: rect?.left ?? 0,
        right: rect?.right ?? 0,
      };
    });
}
