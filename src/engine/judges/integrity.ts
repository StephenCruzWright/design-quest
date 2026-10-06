import type { CheckResult } from "../types";

/** One element that carries its own text, as rendered. */
export interface TextSample {
  where: string;
  /** False when the text has no rendered box (display: none, scale(0) and so on). */
  rendered: boolean;
  /** Computed font-size in px. */
  fontSize: number;
  /** Product of the element's and its ancestors' computed opacity. */
  opacity: number;
  /** Alpha of the computed text colour. */
  colorAlpha: number;
  /** Horizontal extent of the text's line boxes, in page px. */
  left: number;
  right: number;
}

export interface IntegrityLimits {
  pageWidth: number;
  minFontSize: number;
  minOpacity: number;
}

const DEFAULTS: IntegrityLimits = { pageWidth: 760, minFontSize: 12, minOpacity: 0.6 };

/** Why a sample fails, or null when it is readable. */
export function problemWith(s: TextSample, limits: IntegrityLimits = DEFAULTS): string | null {
  if (!s.rendered) return "is hidden";
  if (s.fontSize < limits.minFontSize) return `is ${Math.round(s.fontSize)}px`;
  if (s.opacity < limits.minOpacity) return `is at ${Math.round(s.opacity * 100)}% opacity`;
  if (s.colorAlpha < limits.minOpacity) return "has a see-through text colour";
  if (s.left < -1 || s.right > limits.pageWidth + 1) return "runs outside the page";
  return null;
}

/** Page intact: every piece of the client's text is still on the page and readable. */
export function judgeIntact(
  samples: TextSample[],
  limits: Partial<IntegrityLimits> = {},
): CheckResult {
  const l = { ...DEFAULTS, ...limits };
  const base = {
    id: "intact",
    kind: "core" as const,
    label: `Page intact: all the client's text stays visible, at least ${l.minFontSize}px and inside the page`,
  };
  const failing = samples
    .map((s) => ({ s, why: problemWith(s, l) }))
    .filter((f): f is { s: TextSample; why: string } => f.why !== null);
  if (failing.length === 0) {
    return {
      ...base,
      pass: true,
      detail: `All ${samples.length} text elements are visible, ${l.minFontSize}px or larger and within the ${l.pageWidth}px page.`,
    };
  }
  const named = failing
    .slice(0, 2)
    .map((f) => `${f.s.where} ${f.why}`)
    .join("; ");
  const more =
    failing.length > 2 ? ` ${failing.length - 2} more elements have the same problem.` : "";
  return {
    ...base,
    pass: false,
    detail: `${named}. The client needs every word on the page.${more}`,
  };
}
