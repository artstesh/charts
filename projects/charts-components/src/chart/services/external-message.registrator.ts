import { PostboyAbstractRegistrator } from '@artstesh/postboy';
import { ChartPostboyService } from './chart-postboy.service';
import { Injectable } from '@angular/core';
import { InnerPostboyService } from './inner-postboy.service';
import { ToggleGraphVisibilityCommand } from '../messages/commands/toggle-graph-visibility.command';

@Injectable()
export class ExternalMessageRegistrator extends PostboyAbstractRegistrator {
  constructor(postboy: ChartPostboyService, private innerPostboy: InnerPostboyService) {
    super(postboy);
    this.registerServices([]);
  }

  protected _up(): void {
    if (!this.postboy) return;
    this.recordSubject(ToggleGraphVisibilityCommand);
    this.postboy.sub(ToggleGraphVisibilityCommand).subscribe((c) => this.innerPostboy.fire(c));
  }
}
