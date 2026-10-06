import type { SpacingSnapshot, StackMeasure } from "../judges/spacing";
import type { Rect } from "../types";
import { contentRect, describe, isRendered, renderedElements, styleOf, visualRect } from "./dom";
import { gapBetween, overlapsVertically, type Sample } from "./geometry";

/**
 * Boss pages mark their structure with data attributes:
 *   [data-dq-section]        top-level page sections, in order
 *   [data-dq-stack="Label"]  a container whose [data-dq-group] children are sibling groups
 */

const VALUE_PROPS = [
  "margin-top",
  "margin-bottom",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
] as const;

function consecutiveGaps(rects: Rect[], stackedOnly: boolean): number[] {
  const gaps: number[] = [];
  for (let i = 1; i < rects.length; i++) {
    // Side-by-side children inside a group (e.g. a name and a price on one line)
    // are a layout choice, not a grouping signal, so they're skipped.
    if (stackedOnly && overlapsVertically(rects[i - 1], rects[i])) continue;
    gaps.push(gapBetween(rects[i - 1], rects[i]));
  }
  return gaps;
}

function measureStack(stack: Element): StackMeasure {
  const groups = Array.from(stack.children).filter(
    (c) => c.hasAttribute("data-dq-group") && isRendered(c),
  );
  const groupRects = groups.map(visualRect).filter((r): r is Rect => r !== null);
  const within = groups.flatMap((g) => {
    const kids = Array.from(g.children)
      .map(visualRect)
      .filter((r): r is Rect => r !== null);
    return consecutiveGaps(kids, true);
  });
  return {
    label: stack.getAttribute("data-dq-stack") || describe(stack),
    between: consecutiveGaps(groupRects, false),
    within,
  };
}

export function spacingValues(doc: Document): Sample[] {
  const samples: Sample[] = [];
  for (const el of renderedElements(doc.body)) {
    const cs = styleOf(el);
    const props: string[] = [...VALUE_PROPS];
    if (/flex|grid/.test(cs.display)) props.push("row-gap", "column-gap");
    for (const prop of props) {
      const v = Math.abs(parseFloat(cs.getPropertyValue(prop)));
      if (Number.isFinite(v) && v >= 2)
        samples.push({ px: Math.round(v * 10) / 10, where: `${describe(el)} ${prop}` });
    }
  }
  return samples;
}

export function measureSpacing(doc: Document): SpacingSnapshot {
  const stacks = Array.from(doc.querySelectorAll("[data-dq-stack]"))
    .filter(isRendered)
    .map(measureStack);
  const sectionRects = Array.from(doc.querySelectorAll("[data-dq-section]"))
    .filter(isRendered)
    .map(contentRect)
    .filter((r): r is Rect => r !== null);
  return {
    stacks,
    sectionGaps: consecutiveGaps(sectionRects, false),
    values: spacingValues(doc),
  };
}
