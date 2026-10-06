import type { Screen } from "../router";
import { BADGES } from "../state/badges";
import { RANKS, rankFor } from "../state/progress";
import { decodeSave, encodeSave, freshSave, store } from "../state/save";
import { toggleGroup } from "../ui/controls";
import { mark } from "../ui/marks";
import { confirmModal } from "../ui/modal";
import { toast } from "../ui/toast";
import { $, el, esc, formatTime } from "../util/dom";

export const profileScreen: Screen = (root) => {
  const render = () => {
    const s = store.get();
    const { rank, next } = rankFor(s.xp);
    const records = Object.values(s.levels).flatMap((l) => Object.values(l.bosses));
    const wins = records.filter((r) => r.stars > 0);
    const stars = wins.reduce((n, r) => n + r.stars, 0);
    const time = wins.reduce((n, r) => n + r.seconds, 0);

    const page = el(`
      <div class="page profile">
        <header class="page-head">
          <p class="eyebrow">Staff file</p>
          <h1>${esc(rank.title)}</h1>
          <p class="lede">${s.xp} XP${next ? `, ${next.min - s.xp} to ${esc(next.title)}` : ", top of the masthead"}.</p>
        </header>

        <ol class="ranks" aria-label="Career ladder">
          ${RANKS.map((r) => `<li data-reached="${s.xp >= r.min}"${r === rank ? ' aria-current="step"' : ""}><span>${esc(r.title)}</span><small>${r.min} XP</small></li>`).join("")}
        </ol>

        <section>
          <h2>Stats</h2>
          <dl class="stat-row">
            <div><dt>Clients won</dt><dd>${wins.length}</dd></div>
            <div><dt>Stars</dt><dd>${stars}</dd></div>
            <div><dt>Time at the desk</dt><dd>${formatTime(time)}</dd></div>
            <div><dt>Badges</dt><dd>${Object.keys(s.badges).length}/${BADGES.length}</dd></div>
          </dl>
        </section>

        <section>
          <h2>Badges</h2>
          <ul class="badge-grid">
            ${BADGES.map((b) => {
              const got = Boolean(s.badges[b.id]);
              return `<li class="badge" data-earned="${got}">
                <span class="badge-mark">${mark(got ? b.mark : "lock")}</span>
                <div><h3>${esc(b.name)}${got ? "" : ' <span class="visually-hidden">(locked)</span>'}</h3><p>${esc(b.description)}</p></div>
              </li>`;
            }).join("")}
          </ul>
        </section>

        <section class="settings">
          <h2>Settings</h2>
          <div class="setting" data-setting="theme"><span>Theme</span></div>
          <div class="setting" data-setting="motion"><span>Motion</span></div>
          <div class="setting" data-setting="hard">
            <span>New Game+ <small>Stricter judges, ×1.5 XP, separate star records</small></span>
          </div>
        </section>

        <section class="save">
          <h2>Save code</h2>
          <p>${store.persistent ? "Progress saves automatically in this browser." : "<strong>This browser is blocking storage</strong>, so progress will be lost when you close the tab."} Copy this code to move your progress to another device, or to back it up.</p>
          <textarea class="save-code" rows="3" readonly aria-label="Your save code"></textarea>
          <div class="actions">
            <button class="btn btn-primary" data-act="copy">Copy save code</button>
          </div>
          <label for="import-code"><strong>Load a save code</strong></label>
          <textarea id="import-code" class="save-code" rows="3" placeholder="DQ1.…"></textarea>
          <div class="actions">
            <button class="btn btn-ghost" data-act="import">Load code</button>
            <button class="btn btn-ghost btn-danger" data-act="reset">Erase all progress</button>
          </div>
        </section>
      </div>`);

    $<HTMLTextAreaElement>(page, ".save-code").value = encodeSave(s);
    $(page, '[data-setting="theme"]').append(
      toggleGroup({
        label: "Theme",
        options: [
          { value: "auto", label: "System" },
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ],
        value: s.settings.theme,
        onChange: (v) =>
          store.update((d) => {
            d.settings.theme = v as "auto" | "light" | "dark";
          }),
      }),
    );
    $(page, '[data-setting="motion"]').append(
      toggleGroup({
        label: "Motion",
        options: [
          { value: "full", label: "Full" },
          { value: "reduced", label: "Reduced" },
        ],
        value: s.settings.reducedMotion ? "reduced" : "full",
        onChange: (v) =>
          store.update((d) => {
            d.settings.reducedMotion = v === "reduced";
          }),
      }),
    );
    $(page, '[data-setting="hard"]').append(
      toggleGroup({
        label: "New Game+",
        options: [
          { value: "off", label: "Off" },
          { value: "on", label: "On" },
        ],
        value: s.settings.hard ? "on" : "off",
        onChange: (v) => {
          store.update((d) => {
            d.settings.hard = v === "on";
          });
          toast({
            title: v === "on" ? "New Game+ on" : "New Game+ off",
            body:
              v === "on" ? "The judges have had a strong coffee." : "Standard judging restored.",
          });
        },
      }),
    );

    $(page, '[data-act="copy"]').addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(encodeSave(store.get()));
        toast({ title: "Save code copied" });
      } catch {
        $<HTMLTextAreaElement>(page, ".save-code").select();
        toast({ title: "Select the code and copy it manually" });
      }
    });
    $(page, '[data-act="import"]').addEventListener("click", async () => {
      const code = $<HTMLTextAreaElement>(page, "#import-code").value;
      try {
        const data = decodeSave(code);
        if (
          await confirmModal(
            "Load this save?",
            "Your current progress will be replaced.",
            "Load save",
          )
        ) {
          store.replace(data);
          toast({ title: "Save loaded", body: `${data.xp} XP restored.` });
          rerender();
        }
      } catch (e) {
        toast({ title: "Could not load that code", body: (e as Error).message });
      }
    });
    $(page, '[data-act="reset"]').addEventListener("click", async () => {
      if (
        await confirmModal(
          "Erase everything?",
          "All XP, stars, badges, rule cards and drafts will be deleted. Copy your save code first if you might want it back.",
          "Erase",
        )
      ) {
        store.replace(freshSave());
        rerender();
      }
    });
    return page;
  };
  const rerender = () => root.replaceChildren(render());
  root.append(render());
};
