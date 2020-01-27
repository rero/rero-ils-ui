import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatronTransactionComponent } from './patron-transaction.component';
import { CoreModule, RecordModule } from '@rero/ng-core';
import { RouterTestingModule } from '@angular/router/testing';
import { PatronTransactionEventComponent } from '../patron-transaction-event/patron-transaction-event.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
