import { TestBed } from '@angular/core/testing';

import { TicketService } from '../ticket-service/ticket-service.service';

describe('TicketServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketService = TestBed.get(TicketService);
    expect(service).toBeTruthy();
  });
});
