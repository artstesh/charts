import { Component, OnInit } from '@angular/core';
import { BrushRegistratorService } from './services/brush-registrator.service';
import { DestructibleComponent } from '../common/destructible.component';

@Component({
  selector: 'art-chart-brush',
  templateUrl: './chart-brush.component.html',
  styleUrls: ['./chart-brush.component.scss'],
  providers: [BrushRegistratorService],
})
export class ChartBrushComponent extends DestructibleComponent implements OnInit {
  constructor(private registrator: BrushRegistratorService) {
    super();
    this.registrator.up();
  }

  ngOnInit(): void {}

  onDestroy = () => {
    this.registrator.down();
  };
}
