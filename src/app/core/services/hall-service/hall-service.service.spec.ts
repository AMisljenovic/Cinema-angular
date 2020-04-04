import { TestBed } from '@angular/core/testing';

import { HallServiceService } from './hall-service.service';

describe('HallServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HallServiceService = TestBed.get(HallServiceService);
    expect(service).toBeTruthy();
  });
});
