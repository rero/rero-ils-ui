import { TestBed } from '@angular/core/testing';

import { LoanService } from './loan.service';
import { HttpClientModule } from '@angular/common/http';

describe('LoanService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: LoanService = TestBed.get(LoanService);
    expect(service).toBeTruthy();
  });
});
