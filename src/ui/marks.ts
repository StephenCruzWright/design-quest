/**
 * Small line marks drawn for the game, used on badges, toasts and buttons in
 * place of emoji. 24×24 viewBox, 1.75 stroke, `currentColor`, so they inherit
 * the text colour and stay crisp at any size.
 */
const PATHS = {
  cup: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M9 3c-.8 1 .8 2 0 3M12.5 3c-.8 1 .8 2 0 3"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.75"/>',
  spread:
    '<path d="M4 4h16M4 20h16"/><path d="M12 7.5v9M9.5 10 12 7.5l2.5 2.5M9.5 14l2.5 2.5 2.5-2.5"/>',
  token: '<path d="M8 4 6 20M18 4l-2 16M4 9h16M3 15h16"/>',
  tiers: '<path d="M4 5h16M4 8h16"/><path d="M4 13h16"/><path d="M4 20h16"/>',
  door: '<path d="M6 21V4h12v17"/><path d="M3 21h18"/><circle cx="14.5" cy="12.5" r=".9" fill="currentColor"/>',
  hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6.5 7S5 17.5 4 15l-1-2.5a1.5 1.5 0 0 1 2.7-1.3L8 14"/>',
  clock: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M10 2.5h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/><circle cx="12" cy="12" r="10" stroke-dasharray="3 3"/>',
  up: '<path d="M12 19V6M6.5 11.5 12 6l5.5 5.5"/><path d="M5 21h14"/>',
  star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
} as const;

export type MarkName = keyof typeof PATHS;

export function mark(name: MarkName, label?: string): string {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg class="mark" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${PATHS[name]}</svg>`;
}
