import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RadialDataModel } from '../../../models';
import { ChartPlateService } from '../../services/chart-plate.service';
import { DoughnutChartSettings } from './doughnut-chart.settings';
import { DestructibleComponent } from '../../../common/destructible.component';
import { DoughnutChartFactory } from './doughnut-chart.factory';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';

@Component({
  selector: 'art-doughnut-chart',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutChartComponent extends DestructibleComponent implements OnInit {
  constructor(
    private service: ChartPlateService,
    private postboy: InnerPostboyService,
    private factory: DoughnutChartFactory,
  ) {
    super();
  }

  protected _settings: DoughnutChartSettings = new DoughnutChartSettings();

  @Input() set settings(value: DoughnutChartSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.dataUpdated();
  }

  private _data: RadialDataModel[] = [];

  @Input() set data(aw: RadialDataModel[]) {
    this._data = aw ?? [];
    this.dataUpdated();
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ChartInitializedEvent).subscribe(() => this.dataUpdated()));
  }

  onDestroy = () => {
    this.service.removeDataset(this._settings.id);
  };

  protected dataUpdated(): void {
    this.service.removeDataset(this._settings.id);
    this.service.resetScale();
    this.service.addDataset(this.getDataset() as any);
    this.service.setLabels(this._data.map((d) => d.label));
  }

  protected getDataset = () => this.factory.build(this._settings, this._data);
}
