import { Injectable } from '@angular/core';
import { PostboyAbstractRegistrator } from '@artstesh/postboy';
import { InnerPostboyService } from '../../services/inner-postboy.service';
import { ChartBrushService } from './chart-brush.service';
import { MoveBrushBorderCommand } from '../../messages/commands/move-brush-border.command';
import { ReplaySubject } from 'rxjs';
import { auditTime, distinctUntilChanged } from 'rxjs/operators';
import { BrushAreaEvent } from '../messages/events/brush-area.event';
import { ZoomAreaCommand } from '../messages/commands/zoom-area.command';
import { MoveBrushCommand } from '../messages/commands/move-brush.command';
import { BrushParentService } from './brush-parent.service';
import { ResetBrushCommand } from '../messages/commands/reset-brush.command';

@Injectable()
export class BrushRegistratorService extends PostboyAbstractRegistrator {
  constructor(postboy: InnerPostboyService, general: ChartBrushService, parent: BrushParentService) {
    super(postboy);
    this.registerServices([general, parent]);
  }

  protected _up(): void {
    this.recordSubject(MoveBrushBorderCommand);
    this.recordSubject(ZoomAreaCommand);
    this.recordSubject(MoveBrushCommand);
    this.recordSubject(ResetBrushCommand);
    this.recordWithPipe(BrushAreaEvent, new ReplaySubject<BrushAreaEvent>(1), (s) =>
      s.pipe(
        distinctUntilChanged((a, b) => a.range.left === b.range.left && a.range.width === b.range.width),
        auditTime(10),
      ),
    );
  }
}
