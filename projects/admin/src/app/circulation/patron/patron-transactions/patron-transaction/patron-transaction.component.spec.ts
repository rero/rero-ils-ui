import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule, RecordModule } from '@rero/ng-core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultTransactionComponent } from './default-transaction/default-transaction.component';
import { OverdueTransactionComponent } from './overdue-transaction/overdue-transaction.component';
import { PatronTransactionComponent } from './patron-transaction.component';
import { PatronTransactionEventComponent } from '../patron-transaction-event/patron-transaction-event.component';

describe('PatronTransactionComponent', () => {
  let component: PatronTransactionComponent;
  let fixture: ComponentFixture<PatronTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        RecordModule,
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        DefaultTransactionComponent,
        OverdueTransactionComponent,
        PatronTransactionComponent,
        PatronTransactionEventComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
