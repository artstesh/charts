import { ComponentFixture } from '@angular/core/testing';

import { BrushChartCloneComponent } from './brush-chart-clone.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../chart.module';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { should } from '@artstesh/it-should';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { ReplaySubject, Subject } from 'rxjs';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';
import { PostboyServiceMock } from '@artstesh/postboy-testing';
import { ToggleGraphVisibilityCommand } from '../../../messages/commands/toggle-graph-visibility.command';

describe('BrushChartCloneComponent', () => {
  let fixture: ComponentFixture<BrushChartCloneComponent>;
  let postboy: PostboyServiceMock;

  beforeEach(async () => {
    postboy = new PostboyServiceMock();
    postboy.record(ChartInitializedEvent, new ReplaySubject());
    postboy.record(ToggleGraphVisibilityCommand, new Subject());
    postboy.record(ChartDataEvent, new ReplaySubject());
    return MockBuilder(BrushChartCloneComponent, ChartModule).provide({
      provide: InnerPostboyService,
      useValue: postboy,
    });
  });

  beforeEach(() => {
    fixture = MockRender(BrushChartCloneComponent);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('should create', () => {
    should().true(fixture.componentInstance);
  });
});
