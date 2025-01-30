import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartAreaDataModel } from '../../../models';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartPlateService } from '../../services/chart-plate.service';
import { AreaChartSettings } from './area-chart.settings';
import { BuildAreaChartExecutor } from '../../../messages/executors/build-area-chart.executor';
import { GetGradientExecutor } from '../../../messages/executors/get-gradient.executor';
import { first } from 'rxjs/operators';
import { AreaBuilderModel } from '../models/area-builder.model';
import { ChartRenderedEvent } from '../../../messages/events/chart-rendered.event';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';

@Component({
  selector: 'art-area-chart',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaChartComponent extends AbstractChartTypeComponent<AreaChartSettings> {
  protected _settings: AreaChartSettings = new AreaChartSettings();
  private allowed = false;

  constructor(postboy: InnerPostboyService, service: ChartPlateService) {
    super(postboy, service);
  }

  private _data!: ChartAreaDataModel[];

  @Input() set data(aw: ChartAreaDataModel[]) {
    this._data = aw;
    this.postboy.fire(new ChartDataEvent(this._data));
    this.dataUpdated();
  }

  protected initial = () => {
    this.subs.push(
      this.postboy
        .sub<ChartRenderedEvent>(ChartRenderedEvent)
        .pipe(first())
        .subscribe((ev) => {
          this.allowed = true;
          this.dataUpdated();
        }),
    );
  };

  protected getDataset = () => {
    if (!this.chart || !this.allowed) return [];
    let content = this.postboy.exec<AreaBuilderModel>(
      new BuildAreaChartExecutor(
        this._settings,
        this._data,
        this.postboy.exec(new GetGradientExecutor(this.chart ?? null, this._settings.colors, this._settings.direction)),
      ),
    );
    this.alsoDelete = () => content.bottom?.id;
    return [content.top, content.bottom];
  };
}
