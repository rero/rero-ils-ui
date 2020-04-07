import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatronTransactionsComponent } from './patron-transactions.component';
import { TranslateModule } from '@ngx-translate/core';
import { PatronTransactionComponent } from './patron-transaction/patron-transaction.component';
import { CoreModule, RecordModule } from '@rero/ng-core';
import { RouterTestingModule } from '@angular/router/testing';
import { PatronTransactionEventComponent } from './patron-transaction-event/patron-transaction-event.component';
import { HttpClientModule } from '@angular/common/http';

describe('PatronTransactionsComponent', () => {
  let component: PatronTransactionsComponent;
  let fixture: ComponentFixture<PatronTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CoreModule,
        RecordModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        PatronTransactionsComponent,
        PatronTransactionComponent,
        PatronTransactionEventComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
