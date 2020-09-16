import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoanService } from './loan.service';


describe('LoanService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      TranslateModule.forRoot()
    ]
  }));

  it('should be created', () => {
    const service: LoanService = TestBed.get(LoanService);
    expect(service).toBeTruthy();
  });
});
