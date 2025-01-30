import { GraphVisibilityService } from './graph-visibility.service';
import { ReplaySubject, Subject } from 'rxjs';
import { ChartUpdateCommand } from '../../messages/commands/chart-update.command';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';
import { Forger } from '@artstesh/forger';
import { ToggleGraphVisibilityCommand } from '../../messages/commands/toggle-graph-visibility.command';
import { PostboyServiceMock } from '@artstesh/postboy';
import { should } from '@artstesh/it-should';

describe('GraphVisibilityService', () => {
  let service: GraphVisibilityService;
  let chart: any;
  let postboy: PostboyServiceMock;

  beforeEach(() => {
    postboy = new PostboyServiceMock();
    postboy.record(ChartInitializedEvent, new ReplaySubject());
    postboy.record(ChartUpdateCommand, new ReplaySubject());
    postboy.record(ToggleGraphVisibilityCommand, new Subject());
    service = new GraphVisibilityService(postboy);
    chart = {};
    service.up();
    postboy.fire(new ChartInitializedEvent(chart));
  });

  afterEach(() => {
    expect().nothing();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ToggleGraphVisibilityCommand', () => {
    it('do nothing if no data', () => {
      chart.data = undefined;
      //
      postboy.fire(new ToggleGraphVisibilityCommand(Forger.create<string>()!));
      //
      should().false(postboy.fired(ChartUpdateCommand.ID));
    });

    it('do nothing if no datasets', () => {
      chart.data = {};
      //
      postboy.fire(new ToggleGraphVisibilityCommand(Forger.create<string>()!));
      //
      should().false(postboy.fired(ChartUpdateCommand.ID));
    });

    it('do nothing if no dataset', () => {
      chart.data = { datasets: [{ id: Forger.create<string>()! }] };
      //
      postboy.fire(new ToggleGraphVisibilityCommand(Forger.create<string>()!));
      //
      should().false(postboy.fired(ChartUpdateCommand.ID));
    });

    it('update chart', () => {
      const graphId = Forger.create<string>()!;
      chart.data = { datasets: [{ id: graphId }] };
      //
      postboy.fire(new ToggleGraphVisibilityCommand(graphId));
      //
      should().true(postboy.fired(ChartUpdateCommand.ID, 1));
    });

    it('set visibility', () => {
      const graphId = Forger.create<string>()!;
      const visible = Forger.create<boolean>()!;
      chart.data = { datasets: [{ id: graphId }] };
      //
      postboy.fire(new ToggleGraphVisibilityCommand(graphId, visible));
      //
      should().true(chart.data.datasets[0].hidden === !visible);
    });
  });
});
