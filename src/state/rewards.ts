import { adaHtml } from "../ui/ada";
import { centreOf, confetti } from "../ui/fx";
import { openModal } from "../ui/modal";
import { toast } from "../ui/toast";
import { esc } from "../util/dom";
import { newlyEarned } from "./badges";
import { type Rank, rankFor } from "./progress";
import { type SaveData, store } from "./save";

export const BADGE_XP = 50;

/**
 * Apply a progress change, then pay out XP and any badges it unlocked,
 * announcing each with a toast. Returns the total XP gained.
 */
export function commit(mutate: (s: SaveData) => void, xp: number, reason: string): number {
  const before = rankFor(store.get().xp).rank;
  let gained = xp;
  store.update((s) => {
    mutate(s);
    s.xp += xp;
    for (const b of newlyEarned(s)) {
      s.badges[b.id] = new Date().toISOString();
      s.xp += BADGE_XP;
      gained += BADGE_XP;
      queueMicrotask(() =>
        toast({
          tone: "badge",
          mark: b.mark,
          title: `Badge: ${b.name}`,
          body: `${b.description} +${BADGE_XP} XP`,
        }),
      );
    }
  });
  if (xp > 0) toast({ tone: "xp", mark: "star", title: `+${xp} XP`, body: reason });
  const after = rankFor(store.get().xp).rank;
  if (after.title !== before.title) whenNoDialog(() => promotionCard(after));
  return gained;
}

/** Run `fn` once no dialog is open, so a promotion never hides a result. */
function whenNoDialog(fn: () => void): void {
  const attempt = () => {
    if (document.querySelector("dialog[open]")) window.setTimeout(attempt, 300);
    else fn();
  };
  window.setTimeout(attempt, 0);
}

function promotionCard(rank: Rank): void {
  const { root } = openModal({
    title: `Promoted: ${rank.title}`,
    body: `<figure class="promotion">${adaHtml("nod", "l")}<blockquote>${esc(rank.note)}</blockquote><figcaption>Ada Kern, studio lead</figcaption></figure>`,
    actions: [{ label: "Back to work", onClick: (close) => close() }],
  });
  confetti(centreOf(root));
}
