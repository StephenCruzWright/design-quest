/** Star rating with a text alternative; filled vs empty is shape, not just colour. */
export function starsHtml(n: number, max = 3, size: "s" | "l" = "s"): string {
  const stars = Array.from({ length: max }, (_, i) =>
    i < n ? '<span class="star is-on">★</span>' : '<span class="star">☆</span>',
  ).join("");
  return `<span class="stars stars-${size}" role="img" aria-label="${n} of ${max} stars">${stars}</span>`;
}
