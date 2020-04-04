import { TestBed } from '@angular/core/testing';

import { TicketServiceService } from '../ticket-service/ticket-service.service';

describe('TicketServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketServiceService = TestBed.get(TicketServiceService);
    expect(service).toBeTruthy();
  });
});
