import { fakeAsync, tick } from '@angular/core/testing';

import { ChartPlateService } from './chart-plate.service';
import { should } from '@artstesh/it-should';
import { Forger } from '@artstesh/forger';
import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { InnerPostboyService } from '../../services/inner-postboy.service';
import { Subject } from 'rxjs';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';
import { ChartUpdateCommand } from '../../messages/commands/chart-update.command';

describe('ChartPlateService', () => {
  let waitTime = 400;
  let service: ChartPlateService;
  let chart: any;
  const postboy = mock(InnerPostboyService);
  let chartUpdate$: Subject<ChartUpdateCommand>;
  let chartInitialized: Subject<ChartInitializedEvent>;

  beforeEach(() => {
    service = new ChartPlateService(instance(postboy));
    chartInitialized = new Subject<ChartInitializedEvent>();
    chartUpdate$ = new Subject<ChartUpdateCommand>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    when(postboy.subscribe(ChartUpdateCommand.ID)).thenReturn(chartUpdate$);
    chart = {};
    service.up();
    chartInitialized.next(new ChartInitializedEvent(chart));
  });

  afterEach(() => {
    reset(postboy);
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
        verify(postboy.fire<ChartUpdateCommand>(anything())).never();
      }));

      it('success', fakeAsync(() => {
        //
        service.addDataset([] as any);
        tick(waitTime);
        //
        verify(postboy.fire<ChartUpdateCommand>(anything())).once();
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
        verify(postboy.fire<ChartUpdateCommand>(anything())).never();
      }));

      it('removed successfully', fakeAsync(() => {
        chart.data.datasets.push({ id: id });
        //
        service.removeDataset(id);
        tick(waitTime);
        //
        should().array(chart.data.datasets).empty();
        verify(postboy.fire<ChartUpdateCommand>(anything())).once();
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
        verify(postboy.fire<ChartUpdateCommand>(anything())).never();
      }));

      it('successfully updates', fakeAsync(() => {
        const scale = Forger.create<number>()! as any;
        //
        service.setScale(id, scale);
        tick(waitTime);
        //
        verify(postboy.fire<ChartUpdateCommand>(anything())).once();
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
        verify(postboy.fire<ChartUpdateCommand>(anything())).never();
      }));

      it('successfully updates', fakeAsync(() => {
        chart.options.scales[id] = Forger.create<number>()! as any;
        //
        service.resetScale(id);
        tick(waitTime);
        //
        verify(postboy.fire<ChartUpdateCommand>(anything())).once();
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
        verify(postboy.fire<ChartUpdateCommand>(anything())).never();
      }));

      it('successfully updates', fakeAsync(() => {
        chart.options.plugins.legend = Forger.create<number>()! as any;
        const legend = Forger.create<number>()! as any;
        //
        service.setLegend(legend);
        tick(waitTime);
        //
        verify(postboy.fire<ChartUpdateCommand>(anything())).once();
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
      verify(postboy.fire<ChartUpdateCommand>(anything())).never();
    }));

    it('successfully updates', fakeAsync(() => {
      chart.data = {};
      const labels = Forger.create<string[]>()!;
      //
      service.setLabels(labels);
      tick(waitTime);
      //
      verify(postboy.fire<ChartUpdateCommand>(anything())).once();
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
