import { NgModule } from '@angular/core';
import { ChartPlateComponent } from './chart-plate/chart-plate.component';
import { ChartLineComponent } from './chart-plate/chart-types/line-chart/chart-line.component';
import { ChartBarComponent } from './chart-plate/chart-types/bar-chart/chart-bar.component';
import { CommonModule } from '@angular/common';
import { XLinearAxisComponent } from './chart-plate/chart-elements/axes/x-linear-axis/x-linear-axis.component';
import { ChartLegendComponent } from './chart-plate/chart-elements/legend';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ChartPlateComponent,
    ChartLineComponent,
    ChartBarComponent,
    XLinearAxisComponent,
    ChartLegendComponent,
  ],
  exports: [ChartPlateComponent, ChartLineComponent, ChartBarComponent, XLinearAxisComponent, ChartLegendComponent],
})
export class ChartModule {}
