import { PostboyGenericMessage } from "@artstesh/postboy";
import Chart from 'chart.js/auto';

export class ChartInitializedEvent extends PostboyGenericMessage {
  public static readonly ID = 'c72d8827-71ad-4a2e-930c-0a07ef61a0e3';
  public get id(): string {
    return ChartInitializedEvent.ID;
  }
  constructor(public chart: Chart) {
    super();
  }
}

