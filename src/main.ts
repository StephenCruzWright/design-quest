import "@fontsource-variable/fraunces";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/app.css";

import { route, startRouter } from "./router";
import { bossScreen } from "./screens/boss";
import { guideScreen } from "./screens/guide";
import { lessonScreen } from "./screens/lesson";
import { levelScreen } from "./screens/level";
import { mapScreen } from "./screens/map";
import { profileScreen } from "./screens/profile";
import { titleScreen } from "./screens/title";
import { trialScreen } from "./screens/trial";
import { type SaveData, store } from "./state/save";
import { mountHud } from "./ui/hud";

function applySettings(s: SaveData) {
  const root = document.documentElement;
  if (s.settings.theme === "auto") delete root.dataset.theme;
  else root.dataset.theme = s.settings.theme;
  if (s.settings.reducedMotion) root.dataset.motion = "reduced";
  else delete root.dataset.motion;
}

applySettings(store.get());
store.subscribe(applySettings);

route("/", titleScreen, { chrome: false });
route("/map", mapScreen);
route("/level/:id", levelScreen);
route("/level/:id/lesson", lessonScreen);
route("/level/:id/trial", trialScreen);
route("/level/:id/boss/:boss", bossScreen);
route("/guide", guideScreen);
route("/profile", profileScreen);

const app = document.getElementById("app")!;
mountHud(app);
const main = document.createElement("main");
main.id = "screen";
app.append(main);

// The router owns the hash, so the skip link moves focus instead of navigating.
document.querySelector(".skip-link")?.addEventListener("click", (e) => {
  e.preventDefault();
  main.tabIndex = -1;
  main.focus();
});

startRouter(main, (chrome) => app.classList.toggle("no-chrome", !chrome));
