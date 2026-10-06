import type { EditorView } from '@codemirror/view';
import type { Screen } from '../router';
import { go } from '../router';
import { levelById } from '../levels';
import type { BossDef, LevelDef } from '../levels/types';
import { Sandbox, SANDBOX_WIDTH } from '../engine/sandbox';
import { starsFor, type CheckResult } from '../engine/types';
import { store, emptyLevel } from '../state/save';
import { commit } from '../state/rewards';
import { bossXp, improvement } from '../state/progress';
import { cssEditor, htmlViewer, setEditorText } from '../ui/editor';
import { renderJudgePanel } from '../ui/judge-panel';
import { toggleGroup } from '../ui/controls';
import { confirmModal, openModal } from '../ui/modal';
import { starsHtml } from '../ui/stars';
import { debounce, el, esc, formatTime } from '../util/dom';
import { notFound } from './not-found';

const MIN_RATIONALE = 30;

function askRationale(previous: string): Promise<string | null> {
  return new Promise((resolve) => {
    const body = el(`
      <div class="rationale">
        <p>Before Ada signs off: in a sentence or two, <strong>why</strong> does your fix work? Name the principle. This goes into your case study.</p>
        <label class="visually-hidden" for="rationale-text">Your rationale</label>
        <textarea id="rationale-text" rows="4" placeholder="I pulled each title closer to its own excerpt and pushed the posts apart, so that…"></textarea>
        <p class="rationale-words">Words to reach for: <em>proximity</em>, <em>between &gt; within</em>, <em>ratio scale</em>, <em>tiers</em>, <em>tokens</em>.</p>
        <p class="rationale-count" aria-live="polite"></p>
      </div>`);
    const ta = body.querySelector('textarea')!;
    const count = body.querySelector<HTMLElement>('.rationale-count')!;
    ta.value = previous;
    const modal = openModal({
      title: 'Explain your fix',
      body,
      actions: [
        { label: 'Back to editing', kind: 'ghost', onClick: (close) => { close(); resolve(null); } },
        { label: 'Submit to client', onClick: (close) => { if (ta.value.trim().length >= MIN_RATIONALE) { close(); resolve(ta.value.trim()); } } },
      ],
    });
    const submit = modal.root.querySelector<HTMLButtonElement>('.btn-primary')!;
    const sync = () => {
      const n = ta.value.trim().length;
      submit.disabled = n < MIN_RATIONALE;
      count.textContent = n < MIN_RATIONALE ? `${MIN_RATIONALE - n} more characters to go` : 'Ready to submit';
    };
    ta.addEventListener('input', sync);
    sync();
    ta.focus();
  });
}

function showResults(opts: {
  level: LevelDef;
  boss: BossDef;
  stars: number;
  prevStars: number;
  xp: number;
  seconds: number;
  hints: number;
  results: CheckResult[];
}) {
  const { level, boss, stars, prevStars, xp, seconds, hints, results } = opts;
  const idx = level.bosses.indexOf(boss);
  const next = level.bosses[(idx + 1) % level.bosses.length];
  const passed = results.filter((r) => r.pass).length;
  const lines = [
    stars === 3 ? 'Three stars. The client wants to frame your stylesheet.' : stars === 2 ? 'Client is happy. One bonus check left on the table.' : 'Shipped! The core problem is fixed. Bonus checks would earn more stars.',
  ];
  const body = el(`
    <div class="results">
      <div class="results-stars">${starsHtml(stars, 3, 'l')}</div>
      <p class="results-line">${esc(lines[0])}</p>
      <dl class="results-stats">
        <div><dt>XP</dt><dd>${xp > 0 ? `+${xp}` : stars <= prevStars ? 'No new XP (best was ' + prevStars + '★)' : '+0'}</dd></div>
        <div><dt>Time</dt><dd>${formatTime(seconds)}</dd></div>
        <div><dt>Hints</dt><dd>${hints}</dd></div>
        <div><dt>Checks</dt><dd>${passed}/${results.length}</dd></div>
      </dl>
    </div>`);
  openModal({
    title: `${boss.client}: job done`,
    body,
    actions: [
      { label: 'Keep polishing', kind: 'ghost', onClick: (close) => close() },
      { label: 'Back to desk', kind: 'ghost', onClick: (close) => { close(); go(`/level/${level.id}`); } },
      { label: `Next client: ${next.client}`, onClick: (close) => { close(); go(`/level/${level.id}/boss/${next.id}`); } },
    ],
  });
}

