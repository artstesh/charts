import { fakeAsync, tick } from '@angular/core/testing';

import { ChartPlateService } from './chart-plate.service';
import { should } from '@artstesh/it-should';
import { Forger } from '@artstesh/forger';

describe('ChartPlateService', () => {
  let waitTime = 400;
  let service: ChartPlateService;
  let updated: boolean;
  let chart: any;

  beforeEach(() => {
    service = new ChartPlateService();
    updated = false;
    chart = {};
    service.updateTrigger$.subscribe(() => (updated = true));
    service.setChart(chart);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('datasets', () => {
    beforeEach(() => {
      chart.data = { datasets: [] };
    });

    describe('addDataset()', () => {
      it('nothing if no data', fakeAsync(() => {
        chart.data = undefined as any;
        //
        service.addDataset([] as any);
        tick(waitTime);
        //
        should().false(updated);
      }));

      it('success', fakeAsync(() => {
        //
        service.addDataset([] as any);
        tick(waitTime);
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

    describe('removeDataset()', () => {
      let id: string;

      beforeEach(() => {
        id = Forger.create<string>()!;
      });

      it('nothing if no data', fakeAsync(() => {
        chart.data = undefined as any;
        //
        service.removeDataset(id);
        tick(waitTime);
        //
        should().false(updated);
      }));

      it('removed successfully', fakeAsync(() => {
        chart.data.datasets.push({ id: id });
        //
        service.removeDataset(id);
        tick(waitTime);
        //
        should().array(chart.data.datasets).empty();
        should().true(updated);
      }));

      it('alsoDelete removed successfully', fakeAsync(() => {
        const alsoDelete = Forger.create<string>()!;
        chart.data.datasets.push({ id: alsoDelete });
        //
        service.removeDataset(id, alsoDelete);
        tick(waitTime);
        //
        should().array(chart.data.datasets).empty();
      }));
    });
  });

  describe('scales', () => {
    let id: string;

    beforeEach(() => {
      id = Forger.create<string>()!;
      chart.options = { scales: {} };
    });

    describe('setScale()', () => {
      it('nothing if no data', fakeAsync(() => {
        chart.options = undefined;
        const scale = Forger.create<number>()! as any;
        //
        service.setScale(id, scale);
        tick(waitTime);
        //
        should().false(updated);
      }));

      it('successfully updates', fakeAsync(() => {
        const scale = Forger.create<number>()! as any;
        //
        service.setScale(id, scale);
        tick(waitTime);
        //
        should().true(updated);
      }));

      it('sets successfully', fakeAsync(() => {
        const scale = Forger.create<number>()! as any;
        //
        service.setScale(id, scale);
        tick(waitTime);
        //
        should().number(chart.options.scales[id]).equals(scale);
      }));
    });

    describe('resetScale()', () => {
      it('nothing if no data', fakeAsync(() => {
        chart.options = undefined;
        //
        service.resetScale(id);
        tick(waitTime);
        //
        should().false(updated);
      }));

      it('successfully updates', fakeAsync(() => {
        chart.options.scales[id] = Forger.create<number>()! as any;
        //
        service.resetScale(id);
        tick(waitTime);
        //
        should().true(updated);
      }));

      it('clears successfully', fakeAsync(() => {
        chart.options.scales[id] = Forger.create<number>()! as any;
        //
        service.resetScale(id);
        tick(waitTime);
        //
        should().array(Object.keys(chart.options.scales[id])).empty();
      }));
    });
  });

  describe('legend', () => {
    let id: string;

    beforeEach(() => {
      id = Forger.create<string>()!;
      chart.options = { plugins: {} };
    });

    describe('setLegend()', () => {
      it('nothing if no data', fakeAsync(() => {
        chart.options = undefined;
        const legend = Forger.create<number>()! as any;
        //
        service.setLegend(legend);
        tick(waitTime);
        //
        should().false(updated);
      }));

      it('successfully updates', fakeAsync(() => {
        chart.options.plugins.legend = Forger.create<number>()! as any;
        const legend = Forger.create<number>()! as any;
        //
        service.setLegend(legend);
        tick(waitTime);
        //
        should().true(updated);
      }));

      it('sets successfully', fakeAsync(() => {
        const legend = Forger.create<number>()! as any;
        //
        service.setLegend(legend);
        tick(waitTime);
        //
        should().number(chart.options.plugins.legend).equals(legend);
      }));
    });
  });

  describe('setLabels', () => {
    it('nothing if no data', fakeAsync(() => {
      chart.data = undefined;
      const labels = Forger.create<string[]>()!;
      //
      service.setLabels(labels);
      tick(waitTime);
      //
      should().false(updated);
    }));

    it('successfully updates', fakeAsync(() => {
      chart.data = {};
      const labels = Forger.create<string[]>()!;
      //
      service.setLabels(labels);
      tick(waitTime);
      //
      should().true(updated);
    }));

    it('sets successfully', fakeAsync(() => {
      chart.data = {};
      const labels = Forger.create<string[]>()!;
      //
      service.setLabels(labels);
      tick(waitTime);
      //
      should().array(chart.data.labels).equal(labels);
    }));
  });

  describe('setTooltip', () => {
    it('nothing if no data', fakeAsync(() => {
      chart.options = undefined;
      const tooltip = Forger.create<string>()!; // just a primitive mock
      //
      service.setTooltip(tooltip);
      tick(waitTime);
      //
      should().false(chart.options?.plugins?.tooltip);
    }));

    it('sets successfully', fakeAsync(() => {
      chart.options = { plugins: {} };
      const tooltip = Forger.create<string>()!; // just a primitive mock
      //
      service.setTooltip(tooltip);
      tick(waitTime);
      //
      should().string(chart.options.plugins.tooltip).equals(tooltip);
    }));
  });
});
