import { NgModule } from '@angular/core';
import { ChartBarComponent, ChartLineComponent, ChartPlateComponent } from './chart-plate';
import { CommonModule } from '@angular/common';
import { XLinearAxisComponent } from './chart-plate/chart-elements/axis';
import { ChartLegendComponent } from './chart-plate/chart-elements/legend';
import { DestructibleComponent } from './common/destructible.component';
import { XCategoryAxisComponent } from './chart-plate/chart-elements/axis/x-category-axis/x-category-axis.component';
import { XTimelineAxisComponent } from './chart-plate/chart-elements/axis/x-timeline-axis/x-timeline-axis.component';

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
  ],
  exports: [
    ChartPlateComponent,
    ChartLineComponent,
    ChartBarComponent,
    XLinearAxisComponent,
    ChartLegendComponent,
    XCategoryAxisComponent,
    XTimelineAxisComponent,
  ],
})
export class ChartModule {}
