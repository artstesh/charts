import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
   selector: '[apTooltipContentHost]'
})
export class TooltipContentHostDirective {
   constructor(public viewContainerRef: ViewContainerRef) {}
}
