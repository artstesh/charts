import { NgModule } from '@angular/core';
import { ChartBarComponent, ChartLineComponent, ChartPlateComponent } from './chart-plate';
import { CommonModule } from '@angular/common';
import { XLinearAxisComponent } from './chart-plate/chart-elements/axes';
import { ChartLegendComponent } from './chart-plate/chart-elements/legend';
import { DestructibleComponent } from './common/destructible.component';
import { XCategoryAxisComponent } from './chart-plate/chart-elements/axes/x-category-axis/x-category-axis.component';

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
  ],
  exports: [
    ChartPlateComponent,
    ChartLineComponent,
    ChartBarComponent,
    XLinearAxisComponent,
    ChartLegendComponent,
    XCategoryAxisComponent,
  ],
})
export class ChartModule {}
