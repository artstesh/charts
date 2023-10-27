import { fakeAsync, tick } from '@angular/core/testing';

import { ChartPlateService } from './chart-plate.service';
import { should } from '@artstesh/it-should';
import { Forger } from '@artstesh/forger';

describe('ChartPlateService', () => {
  let service: ChartPlateService;
  let updated: boolean;
  let chart: any;

  beforeEach(() => {
    service = new ChartPlateService();
    updated = false;
    chart = { data: { datasets: [] } };
    service.updateTrigger$.subscribe(() => (updated = true));
    service.setChart(chart);
  });

  afterEach(() => {
    expect().nothing();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('datasets', () => {
    describe('addDataset()', () => {
      it('nothing if no data', fakeAsync(() => {
        chart.data = undefined as any;
        //
        service.addDataset([] as any);
        tick(300);
        //
        should().false(updated);
      }));

      it('success', fakeAsync(() => {
        //
        service.addDataset([] as any);
        tick(300);
        //
        should().true(updated);
      }));

      it('dataset is correct', () => {
        const datasetMock = Forger.create<number>() as any;
        //
        service.addDataset(datasetMock as any);
        //
        should().number(datasetMock).equals(chart.data.datasets[0]);
      });
    });
  });
});
