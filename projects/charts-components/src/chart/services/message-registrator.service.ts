import { Injectable } from '@angular/core';
import { PostboyAbstractRegistrator } from '@artstesh/postboy';
import { ChartPostboyService } from './chart-postboy.service';
import { ChartInitializedEvent } from '../messages/events/chart-initialized.event';
import { ChartPlateService } from '../chart-plate/services/chart-plate.service';
import { auditTime, distinctUntilChanged } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { ChartUpdateCommand } from '../messages/commands/chart-update.command';
import { ChartLimitEvent } from '../messages/events/chart-limit.event';
import { FilterDatasetQuery } from '../messages/queries/filter-dataset.query';

@Injectable()
export class MessageRegistratorService extends PostboyAbstractRegistrator {
  constructor(postboy: ChartPostboyService, general: ChartPlateService) {
    super(postboy);
    this.registerServices([general]);
  }

  protected _up(): void {
    this.registerReplay<ChartInitializedEvent>(ChartInitializedEvent.ID);
    this.registerSubject<FilterDatasetQuery>(FilterDatasetQuery.ID);
    this.registerWithPipe<ChartUpdateCommand>(ChartUpdateCommand.ID, new Subject<ChartUpdateCommand>(), (s) =>
      s.pipe(auditTime(350)),
    );
    this.registerWithPipe<ChartLimitEvent>(ChartLimitEvent.ID, new ReplaySubject<ChartLimitEvent>(1), (s) =>
      s.pipe(
        distinctUntilChanged((x, y) => x?.limits.isTheSame(y?.limits) ?? false),
        auditTime(50),
      ),
    );
  }
}
