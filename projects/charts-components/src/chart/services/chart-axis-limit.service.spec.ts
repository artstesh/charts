import { fakeAsync, TestBed, tick } from "@angular/core/testing";

import { ChartAxisLimitService } from './chart-axis-limit.service';
import { anyNumber, anything, instance, mock, reset, verify, when } from "ts-mockito";
import { ChartAxisLimitsModel, IChartAxisLimitsModel } from "../models/chart-axis-limits.model";
import { Forger } from "@artstesh/forger";
import { should } from "@artstesh/it-should";
import { ChartDataModel } from "../models";

describe('ChartAxisLimitService', () => {
  let service: ChartAxisLimitService;
  const model = mock(ChartAxisLimitsModel);

  beforeEach(() => {
    service = new ChartAxisLimitService();
    service.setModel(instance(model));
  });

  afterEach(() => {
    reset(model);
    expect().nothing();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("examine()", () => {
    it("filters successfully", () => {
      const data = Forger.create<ChartDataModel[]>()!;
      when(model.contains(anything())).thenReturn(true, false, false);
      //
      const result = service.examine(data);
      //
      should().array(result).length(1);
    });

    it("save correct elements", () => {
      const data = Forger.create<ChartDataModel[]>()!;
      when(model.contains(anything())).thenReturn(true, false, false);
      //
      const result = service.examine(data);
      //
      should().objects(result[0], data[0]).equal();
    });
  });

  describe("setMainVerticalLimits()", () => {
    it("success", () => {
      const min: number | null = Forger.create<number| null>()!;
      const max: number | null = Forger.create<number | null>()!;
      //
      service.setMainVerticalLimits(min, max);
      //
      should().true(instance(model).minY === min);
      should().true(instance(model).maxY === max);
    });
  });

  describe("setHorizontalLimits()", () => {
    it("success", () => {
      const min: number | null = Forger.create<number| null>()!;
      const max: number | null = Forger.create<number | null>()!;
      //
      service.setHorizontalLimits(min, max);
      //
      should().true(instance(model).minX === min);
      should().true(instance(model).maxX === max);
    });
  });

  describe("notification", () => {
    const updateTime = 210;
    let someNumber: number | null;
    let fired: boolean;

    beforeEach(() => {
      someNumber = Forger.create<number| null>()!;
      fired = false;
      service.changed.subscribe(() => fired = true );
    });

    it("setMainVerticalLimits() fires", fakeAsync(() => {
      //
      service.setMainVerticalLimits(someNumber, someNumber);
      tick(updateTime);
      //
      should().true(fired);
    }));

    it("setMainVerticalLimits() fires", fakeAsync(() => {
      //
      service.setHorizontalLimits(someNumber, someNumber);
      tick(updateTime);
      //
      should().true(fired);
    }));
  });

  describe("get model", () => {
    it("success", () => {
      const expected = Forger.create<IChartAxisLimitsModel>()!;
      when(model.rawData).thenReturn(expected);
      //
      should().true(service.model === expected)
    });
  });
});
