import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from '@codemirror/view';
import { EditorState, type Extension } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { HighlightStyle, syntaxHighlighting, bracketMatching, indentOnInput } from '@codemirror/language';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { tags as t } from '@lezer/highlight';

/** Editor theme built from the game's own tokens, so it follows light/dark mode. */
const theme = EditorView.theme({
  '&': { height: '100%', fontSize: 'var(--step--1)', backgroundColor: 'var(--card)', color: 'var(--ink)' },
  '.cm-scroller': { fontFamily: 'var(--font-code)', lineHeight: '1.6' },
  '.cm-content': { caretColor: 'var(--accent)', paddingBlock: 'var(--space-2xs)' },
  '.cm-gutters': { backgroundColor: 'var(--sunk)', color: 'var(--ink-2)', border: 'none' },
  '.cm-activeLine': { backgroundColor: 'color-mix(in oklch, var(--accent-soft) 45%, transparent)' },
  '.cm-activeLineGutter': { backgroundColor: 'var(--accent-soft)' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': { backgroundColor: 'var(--accent-soft) !important' },
  '&.cm-focused': { outline: 'none' },
  '.cm-tooltip': { backgroundColor: 'var(--card)', border: '1px solid var(--line)' },
});

const highlight = HighlightStyle.define([
  { tag: [t.propertyName, t.attributeName], color: 'var(--accent-ink)' },
  { tag: [t.number, t.unit], color: 'var(--bad)' },
  { tag: [t.variableName, t.special(t.variableName)], color: 'var(--good)' },
  { tag: [t.className, t.tagName, t.labelName], color: 'var(--ink)', fontWeight: '600' },
  { tag: [t.comment], color: 'var(--ink-2)', fontStyle: 'italic' },
  { tag: [t.string, t.attributeValue], color: 'var(--good)' },
  { tag: [t.keyword, t.atom], color: 'var(--accent-ink)' },
]);

const base: Extension[] = [
  lineNumbers(),
  drawSelection(),
  highlightActiveLine(),
  bracketMatching(),
  theme,
  syntaxHighlighting(highlight),
  EditorView.lineWrapping,
];

/** Re-measure once web fonts land, or wrapped lines and the gutter drift apart. */
function remeasureAfterFonts(view: EditorView): EditorView {
  document.fonts?.ready.then(() => view.requestMeasure());
  return view;
}

export function cssEditor(host: HTMLElement, doc: string, onChange: (text: string) => void): EditorView {
  return remeasureAfterFonts(new EditorView({
    parent: host,
    state: EditorState.create({
      doc,
      extensions: [
        ...base,
        history(),
        indentOnInput(),
        closeBrackets(),
        autocompletion(),
        css(),
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...completionKeymap, indentWithTab]),
        EditorView.contentAttributes.of({ 'aria-label': 'CSS editor' }),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) onChange(u.state.doc.toString());
        }),
      ],
    }),
  }));
}

export function htmlViewer(host: HTMLElement, doc: string): EditorView {
  return new EditorView({
    parent: host,
    state: EditorState.create({
      doc,
      extensions: [
        ...base,
        html(),
        EditorState.readOnly.of(true),
        EditorView.contentAttributes.of({ 'aria-label': 'Page HTML (read only)' }),
      ],
    }),
  });
}

export function setEditorText(view: EditorView, text: string): void {
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
}
