import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartAreaDataModel } from '../../../models';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { FilterDatasetQuery } from '../../../messages/queries/filter-dataset.query';
import { AreaChartSettings } from './area-chart.settings';
import { BuildAreaChartExecutor } from '../../../messages/executors/build-area-chart.executor';
import { GetGradientExecutor } from '../../../messages/executors/get-gradient.executor';
import { ChartUpdateCommand } from '../../../messages/commands/chart-update.command';
import { first } from 'rxjs/operators';
import { AreaBuilderModel } from '../models/area-builder.model';

@Component({
  selector: 'art-area-chart',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaChartComponent extends AbstractChartTypeComponent<AreaChartSettings> {
  protected _settings: AreaChartSettings = new AreaChartSettings();
  private _dataFiltered!: ChartAreaDataModel[];

  constructor(postboy: ChartPostboyService, service: ChartPlateService, mapService: SettingsMapService) {
    super(postboy, service, mapService);
  }

  private _data!: ChartAreaDataModel[];

  @Input() set data(aw: ChartAreaDataModel[]) {
    this._data = aw;
    this.dataUpdated();
  }

  protected updateFilteredData(): void {
    const query = new FilterDatasetQuery(this._data);
    this._dataFiltered = this.postboy.execute(query);
  }

  protected initial = () => {
    this.subs.push(
      this.postboy
        .subscribe<ChartUpdateCommand>(ChartUpdateCommand.ID)
        .pipe(first())
        .subscribe((ev) => {
          this.dataUpdated();
        }),
    );
  };

  protected getDataset = () => {
    if (!this.chart) return [];
    let content = this.postboy.execute<BuildAreaChartExecutor,AreaBuilderModel>(
      new BuildAreaChartExecutor(
        this._settings,
        this._dataFiltered,
        this.postboy.execute(
          new GetGradientExecutor(this.chart ?? null, this._settings.colors, this._settings.direction),
        ),
      ),
    );
    this.alsoDelete = () => content.bottom.id;
    return [content.top, content.bottom];
  };
}
