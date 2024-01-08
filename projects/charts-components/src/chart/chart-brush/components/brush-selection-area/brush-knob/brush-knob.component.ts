import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ChartPostboyService } from '../../../../services/chart-postboy.service';
import { MoveBrushBorderCommand } from '../../../../messages/commands/move-brush-border.command';

@Component({
  selector: 'art-brush-knob',
  templateUrl: './brush-knob.component.html',
  styleUrls: ['./brush-knob.component.scss'],
})
export class BrushKnobComponent implements OnInit {
  @Input() side: 'left' | 'right' = 'left';
  isDown = false;
  private mouseDownPosition = 0;

  constructor(private postboy: ChartPostboyService) {}

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
      this.postboy.fire(new MoveBrushBorderCommand(newMousePosition - this.mouseDownPosition, this.side));
      this.mouseDownPosition = newMousePosition;
    }
  }
}