import { Injectable } from '@angular/core';
import { PostboyAbstractRegistrator } from '@artstesh/postboy';
import { ChartPostboyService } from './chart-postboy.service';
import { ChartInitializedEvent } from '../messages/events/chart-initialized.event';
import { MoveBrushBorderCommand } from '../messages/commands/move-brush-border.command';
import { ChartPlateService } from '../chart-plate/services/chart-plate.service';
import { auditTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChartUpdateCommand } from "../messages/commands/chart-update.command";

@Injectable()
export class MessageRegistratorService extends PostboyAbstractRegistrator {
  constructor(postboy: ChartPostboyService, general: ChartPlateService) {
    super(postboy);
    this.registerServices([general]);
  }

  protected _up(): void {
    this.registerReplay<ChartInitializedEvent>(ChartInitializedEvent.ID);
    this.registerSubject<MoveBrushBorderCommand>(MoveBrushBorderCommand.ID);
    this.registerWithPipe<ChartUpdateCommand>(
      MoveBrushBorderCommand.ID,
      new Subject<ChartUpdateCommand>(),
      (s) => s.pipe(auditTime(350)),
    );
  }
}
