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
import { OrdinateAxisComponent } from './chart-plate/chart-elements/axis/ordinate-axis/ordinate-axis.component';
import { ChartBrushComponent } from './chart-brush/chart-brush.component';
import { BrushSelectionAreaComponent } from './chart-brush/components/brush-selection-area/brush-selection-area.component';
import { BrushKnobComponent } from './chart-brush/components/brush-selection-area/brush-knob/brush-knob.component';
import { AreaChartComponent } from './chart-plate/chart-types/area-chart/area-chart.component';
import { BubbleChartComponent } from './chart-plate/chart-types/bubble-chart/bubble-chart.component';
import { BrushChartCloneComponent } from './chart-brush/components/brush-chart-clone/brush-chart-clone.component';
import { ScatterChartComponent } from './chart-plate/chart-types/scatter-chart/scatter-chart.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ChartPlateComponent,
    ChartLineComponent,
    ScatterChartComponent,
    ChartBarComponent,
    XLinearAxisComponent,
    ChartLegendComponent,
    DestructibleComponent,
    XCategoryAxisComponent,
    XTimelineAxisComponent,
    ChartTooltipComponent,
    DoughnutChartComponent,
    OrdinateAxisComponent,
    ChartBrushComponent,
    BrushSelectionAreaComponent,
    BrushKnobComponent,
    AreaChartComponent,
    BubbleChartComponent,
    BrushChartCloneComponent,
  ],
  exports: [
    ChartPlateComponent,
    ChartLineComponent,
    ScatterChartComponent,
    ChartBarComponent,
    XLinearAxisComponent,
    ChartLegendComponent,
    XCategoryAxisComponent,
    XTimelineAxisComponent,
    ChartTooltipComponent,
    DoughnutChartComponent,
    OrdinateAxisComponent,
    AreaChartComponent,
    ChartBrushComponent,
    BubbleChartComponent,
  ],
})
export class ChartModule {}
