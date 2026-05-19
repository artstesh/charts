import { GraphVisibilityService } from './graph-visibility.service';
import { ChartUpdateCommand } from '../../messages/commands/chart-update.command';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';
import { Forger } from '@artstesh/forger';
import { ToggleGraphVisibilityCommand } from '../../messages/commands/toggle-graph-visibility.command';
import { should } from '@artstesh/it-should';
import { PostboyWorld } from '@artstesh/postboy-testing';

describe('GraphVisibilityService', () => {
  let service: GraphVisibilityService;
  let chart: any;
  let world: PostboyWorld;

  beforeEach(() => {
    world = new PostboyWorld();
    service = new GraphVisibilityService(world.postboy);
    chart = {};
    world.given.event(new ChartInitializedEvent(chart));
    service.up();
  });

  afterEach(() => {
    world.dispose();
    expect().nothing();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ToggleGraphVisibilityCommand', () => {
    it('do nothing if no data', () => {
      chart.data = undefined;
      //
      world.postboy.fire(new ToggleGraphVisibilityCommand(Forger.create<string>()!));
      //
      world.then.notFired(ChartUpdateCommand);
    });

    it('do nothing if no datasets', () => {
      chart.data = {};
      //
      world.postboy.fire(new ToggleGraphVisibilityCommand(Forger.create<string>()!));
      //
      world.then.notFired(ChartUpdateCommand);
    });

    it('do nothing if no dataset', () => {
      chart.data = { datasets: [{ id: Forger.create<string>()! }] };
      //
      world.postboy.fire(new ToggleGraphVisibilityCommand(Forger.create<string>()!));
      //
      world.then.notFired(ChartUpdateCommand);
    });

    it('update chart', () => {
      const graphId = Forger.create<string>()!;
      chart.data = { datasets: [{ id: graphId }] };
      //
      world.postboy.fire(new ToggleGraphVisibilityCommand(graphId));
      //
      world.then.fired(ChartUpdateCommand).once();
    });

    it('set visibility', () => {
      const graphId = Forger.create<string>()!;
      const visible = Forger.create<boolean>()!;
      chart.data = { datasets: [{ id: graphId }] };
      //
      world.postboy.fire(new ToggleGraphVisibilityCommand(graphId, visible));
      //
      should().true(chart.data.datasets[0].hidden === !visible);
    });
  });
});
