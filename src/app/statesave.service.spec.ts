import { TestBed } from '@angular/core/testing';

import { StatesaveService } from './statesave.service';

describe('StatesaveService', () => {
  let service: StatesaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatesaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
