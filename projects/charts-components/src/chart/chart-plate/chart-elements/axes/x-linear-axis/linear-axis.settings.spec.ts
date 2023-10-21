import { LinearAxisSettings } from "./linear-axis.settings";
import { Forger } from "@artstesh/forger";
import { should } from "@artstesh/it-should";

describe("#chart-elements LinearAxisSettings", () => {
  let model: LinearAxisSettings;

  beforeEach(() => {
    model = new LinearAxisSettings();
    model.limits = Forger.create<[number, number | null]>()!;
    model.displayGrid = Forger.create<boolean>()!;
  })

  afterEach(() => {
    expect().nothing();
  })

  describe("isSame()", () => {
    it("are same", () => {
      const other = new LinearAxisSettings();
      other.limits = [...model.limits];
      other.displayGrid = model.displayGrid;
      //
      should().true(model.isSame(other));
    });

    it("different displayGrid", () => {
      const other = new LinearAxisSettings();
      other.limits = [...model.limits];
      other.displayGrid = !model.displayGrid;
      //
      should().false(model.isSame(other));
    });

    it("different displayGrid", () => {
      const other = new LinearAxisSettings();
      other.limits = [...model.limits];
      other.displayGrid = !model.displayGrid;
      //
      should().false(model.isSame(other));
    });

    it("different limits", () => {
      const other = new LinearAxisSettings();
      other.limits = Forger.create<[number | null, number | null]>()!;
      other.displayGrid = model.displayGrid;
      //
      should().false(model.isSame(other));
    });
  });
});
