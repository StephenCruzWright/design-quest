import { el, esc } from '../util/dom';

let uid = 0;

export function slider(opts: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  onInput: (v: number) => void;
}): HTMLElement {
  const id = `sl-${++uid}`;
  const fmt = (v: number) => `${Number.isInteger(opts.step ?? 1) ? v : v.toFixed(2)}${opts.unit ?? ''}`;
  const node = el(`
    <div class="slider">
      <label for="${id}">${esc(opts.label)} <output>${fmt(opts.value)}</output></label>
      <input id="${id}" type="range" min="${opts.min}" max="${opts.max}" step="${opts.step ?? 1}" value="${opts.value}">
    </div>`);
  const input = node.querySelector('input')!;
  const out = node.querySelector('output')!;
  input.addEventListener('input', () => {
    const v = Number(input.value);
    out.textContent = fmt(v);
    opts.onInput(v);
  });
  return node;
}

export function toggleGroup(opts: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}): HTMLElement {
  const node = el(`
    <div class="segmented" role="radiogroup" aria-label="${esc(opts.label)}">
      ${opts.options
        .map(
          (o) =>
            `<button type="button" role="radio" aria-checked="${o.value === opts.value}" data-value="${esc(o.value)}">${esc(o.label)}</button>`,
        )
        .join('')}
    </div>`);
  const buttons = Array.from(node.querySelectorAll('button'));
  const select = (value: string) => {
    buttons.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.value === value)));
    opts.onChange(value);
  };
  buttons.forEach((b, i) => {
    b.addEventListener('click', () => select(b.dataset.value!));
    b.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      const next = buttons[(i + dir + buttons.length) % buttons.length];
      next.focus();
      select(next.dataset.value!);
    });
  });
  return node;
}
