import { el, esc } from '../util/dom';

/** Native <dialog> with focus trapping and Esc handling built in. */
export function openModal(opts: {
  title: string;
  body: HTMLElement | string;
  actions?: { label: string; kind?: 'primary' | 'ghost'; onClick: (close: () => void) => void }[];
  dismissable?: boolean;
}): { close: () => void; root: HTMLDialogElement } {
  const dialog = el<HTMLDialogElement>(`
    <dialog class="modal">
      <h2 class="modal-title">${esc(opts.title)}</h2>
      <div class="modal-body"></div>
      <div class="modal-actions"></div>
    </dialog>`);
  const body = dialog.querySelector('.modal-body')!;
  if (typeof opts.body === 'string') body.innerHTML = opts.body;
  else body.append(opts.body);
  const close = () => {
    dialog.close();
    dialog.remove();
  };
  const actions = dialog.querySelector('.modal-actions')!;
  for (const a of opts.actions ?? []) {
    const b = el<HTMLButtonElement>(`<button type="button" class="btn ${a.kind === 'ghost' ? 'btn-ghost' : 'btn-primary'}">${esc(a.label)}</button>`);
    b.addEventListener('click', () => a.onClick(close));
    actions.append(b);
  }
  dialog.addEventListener('cancel', (e) => {
    if (opts.dismissable === false) e.preventDefault();
    else close();
  });
  document.body.append(dialog);
  dialog.showModal();
  return { close, root: dialog };
}

export function confirmModal(title: string, body: string, confirmLabel: string): Promise<boolean> {
  return new Promise((resolve) => {
    openModal({
      title,
      body: `<p>${esc(body)}</p>`,
      actions: [
        { label: 'Cancel', kind: 'ghost', onClick: (close) => { close(); resolve(false); } },
        { label: confirmLabel, onClick: (close) => { close(); resolve(true); } },
      ],
    });
  });
}
