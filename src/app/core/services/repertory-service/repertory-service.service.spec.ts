import { TestBed } from '@angular/core/testing';
import { RepertoryService } from './repertory-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RepertoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
  }));

  it('should be created', () => {
    const service: RepertoryService = TestBed.get(RepertoryService);
    expect(service).toBeTruthy();
  });
});
