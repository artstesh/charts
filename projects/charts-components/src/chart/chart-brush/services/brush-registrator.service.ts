import { Injectable } from '@angular/core';
import { PostboyAbstractRegistrator } from '@artstesh/postboy';
import { ChartPostboyService } from '../../services/chart-postboy.service';
import { ChartBrushService } from './chart-brush.service';
import { MoveBrushBorderCommand } from '../../messages/commands/move-brush-border.command';
import { ReplaySubject } from 'rxjs';
import { auditTime, distinctUntilChanged } from 'rxjs/operators';
import { BrushAreaEvent } from '../messages/events/brush-area.event';
import { ZoomAreaCommand } from '../messages/commands/zoom-area.command';
import { MoveBrushCommand } from '../messages/commands/move-brush.command';
import { WidthRestrictionsCommand } from '../messages/commands/width-restrictions.command';

@Injectable()
export class BrushRegistratorService extends PostboyAbstractRegistrator {
  constructor(postboy: ChartPostboyService, general: ChartBrushService) {
    super(postboy);
    this.registerServices([general]);
  }

  protected _up(): void {
    this.registerSubject<MoveBrushBorderCommand>(MoveBrushBorderCommand.ID);
    this.registerSubject<ZoomAreaCommand>(ZoomAreaCommand.ID);
    this.registerSubject<WidthRestrictionsCommand>(WidthRestrictionsCommand.ID);
    this.registerSubject<MoveBrushCommand>(MoveBrushCommand.ID);
    this.registerWithPipe<BrushAreaEvent>(BrushAreaEvent.ID, new ReplaySubject<BrushAreaEvent>(1), (s) =>
      s.pipe(
        distinctUntilChanged((a, b) => a.range.left !== b.range.left || a.range.width !== b.range.width),
        auditTime(350),
      ),
    );
  }
}
