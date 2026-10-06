import { toast } from "../ui/toast";
import { newlyEarned } from "./badges";
import { rankFor } from "./progress";
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
          glyph: b.glyph,
          title: `Badge: ${b.name}`,
          body: `${b.description} +${BADGE_XP} XP`,
        }),
      );
    }
  });
  if (xp > 0) toast({ tone: "xp", glyph: "+", title: `+${xp} XP`, body: reason });
  const after = rankFor(store.get().xp).rank;
  if (after.title !== before.title) {
    toast({
      tone: "badge",
      glyph: "▲",
      title: `Promoted: ${after.title}`,
      body: "Ada nods approvingly at your desk.",
    });
  }
  return gained;
}
