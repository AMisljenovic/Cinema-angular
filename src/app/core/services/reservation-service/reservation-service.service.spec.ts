import { TestBed } from '@angular/core/testing';
import { ReservationService } from './reservation-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('ReservationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
  }));

  it('should be created', () => {
    const service: ReservationService = TestBed.get(ReservationService);
    expect(service).toBeTruthy();
  });
});
