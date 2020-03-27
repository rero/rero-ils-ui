import { CoreModule, RecordModule } from '@rero/ng-core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultTransactionComponent } from './patron-transaction/default-transaction/default-transaction.component';
import { OverdueTransactionComponent } from './patron-transaction/overdue-transaction/overdue-transaction.component';
import { PatronTransactionComponent } from './patron-transaction/patron-transaction.component';
import { PatronTransactionEventComponent } from './patron-transaction-event/patron-transaction-event.component';
import { PatronTransactionsComponent } from './patron-transactions.component';

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
        DefaultTransactionComponent,
        OverdueTransactionComponent,
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
});
