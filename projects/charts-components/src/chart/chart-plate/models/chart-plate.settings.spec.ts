import { ChartBarSettings } from "../chart-types/bar-chart/chart-bar.settings";
import { Forger } from "@artstesh/forger";
import { should } from "@artstesh/it-should";
import { ChartPlateSettings, InteractMode } from "./chart-plate.settings";

describe("ChartPlateSettings", () => {
  let model: ChartPlateSettings;

  beforeEach(() => {
    model = new ChartPlateSettings().copy(Forger.create<ChartPlateSettings>()!);
  });

  afterEach(() => {
    expect().nothing();
  });

  it("setMode()", () => {
    const mode = Forger.create<'x' | 'y'>()!;
    //
    model.setMode(mode);
    //
    should().string(model.interactionMode).equals(mode);
  });

  describe('isSame()', () => {
    it('are same', () => {
      const other = new ChartPlateSettings().copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different interactionMode', () => {
      const other = new ChartPlateSettings().copy(model);
      other.interactionMode = Forger.create<'x' | 'y'>()!;
      //
      should().false(model.isSame(other));
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const result = new ChartPlateSettings().copy(model);
      //
      should().objects(result, model).equal();
    });
  });
});
