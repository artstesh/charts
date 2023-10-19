import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ChartPlateComponent } from "../../../chart-plate.component";
import { DateRangeModel } from "../../../../models"

@Component({
  selector: 'lib-x-linear-axis',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XLinearAxisComponent implements OnInit, OnDestroy {
  @Input() _displayGrid = false;
  private _minValue?: number;
  private _maxValue?: number;

  @Input() set displayGrid(f: boolean) {
    if (this._displayGrid === f) return;
    this._displayGrid = f;
    this.setAxis();
  }

  static id = 'x';
  private subs: Subscription[] = [];

  constructor(private parent: ChartPlateComponent) {}

  ngOnInit(): void {
    this.subs.push(this.parent.chartInitialized.subscribe(() => this.setAxis()));
    this.subs.push(this.parent.dateRange$.subscribe(dr => this.rangeUpdated(dr)));
  }

  protected rangeUpdated(dr: DateRangeModel): void {
    this._minValue = dr.minX;
    this._maxValue = dr.maxX;
    this.setAxis();
  }

  setAxis(): void {
    if (!this.parent.chart?.options?.scales) return;
    this.parent.chart.options.scales[XLinearAxisComponent.id] = {
      type: 'linear',
      grid: {
        display: this._displayGrid
      },
      display: 'auto'
    };
    this.setRange();
    this.parent.updateChart();
  }

  setRange(): void {
    if (this._minValue) {
      this.parent.chart.options.scales![XLinearAxisComponent.id]!.min = this._minValue;
    }
    if (this._maxValue) {
      this.parent.chart.options.scales![XLinearAxisComponent.id]!.max = this._maxValue;
    }
  }

  ngOnDestroy(): void {
    this.resetAxis();
    this.subs.forEach(s => s.unsubscribe());
  }

  private resetAxis(): void {
    if (!this.parent?.chart?.data?.datasets) return;
    if (!this.parent?.chart?.options?.scales) return;
    this.parent.chart.options.scales[XLinearAxisComponent.id] = {};
    this.parent.updateChart(true);
  }
}
