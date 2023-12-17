import { NgModule } from '@angular/core';
import { ChartBarComponent, ChartLineComponent, ChartPlateComponent } from './chart-plate';
import { CommonModule } from '@angular/common';
import { XLinearAxisComponent } from './chart-plate/chart-elements/axis';
import { ChartLegendComponent } from './chart-plate/chart-elements/legend';
import { DestructibleComponent } from './common/destructible.component';
import { XCategoryAxisComponent } from './chart-plate/chart-elements/axis/x-category-axis/x-category-axis.component';
import { XTimelineAxisComponent } from './chart-plate/chart-elements/axis/x-timeline-axis/x-timeline-axis.component';
import { ChartTooltipComponent } from './chart-plate/chart-elements/chart-tooltip/chart-tooltip.component';
import { DoughnutChartComponent } from './chart-plate/chart-types/doughnut-chart/doughnut-chart.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ChartPlateComponent,
    ChartLineComponent,
    ChartBarComponent,
    XLinearAxisComponent,
    ChartLegendComponent,
    DestructibleComponent,
    XCategoryAxisComponent,
    XTimelineAxisComponent,
    ChartTooltipComponent,
    DoughnutChartComponent,
  ],
  exports: [
    ChartPlateComponent,
    ChartLineComponent,
    ChartBarComponent,
    XLinearAxisComponent,
    ChartLegendComponent,
    XCategoryAxisComponent,
    XTimelineAxisComponent,
    ChartTooltipComponent,
    DoughnutChartComponent,
  ],
})
export class ChartModule {}
