// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { AppStore, testUserPatronWithSettings, User } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { LoanApiService } from '../../../api/loan-api.service';
import { PatronProfileStore } from '../../store/patron-profile.store';
import { PatronProfileRequestComponent } from './patron-profile-request.component';

describe('PatronProfileRequestComponent', () => {
  let component: PatronProfileRequestComponent;
  let fixture: ComponentFixture<PatronProfileRequestComponent>;
  let store: InstanceType<typeof PatronProfileStore>;

  const record = {
    metadata: {
      pid: '1',
      document: {
        pid: '1',
        title: [{ type: 'bf:Title', _text: 'Document title' }]
      },
      item: {},
      pickup_name: 'Pickup name',
      state: 'ITEM_AT_DESK',
      rank: 3
    }
  };

  const appStoreSpy = {
    user: vi.fn().mockReturnValue(new User(cloneDeep(testUserPatronWithSettings)))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        TranslateModule.forRoot(),
        PatronProfileRequestComponent
    ],
    providers: [
      { provide: AppStore, useValue: appStoreSpy },
        { provide: LoanApiService, useValue: { cancel: vi.fn().mockReturnValue(of(null)) } },
        { provide: MessageService, useValue: { add: vi.fn() } },
        { provide: RecordService, useValue: { getRecord: vi.fn().mockReturnValue(of({ metadata: {} })), MAX_REST_RESULTS_SIZE: 1000 } },
        provideHttpClient(),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileRequestComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(PatronProfileStore);
    store.init(new User(cloneDeep(testUserPatronWithSettings)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the document information button and link', () => {
    fixture.componentRef.setInput('record', record);
    fixture.detectChanges();
    const documentLink = fixture.nativeElement.querySelector('public-search-patron-profile-document');
    expect(documentLink.length === 1);

    const pickupName = fixture.nativeElement.querySelectorAll('div')[1];
    expect(pickupName.textContent).toContain('Pickup name');
  });

  it('should display the loan with ITEM_AT_DESK state', () => {
    record.metadata.state = 'ITEM_AT_DESK';
    fixture.componentRef.setInput('record', record);
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelectorAll('div')[2];
    expect(div.textContent).toContain('to pick up');
  });

  it('should display the loan with PENDING state', () => {
    record.metadata.state = 'PENDING';
    fixture.componentRef.setInput('record', record);
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelectorAll('div')[2];
    expect(div.textContent).toContain('(position {{ rank }} in waiting list)');
    const button = fixture.nativeElement.querySelector('.p-button-label');
    expect(button.textContent).toContain('Cancel');
  });
});
