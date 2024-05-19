import { TestBed } from '@angular/core/testing';

import { BrushParentService } from './brush-parent.service';

describe('BrushParentService', () => {
  let service: BrushParentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrushParentService);
  });
});
