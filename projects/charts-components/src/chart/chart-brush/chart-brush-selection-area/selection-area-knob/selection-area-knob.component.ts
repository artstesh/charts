import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ChartBrushService } from '../../services/chart-brush.service';

@Component({
   selector: 'app-selection-area-knob',
   templateUrl: './selection-area-knob.component.html',
   styleUrls: ['./selection-area-knob.component.scss']
})
export class SelectionAreaKnobComponent implements OnInit {
   @Input() side: 'left' | 'right' = 'left';
   isDown = false;
   private mouseDownPosition = 0;

   constructor(private service: ChartBrushService) {}

   ngOnInit(): void {}

   mousedown($event: MouseEvent | TouchEvent) {
      $event.preventDefault();
      $event.stopPropagation();
      this.mouseDownPosition = $event instanceof MouseEvent ? $event.clientX : $event.touches[0].clientX;
      this.isDown = true;
   }

   @HostListener('document:mouseup', ['$event'])
   @HostListener('document:touchend', ['$event'])
   mouseup() {
      this.isDown = false;
   }

   @HostListener('document:mouseleave', ['$event'])
   mouseleave() {
      this.isDown = false;
   }

   @HostListener('document:mousemove', ['$event'])
   @HostListener('document:touchmove', ['$event'])
   mousemove($event: MouseEvent | TouchEvent) {
      if (this.isDown) {
         const newMousePosition = $event instanceof MouseEvent ? $event.clientX : $event.touches[0].clientX;
         this.service.moveBorder(newMousePosition - this.mouseDownPosition, this.side);
         this.mouseDownPosition = newMousePosition;
      }
   }
}
