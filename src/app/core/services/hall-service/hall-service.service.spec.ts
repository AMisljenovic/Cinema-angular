import { TestBed } from '@angular/core/testing';

import { HallService } from './hall-service.service';

describe('HallServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HallService = TestBed.get(HallService);
    expect(service).toBeTruthy();
  });
});
