export type Cleanup = () => void;
export type Screen = (root: HTMLElement, params: Record<string, string>) => void | Cleanup;

interface Route {
  pattern: RegExp;
  keys: string[];
  screen: Screen;
  chrome: boolean;
}

const routes: Route[] = [];

/** Register a hash route like '/level/:id/boss/:boss'. */
export function route(path: string, screen: Screen, opts: { chrome?: boolean } = {}): void {
  const keys: string[] = [];
  const pattern = new RegExp(
    '^' +
      path.replace(/\/:([a-z]+)/gi, (_, k) => {
        keys.push(k);
        return '/([^/]+)';
      }) +
      '/?$',
  );
  routes.push({ pattern, keys, screen, chrome: opts.chrome ?? true });
}

export function go(path: string): void {
  location.hash = `#${path}`;
}

export function startRouter(root: HTMLElement, onChrome: (visible: boolean) => void): void {
  let cleanup: Cleanup | void;
  const render = () => {
    const path = location.hash.replace(/^#/, '') || '/';
    const match = routes.find((r) => r.pattern.test(path)) ?? routes[0];
    const values = path.match(match.pattern)?.slice(1) ?? [];
    const params = Object.fromEntries(match.keys.map((k, i) => [k, decodeURIComponent(values[i] ?? '')]));
    if (cleanup) cleanup();
    root.replaceChildren();
    root.scrollTo?.(0, 0);
    window.scrollTo(0, 0);
    onChrome(match.chrome);
    cleanup = match.screen(root, params);
    // Move focus to the new screen's heading for keyboard and screen-reader users.
    root.querySelector<HTMLElement>('h1')?.setAttribute('tabindex', '-1');
    root.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
  };
  window.addEventListener('hashchange', render);
  render();
}
