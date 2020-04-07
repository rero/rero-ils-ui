import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { PatronTransactionService } from './patron-transaction.service';


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

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
