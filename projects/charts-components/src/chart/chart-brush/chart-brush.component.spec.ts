import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBrushComponent } from './chart-brush.component';

describe('ChartBrushComponent', () => {
  let component: ChartBrushComponent;
  let fixture: ComponentFixture<ChartBrushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartBrushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
