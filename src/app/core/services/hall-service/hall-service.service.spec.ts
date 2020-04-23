import { TestBed } from '@angular/core/testing';
import { HallService } from './hall-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HallService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
  }));

  it('should be created', () => {
    const service: HallService = TestBed.get(HallService);
    expect(service).toBeTruthy();
  });
});
