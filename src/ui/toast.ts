import { el, esc } from '../util/dom';

let region: HTMLElement | null = null;

/**
 * The region is a manual popover so it lives in the top layer. Re-showing it
 * moves it above any modal <dialog> opened since, so toasts are never hidden
 * behind a backdrop.
 */
function ensureRegion(): HTMLElement {
  if (!region) {
    region = el('<div class="toasts" role="status" aria-live="polite" popover="manual"></div>');
    document.body.append(region);
  }
  const open = region.matches(':popover-open');
  if (open && document.querySelector('dialog[open]')) region.hidePopover();
  if (!region.matches(':popover-open')) region.showPopover();
  return region;
}

export function toast(opts: { title: string; body?: string; glyph?: string; tone?: 'xp' | 'badge' | 'info' }): void {
  const node = el(`
    <div class="toast" data-tone="${opts.tone ?? 'info'}">
      ${opts.glyph ? `<span class="toast-glyph" aria-hidden="true">${esc(opts.glyph)}</span>` : ''}
      <div><strong>${esc(opts.title)}</strong>${opts.body ? `<p>${esc(opts.body)}</p>` : ''}</div>
    </div>`);
  ensureRegion().append(node);
  window.setTimeout(() => {
    node.classList.add('is-leaving');
    window.setTimeout(() => node.remove(), 400);
  }, opts.tone === 'badge' ? 5200 : 3200);
}
