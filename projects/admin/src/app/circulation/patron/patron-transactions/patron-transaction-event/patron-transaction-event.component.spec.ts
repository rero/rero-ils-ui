import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreModule, RecordModule } from '@rero/ng-core';
import { PatronTransactionEventComponent } from './patron-transaction-event.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

describe('PatronTransactionEventComponent', () => {
  let component: PatronTransactionEventComponent;
  let fixture: ComponentFixture<PatronTransactionEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CoreModule,
        RecordModule,
        HttpClientModule
      ],
      declarations: [
        PatronTransactionEventComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronTransactionEventComponent);
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
