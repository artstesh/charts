import { ComponentFixture } from '@angular/core/testing';

import { BrushChartCloneComponent } from './brush-chart-clone.component';
import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { should } from '@artstesh/it-should';
import { PostboyWorld } from '@artstesh/postboy-testing';

describe('BrushChartCloneComponent', () => {
  let fixture: MockedComponentFixture<BrushChartCloneComponent>;
  let world: PostboyWorld;

  beforeEach(async () => {
    world = new PostboyWorld();
    return MockBuilder(BrushChartCloneComponent).provide({
      provide: InnerPostboyService,
      useValue: world.postboy,
    });
  });

  beforeEach(() => {
    fixture = MockRender(BrushChartCloneComponent);
  });

  afterEach(() => {
    world.dispose();
    expect().nothing();
  });

  it('should create', () => {
    should().true(fixture.componentInstance);
  });
});
