import { TestBed } from '@angular/core/testing';

import { CalldataService } from './calldata.service';

describe('CalldataService', () => {
  let service: CalldataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalldataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
