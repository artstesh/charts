import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XLabeledAxisComponent } from './x-labeled-axis.component';

describe('XLabeledAxisComponent', () => {
  let component: XLabeledAxisComponent;
  let fixture: ComponentFixture<XLabeledAxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XLabeledAxisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XLabeledAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
