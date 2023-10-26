import { NgModule } from '@angular/core';
import { ChartPlateComponent } from './chart-plate/chart-plate.component';
import { ChartLineComponent } from './chart-plate/chart-types/line-chart/chart-line.component';
import { ChartBarComponent } from './chart-plate/chart-types/bar-chart/chart-bar.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { XLinearAxisComponent } from './chart-plate/chart-elements/axes/x-linear-axis/x-linear-axis.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, TranslateModule],
  declarations: [ChartPlateComponent, ChartLineComponent, ChartBarComponent, XLinearAxisComponent],
  exports: [ChartPlateComponent, ChartLineComponent, ChartBarComponent],
})
export class ChartModule {}
