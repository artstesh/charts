import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushChartCloneComponent } from './brush-chart-clone.component';

describe('BrushChartCloneComponent', () => {
  let component: BrushChartCloneComponent;
  let fixture: ComponentFixture<BrushChartCloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrushChartCloneComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushChartCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
