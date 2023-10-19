import { TestBed } from '@angular/core/testing';

import { ChartAxisLimitService } from './chart-axis-limit.service';
import { instance, mock, reset, when } from "ts-mockito";
import { ChartAxisLimitsModel } from "../models/chart-axis-limits.model";
import { Forger } from "@artstesh/forger";
import { should } from "@artstesh/it-should";

describe('ChartAxisLimitService', () => {
  let service: ChartAxisLimitService;
  const model = mock(ChartAxisLimitsModel);

  beforeEach(() => {
    service = new ChartAxisLimitService(instance(model));
  });

  afterEach(() => {
    reset(model);
    expect().nothing();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("examine() success", () => {
    const expected = Forger.create<boolean>()!;
    const data = Forger.create<{x: number, y: number}>()!;
    when(model.contains(data.x, data.y)).thenReturn(expected);
    console.log(data);
    //
    const result = service.examine(data.x, data.y);
    //
    should().true(result === expected)
  });
});
