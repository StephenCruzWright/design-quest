import type { Rect } from '../types';
import { union } from './geometry';

/** Helpers for measuring a rendered document. They run against the boss iframe. */

const REPLACED = new Set(['IMG', 'SVG', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'VIDEO', 'CANVAS', 'IFRAME', 'HR']);
const NON_VISUAL = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'TITLE', 'HEAD', 'BR', 'WBR', 'TEMPLATE']);

export function styleOf(el: Element): CSSStyleDeclaration {
  return el.ownerDocument.defaultView!.getComputedStyle(el);
}

export function toRect(r: DOMRect): Rect {
  return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
}

export function isRendered(el: Element): boolean {
  if (NON_VISUAL.has(el.tagName)) return false;
  if (el.closest('[data-dq-ignore]')) return false;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return false;
  const cs = styleOf(el);
  return cs.display !== 'none' && cs.visibility !== 'hidden';
}

/** Alpha channel of a computed color string (rgb(), rgba(), color(), oklch() ...). */
export function colorAlpha(color: string): number {
  if (!color || color === 'transparent') return 0;
  const slash = color.match(/\/\s*([\d.]+%?)\s*\)$/);
  if (slash) return slash[1].endsWith('%') ? parseFloat(slash[1]) / 100 : parseFloat(slash[1]);
  const rgba = color.match(/^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/);
  if (rgba) return parseFloat(rgba[1]);
  return 1;
}

/** Does the element paint a visible box (background, border or shadow)? */
export function hasVisibleBox(el: Element): boolean {
  const cs = styleOf(el);
  if (colorAlpha(cs.backgroundColor) > 0 || cs.backgroundImage !== 'none') return true;
  if (cs.boxShadow && cs.boxShadow !== 'none') return true;
  return (['Top', 'Right', 'Bottom', 'Left'] as const).some((side) => {
    const width = parseFloat(cs.getPropertyValue(`border-${side.toLowerCase()}-width`));
    const style = cs.getPropertyValue(`border-${side.toLowerCase()}-style`);
    const color = cs.getPropertyValue(`border-${side.toLowerCase()}-color`);
    return width > 0 && style !== 'none' && colorAlpha(color) > 0;
  });
}

function isBlockLevel(el: Element): boolean {
  return !styleOf(el).display.startsWith('inline') && styleOf(el).display !== 'contents';
}

function hasOwnText(el: Element): boolean {
  return Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim() !== '');
}

/**
 * The box a reader actually perceives. A painted box (card, button) is its border
 * box. An invisible wrapper is just the extent of what it contains, so padding on
 * an invisible wrapper counts as gap, not as part of the object.
 */
export function visualRect(el: Element): Rect | null {
  if (!isRendered(el)) return null;
  const own = toRect(el.getBoundingClientRect());
  if (REPLACED.has(el.tagName.toUpperCase()) || hasVisibleBox(el) || hasOwnText(el)) return own;
  const blockKids = Array.from(el.children).filter((c) => isRendered(c) && isBlockLevel(c));
  if (blockKids.length === 0) return own;
  return contentRect(el) ?? own;
}

/** Union of the visual boxes of an element's rendered children. */
export function contentRect(el: Element): Rect | null {
  const rects = Array.from(el.children)
    .map(visualRect)
    .filter((r): r is Rect => r !== null);
  return union(rects);
}

/** Short human label for an element, e.g. "h3", ".item-head", "p.price". */
export function describe(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const cls = el.classList[0];
  return cls ? `${tag}.${cls}` : tag;
}

export function renderedElements(root: Element): Element[] {
  return [root, ...Array.from(root.querySelectorAll('*'))].filter(isRendered);
}
