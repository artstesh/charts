import { NgModule } from '@angular/core';
import { ChartBarComponent, ChartLineComponent, ChartPlateComponent } from './chart-plate';
import { CommonModule } from '@angular/common';
import { XLinearAxisComponent } from './chart-plate/chart-elements/axes';
import { ChartLegendComponent } from './chart-plate/chart-elements/legend';
import { DestructibleComponent } from './common/destructible.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ChartPlateComponent,
    ChartLineComponent,
    ChartBarComponent,
    XLinearAxisComponent,
    ChartLegendComponent,
    DestructibleComponent,
  ],
  exports: [ChartPlateComponent, ChartLineComponent, ChartBarComponent, XLinearAxisComponent, ChartLegendComponent],
})
export class ChartModule {}
