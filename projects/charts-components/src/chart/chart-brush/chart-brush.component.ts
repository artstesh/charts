import { Component, OnInit } from '@angular/core';
import { BrushRegistratorService } from './services/brush-registrator.service';
import { DestructibleComponent } from '../common/destructible.component';
import { ChartBrushService } from './services/chart-brush.service';
import { BrushParentService } from './services/brush-parent.service';

@Component({
  selector: 'art-chart-brush',
  templateUrl: './chart-brush.component.html',
  styleUrls: ['./chart-brush.component.scss'],
  providers: [BrushRegistratorService, ChartBrushService, BrushParentService],
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
