import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';

@Component({
  selector: 'lib-x-category-axis',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XCategoryAxisComponent implements OnInit, OnDestroy {
  static id = 'x';
  private subs: Subscription[] = [];

  constructor(private service: ChartPlateService, private mapService: SettingsMapService) {}

  _labels: string[] = [];

  @Input() set labels(value: string[]) {
    if (!value?.length) return;
    this._labels = value;
    this.setAxis();
  }

  ngOnInit(): void {
    this.subs.push(this.service.chartInitialized.subscribe(() => this.setAxis()));
  }

  setAxis(): void {
    this.service.setScale(XCategoryAxisComponent.id, this.mapService.xCategoryScale(this._labels));
  }

  ngOnDestroy(): void {
    this.resetAxis();
    this.subs.forEach((s) => s.unsubscribe());
  }

  private resetAxis(): void {
    this.service.resetScale(XCategoryAxisComponent.id);
  }
}