export const bossScreen: Screen = (root, params) => {
  const level = levelById(params.id);
  const boss = level?.bosses.find((b) => b.id === params.boss);
  if (!level || !boss) return notFound(root);
  if (!store.level(level.id).quizTotal) {
    root.append(
      el(`<div class="page"><h1>Not so fast</h1><p>Ada wants you to pass the trial before you talk to clients.</p><a class="btn btn-primary" href="#/level/${level.id}">Back to the desk</a></div>`),
    );
    return;
  }

  const hard = store.get().settings.hard;
  const key = hard ? `${boss.id}+` : boss.id;
  const draftKey = `${level.id}/${key}`;
  const startCss = store.get().drafts[draftKey] ?? boss.css;
  let css = startCss;
  let results: CheckResult[] = [];
  let seconds = 0;
  let hintsUsed = 0;
  let disposed = false;
  let editor: EditorView | null = null;
  let viewer: EditorView | null = null;
  const sandboxes: Sandbox[] = [];
  const previous = new Map<string, boolean>();

  const shell = el(`
    <div class="boss">
      <header class="boss-bar">
        <a class="back" href="#/level/${level.id}">← Desk</a>
        <div class="boss-title">
          <h1>${esc(boss.client)}</h1>
          <p>${esc(boss.tagline)}${hard ? ' · <span class="ngplus">New Game+</span>' : ''}</p>
        </div>
        <span class="boss-timer" aria-label="Time on this job">0:00</span>
        <span class="boss-stars"></span>
        <button class="btn btn-primary" data-act="submit" disabled title="Ctrl+Enter">Submit fix</button>
      </header>
      <div class="boss-grid">
        <section class="boss-brief" aria-label="Client brief">
          <blockquote>${esc(boss.brief)}</blockquote>
          <ol class="hints" aria-live="polite"></ol>
          <button class="btn btn-ghost btn-s" data-act="hint">Hint (${boss.hints.length} left)</button>
        </section>
        <section class="boss-code" aria-label="Code">
          <div class="tabs" role="tablist">
            <button role="tab" aria-selected="true" data-tab="css">style.css</button>
            <button role="tab" aria-selected="false" data-tab="html">index.html <small>(read only)</small></button>
            <button class="btn btn-ghost btn-s tab-reset" data-act="reset">Reset CSS</button>
          </div>
          <div class="editor-host" data-pane="css"></div>
          <div class="editor-host" data-pane="html" hidden></div>
        </section>
        <section class="boss-preview" aria-label="Preview">
          <div class="preview-bar">
            <span class="preview-note">${SANDBOX_WIDTH}px wide · measured live</span>
          </div>
          <div class="preview-host" data-view="after"></div>
          <div class="preview-host" data-view="before" hidden></div>
        </section>
        <section class="boss-judges" aria-label="Judges">
          <h2 class="visually-hidden">Judges</h2>
          <div class="judge-panel" aria-live="polite"><p class="loading">Loading the client's site…</p></div>
        </section>
      </div>
    </div>`);
  root.append(shell);

  const q = <T extends HTMLElement>(sel: string) => shell.querySelector<T>(sel)!;
  const submitBtn = q<HTMLButtonElement>('[data-act="submit"]');
  const starsEl = q('.boss-stars');
  const panel = q('.judge-panel');
  const afterHost = q('[data-view="after"]');
  const beforeHost = q('[data-view="before"]');

  q('.preview-bar').prepend(
    toggleGroup({
      label: 'Preview',
      options: [
        { value: 'after', label: 'Your version' },
        { value: 'before', label: 'Original' },
      ],
      value: 'after',
      onChange: (v) => {
        afterHost.hidden = v !== 'after';
        beforeHost.hidden = v !== 'before';
      },
    }),
  );

  const judge = () => {
    if (disposed || sandboxes.length === 0) return;
    sandboxes[0].setCss(css);
    results = level.judge(sandboxes[0].doc, css, { hard });
    renderJudgePanel(panel, results, previous);
    const stars = starsFor(results);
    starsEl.innerHTML = starsHtml(stars);
    submitBtn.disabled = stars === 0;
  };
  const judgeSoon = debounce(judge, 250);
  const saveDraft = debounce(() => {
    if (!disposed) store.update((s) => void (s.drafts[draftKey] = css));
  }, 800);

  // Tabs
  shell.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach((tab) =>
    tab.addEventListener('click', () => {
      const name = tab.dataset.tab!;
      shell.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      shell.querySelectorAll<HTMLElement>('[data-pane]').forEach((p) => (p.hidden = p.dataset.pane !== name));
      if (name === 'html' && !viewer) viewer = htmlViewer(q('[data-pane="html"]'), boss.html.trim());
    }),
  );

  // Hints
  const hintBtn = q<HTMLButtonElement>('[data-act="hint"]');
  hintBtn.addEventListener('click', () => {
    if (hintsUsed >= boss.hints.length) return;
    q('.hints').insertAdjacentHTML('beforeend', `<li>${esc(boss.hints[hintsUsed])}</li>`);
    hintsUsed++;
    const left = boss.hints.length - hintsUsed;
    hintBtn.textContent = left ? `Another hint (${left} left)` : 'No hints left';
    hintBtn.disabled = left === 0;
  });

  q('[data-act="reset"]').addEventListener('click', async () => {
    if (!editor) return;
    if (await confirmModal('Reset the stylesheet?', 'Your edits on this client will be replaced with their original CSS.', 'Reset')) {
      setEditorText(editor, boss.css);
    }
  });

  const submit = async () => {
    const stars = starsFor(results);
    if (stars === 0) return;
    const prev = store.level(level.id).bosses[key];
    const rationale = await askRationale(prev?.rationale ?? '');
    if (rationale === null || disposed) return;
    const prevStars = prev?.stars ?? 0;
    const xp = improvement(bossXp(prevStars, hard), bossXp(stars, hard));
    const bonuses = results.filter((r) => r.kind === 'bonus' && r.pass).map((r) => r.id);
    commit(
      (s) => {
        const lp = (s.levels[level.id] ??= emptyLevel());
        if (!prev || stars >= prev.stars) {
          lp.bosses[key] = { stars, css, rationale, seconds, hintsUsed, bonuses, at: new Date().toISOString() };
        }
      },
      xp,
      `${boss.client}: ${stars}★`,
    );
    showResults({ level, boss, stars, prevStars, xp, seconds, hints: hintsUsed, results });
  };
  submitBtn.addEventListener('click', submit);
  const onKey = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !submitBtn.disabled) {
      e.preventDefault();
      submit();
    }
  };
  window.addEventListener('keydown', onKey);

  const timer = window.setInterval(() => {
    if (document.visibilityState !== 'visible' || document.querySelector('dialog[open]')) return;
    seconds++;
    q('.boss-timer').textContent = formatTime(seconds);
  }, 1000);

  (async () => {
    const after = new Sandbox(afterHost, { fit: true, title: `${boss.client}: your version` });
    const before = new Sandbox(beforeHost, { fit: true, title: `${boss.client}: original` });
    sandboxes.push(after, before);
    await Promise.all([after.load(boss.html, css), before.load(boss.html, boss.css)]);
    if (disposed) return;
    editor = cssEditor(q('[data-pane="css"]'), startCss, (text) => {
      css = text;
      judgeSoon();
      saveDraft();
    });
    judge();
  })();

  return () => {
    // Flush the latest edit so leaving mid-debounce never loses work.
    if (editor && store.get().drafts[draftKey] !== css) store.update((s) => void (s.drafts[draftKey] = css));
    disposed = true;
    window.clearInterval(timer);
    window.removeEventListener('keydown', onKey);
    editor?.destroy();
    viewer?.destroy();
    sandboxes.forEach((s) => s.destroy());
  };
};
