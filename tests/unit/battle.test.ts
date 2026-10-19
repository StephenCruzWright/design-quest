import { describe, expect, it } from "vitest";
import { battleStep } from "../../src/ui/battle";

describe("battleStep", () => {
  it("does nothing on the first reading or an unchanged one", () => {
    expect(battleStep(null, 3)).toBe("none");
    expect(battleStep(null, 0)).toBe("none");
    expect(battleStep(2, 2)).toBe("none");
  });

  it("hits when HP drops and finishes the foe at zero", () => {
    expect(battleStep(3, 2)).toBe("hit");
    expect(battleStep(3, 1)).toBe("hit");
    expect(battleStep(1, 0)).toBe("finish");
    expect(battleStep(4, 0)).toBe("finish");
  });

  it("heals the foe on a regression and revives a beaten one", () => {
    expect(battleStep(1, 2)).toBe("heal");
    expect(battleStep(0, 1)).toBe("revive");
  });
});
