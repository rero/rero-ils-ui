import { TestBed } from '@angular/core/testing';

import { PatronTransactionService } from './patron-transaction.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';

describe('PatronTransactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot({}),
      HttpClientModule,
      RouterTestingModule,
      ToastrModule.forRoot()
    ]
  }));

  it('should be created', () => {
    const service: PatronTransactionService = TestBed.get(PatronTransactionService);
    expect(service).toBeTruthy();
  });
});
