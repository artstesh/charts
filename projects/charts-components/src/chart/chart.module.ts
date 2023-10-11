import { NgModule } from '@angular/core';
import { ChartPlateComponent } from './chart-plate/chart-plate.component';
import { ChartLineComponent } from './chart-plate/chart-types/line-chart/chart-line.component';
import { ChartBarComponent } from './chart-plate/chart-types/bar-chart/chart-bar.component';
import { YAxisComponent } from './chart-plate/chart-elements/y-axis/y-axis.component';
import { ChartAreaComponent } from './chart-plate/chart-types/area-chart/chart-area.component';
import { ChartLegendComponent } from './chart-plate/chart-elements/chart-legend/chart-legend.component';
import { ChartPointTooltipComponent } from './chart-plate/chart-elements/chart-tooltip/chart-point-tooltip.component';
import { CommonModule } from '@angular/common';
import { XAxisComponent } from './chart-plate/chart-elements/x-axis/x-axis.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartExtendableLegendComponent } from './chart-plate/chart-elements/chart-extendable-legend/chart-extendable-legend.component';
import { ChartScatterComponent } from './chart-plate/chart-types/chart-scatter/chart-scatter.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipContentHostDirective } from './chart-plate/chart-elements/chart-tooltip/tooltip-content-host.directive';
import { DefaultTooltipContentComponent } from './chart-plate/chart-elements/chart-tooltip/default-tooltip-content/default-tooltip-content.component';
import {ChartBrushComponent} from "./chart-brush/chart-brush.component";
import {
  ChartBrushSelectionAreaComponent
} from "./chart-brush/chart-brush-selection-area/chart-brush-selection-area.component";
import {
  SelectionAreaKnobComponent
} from "./chart-brush/chart-brush-selection-area/selection-area-knob/selection-area-knob.component";
import { LocalizedDateComponent } from "./common/localized-date/localized-date.component";

@NgModule({
   imports: [CommonModule, FlexLayoutModule, TranslateModule],
   declarations: [
     LocalizedDateComponent,
      ChartPlateComponent,
      ChartLineComponent,
      ChartBarComponent,
      YAxisComponent,
      ChartAreaComponent,
      ChartLegendComponent,
      ChartPointTooltipComponent,
      XAxisComponent,
      ChartExtendableLegendComponent,
      ChartScatterComponent,
      ChartBrushComponent,
      ChartBrushSelectionAreaComponent,
      SelectionAreaKnobComponent,
      TooltipContentHostDirective,
      DefaultTooltipContentComponent
   ],
  exports: [
    ChartPlateComponent,
    ChartLineComponent,
    YAxisComponent,
    ChartBarComponent,
    ChartAreaComponent,
    ChartLegendComponent,
    ChartPointTooltipComponent,
    XAxisComponent,
    ChartExtendableLegendComponent,
    ChartScatterComponent,
    ChartBrushComponent,
    ChartBrushSelectionAreaComponent,
    SelectionAreaKnobComponent
  ]
})
export class ChartModule {}
