import { TestBed } from '@angular/core/testing';

import { RepertoryService } from './repertory-service.service';

describe('RepertoryServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RepertoryService = TestBed.get(RepertoryService);
    expect(service).toBeTruthy();
  });
});
