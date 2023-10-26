import { TestBed } from '@angular/core/testing';

import { ChartPlateService } from './chart-plate.service';

describe('ChartPlateService', () => {
  let service: ChartPlateService;

  beforeEach(() => {
    service = new ChartPlateService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
