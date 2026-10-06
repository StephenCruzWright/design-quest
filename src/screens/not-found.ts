import { el } from '../util/dom';

export function notFound(root: HTMLElement): void {
  root.append(
    el(`
    <div class="page">
      <h1>Nothing at this desk</h1>
      <p>This part of the studio doesn't exist (yet).</p>
      <a class="btn btn-primary" href="#/map">Back to the map</a>
    </div>`),
  );
}
