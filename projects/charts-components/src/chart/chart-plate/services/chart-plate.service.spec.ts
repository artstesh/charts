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
    chart = { };
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
      chart.data = {datasets: []};
    });

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

    describe('removeDataset()', () => {
      let order: number;
      let name: string;

      beforeEach(() => {
        order = Forger.create<number>()!;
        name = Forger.create<string>()!;
      });

      it('nothing if no data', fakeAsync(() => {
        chart.data = undefined as any;
        //
        service.removeDataset(name, order);
        tick(300);
        //
        should().false(updated);
      }));

      it('not remove only by order success', fakeAsync(() => {
        chart.data.datasets.push({ order });
        //
        service.removeDataset(name, order);
        tick(300);
        //
        should().array(chart.data.datasets).length(1);
        should().false(updated);
      }));

      it('remove by name success', fakeAsync(() => {
        chart.data.datasets.push({ label: name });
        //
        service.removeDataset(name, order);
        tick(300);
        //
        should().array(chart.data.datasets).length(1);
        should().false(updated);
      }));

      it('removed successfully', fakeAsync(() => {
        chart.data.datasets.push({ order, label: name });
        //
        service.removeDataset(name, order);
        tick(300);
        //
        should().array(chart.data.datasets).empty();
        should().true(updated);
      }));

      it('alsoDelete removed successfully', fakeAsync(() => {
        const alsoDelete = Forger.create<string>()!;
        chart.data.datasets.push({ label: alsoDelete });
        //
        service.removeDataset(name, order, alsoDelete);
        tick(300);
        //
        should().array(chart.data.datasets).empty();
      }));
    });
  });

  describe('scales', () => {
    let id: string;

    beforeEach(() => {
      id = Forger.create<string>()!;
      chart.options = {scales: {}};
    });

    describe('setScale()', () => {

      it('nothing if no data', fakeAsync(() => {
        chart.options = undefined;
        const scale = Forger.create<number>()! as any;
        //
        service.setScale(id, scale);
        tick(300);
        //
        should().false(updated);
      }));

      it('successfully updates', fakeAsync(() => {
        const scale = Forger.create<number>()! as any;
        //
        service.setScale(id, scale);
        tick(300);
        //
        should().true(updated);
      }));

      it('sets successfully', fakeAsync(() => {
        const scale = Forger.create<number>()! as any;
        //
        service.setScale(id, scale);
        tick(300);
        //
        should().number(chart.options.scales[id]).equals(scale);
      }));
    });

    describe('resetScale()', () => {

      it('nothing if no data', fakeAsync(() => {
        chart.options = undefined;
        const scale = Forger.create<number>()! as any;
        //
        service.resetScale(id);
        tick(300);
        //
        should().false(updated);
      }));

      it('successfully updates', fakeAsync(() => {
        chart.options.scales[id] = Forger.create<number>()! as any;
        //
        service.resetScale(id);
        tick(300);
        //
        should().true(updated);
      }));

      it('clears successfully', fakeAsync(() => {
        chart.options.scales[id] = Forger.create<number>()! as any;
        //
        service.resetScale(id);
        tick(300);
        //
        should().array(Object.keys(chart.options.scales[id])).empty();
      }));
    });
  });
});
