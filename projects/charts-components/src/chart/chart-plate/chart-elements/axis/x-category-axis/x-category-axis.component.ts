import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';

@Component({
  selector: 'art-x-category-axis',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XCategoryAxisComponent implements OnInit, OnDestroy {
  static id = 'x';
  private subs: Subscription[] = [];

  constructor(
    private service: ChartPlateService,
    private postboy: InnerPostboyService,
    private mapService: SettingsMapService,
  ) {}

  _labels: string[] = [];

  @Input() set labels(value: string[]) {
    if (!value?.length) return;
    this._labels = value;
    this.setAxis();
  }

  ngOnInit(): void {
    this.subs.push(
      this.postboy.subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID).subscribe(() => this.setAxis()),
    );
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
