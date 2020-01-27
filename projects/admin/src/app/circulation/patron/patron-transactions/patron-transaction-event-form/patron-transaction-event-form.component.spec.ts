import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatronTransactionEventFormComponent } from './patron-transaction-event-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { CoreModule } from '@rero/ng-core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

describe('PatronTransactionEventFormComponent', () => {
  let component: PatronTransactionEventFormComponent;
  let fixture: ComponentFixture<PatronTransactionEventFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        FormlyModule,
        CoreModule,
        HttpClientModule,
        RouterTestingModule,
      ],
      declarations: [
        PatronTransactionEventFormComponent
      ],
      providers: [
        BsModalRef
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronTransactionEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
