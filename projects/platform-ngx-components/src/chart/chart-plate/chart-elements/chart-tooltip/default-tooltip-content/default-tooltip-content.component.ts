import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TooltipContentComponent, TooltipDataModel } from '../';

@Component({
   selector: 'ap-default-tooltip-content',
   templateUrl: './default-tooltip-content.component.html',
   styleUrls: ['./default-tooltip-content.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultTooltipContentComponent implements TooltipContentComponent {
   data?: TooltipDataModel;

   constructor() {}
}
