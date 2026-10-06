/**
 * Renders a client page in a script-less, same-origin iframe at a fixed logical
 * width, so every player's page is measured at the same size. The visible frame
 * is scaled to fit its container.
 */
export const SANDBOX_WIDTH = 760;

export class Sandbox {
  readonly frame: HTMLIFrameElement;
  private styleEl: HTMLStyleElement | null = null;
  private resize: ResizeObserver | null = null;

  constructor(
    private host: HTMLElement,
    opts: { fit?: boolean; title?: string } = {},
  ) {
    this.frame = document.createElement('iframe');
    this.frame.className = 'sandbox-frame';
    this.frame.title = opts.title ?? 'Client site preview';
    // allow-same-origin lets the game measure the DOM; no allow-scripts means
    // nothing inside the page can run.
    this.frame.setAttribute('sandbox', 'allow-same-origin');
    this.frame.style.width = `${SANDBOX_WIDTH}px`;
    this.frame.style.border = '0';
    this.frame.style.display = 'block';
    host.append(this.frame);
    if (opts.fit) {
      this.resize = new ResizeObserver(() => this.fit());
      this.resize.observe(host);
    } else {
      this.frame.style.height = '1200px';
    }
  }

  get doc(): Document {
    return this.frame.contentDocument!;
  }

  async load(html: string, css: string): Promise<void> {
    await new Promise<void>((resolve) => {
      this.frame.addEventListener('load', () => resolve(), { once: true });
      this.frame.srcdoc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=${SANDBOX_WIDTH}"><style id="dq-player"></style></head><body>${html}</body></html>`;
    });
    this.styleEl = this.doc.getElementById('dq-player') as HTMLStyleElement;
    // Links inside client pages go nowhere.
    this.doc.addEventListener('click', (e) => {
      if ((e.target as Element).closest('a')) e.preventDefault();
    });
    this.setCss(css);
  }

  /** Swap the page's stylesheet. Text content, so `</style>` in CSS can't break out. */
  setCss(css: string): void {
    if (this.styleEl) this.styleEl.textContent = css;
  }

  private fit(): void {
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (!w || !h) return;
    const scale = Math.min(1, w / SANDBOX_WIDTH);
    this.frame.style.transformOrigin = '0 0';
    this.frame.style.transform = `scale(${scale})`;
    this.frame.style.height = `${h / scale}px`;
  }

  destroy(): void {
    this.resize?.disconnect();
    this.frame.remove();
  }
}
