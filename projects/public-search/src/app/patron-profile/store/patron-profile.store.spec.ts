// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { testUserPatronMultipleOrganisationsWithSettings, User } from '@rero/shared';
import { of } from 'rxjs';
import { IllRequestApiService } from '../../api/ill-request-api.service';
import { LoanApiService } from '../../api/loan-api.service';
import { PatronApiService } from '../../api/patron-api.service';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { PatronProfileStore } from './patron-profile.store';

describe('PatronProfileStore', () => {
  let store: InstanceType<typeof PatronProfileStore>;
  const user = new User(testUserPatronMultipleOrganisationsWithSettings);

  beforeEach(() => {
    store = TestBed.configureTestingModule({
      providers: [
        PatronProfileStore,
        { provide: LoanApiService, useValue: {} },
        {
          provide: PatronTransactionApiService,
          useValue: { getFees: vi.fn().mockReturnValue(of({ hits: { hits: [] } })) },
        },
        {
          provide: PatronApiService,
          useValue: { getOverduePreviewByPatronPid: vi.fn().mockReturnValue(of([])) },
        },
        { provide: IllRequestApiService, useValue: {} },
        { provide: NgxSpinnerService, useValue: {} },
        { provide: TranslateService, useValue: { instant: vi.fn((value: string) => value) } },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    })
      .inject(PatronProfileStore);
  });

  it('should have correct initial state', () => {
    expect(store.patrons()).toEqual([]);
    expect(store.currentPatron()).toBeNull();
    expect(store.patronPid()).toBeNull();
    expect(store.menu()).toEqual([]);
    expect(store.isMultiOrganisation()).toBe(false);
    expect(store.activeTab()).toBeNull();
    expect(store.cancelledRequestPid()).toBeNull();
    expect(store.loans()).toEqual([]);
    expect(store.loansLoaded()).toBe(false);
    expect(store.loansSortCriteria()).toBe('duedate');
    expect(store.renewingLoans()).toBe(false);
    expect(store.requests()).toEqual([]);
    expect(store.requestsLoaded()).toBe(false);
    expect(store.fees()).toEqual([]);
    expect(store.feesLoaded()).toBe(false);
    expect(store.illRequests()).toEqual([]);
    expect(store.illRequestsLoaded()).toBe(false);
  });

  describe('init()', () => {
    it('should populate patrons and menu from user', () => {
      store.init(user);
      expect(store.patrons()).toHaveLength(2);
      expect(store.menu()).toEqual([
        { value: '1', name: 'Organisation 1' },
        { value: '10', name: 'Organisation 2' },
      ]);
    });

    it('should set currentPatron to first entry', () => {
      store.init(user);
      expect(store.currentPatron()?.pid).toBe('1');
      expect(store.patronPid()).toBe('1');
    });

    it('should set isMultiOrganisation to true for multiple patrons', () => {
      store.init(user);
      expect(store.isMultiOrganisation()).toBe(true);
    });

    it('should set isMultiOrganisation to false for a single patron', () => {
      const single = new User({ ...testUserPatronMultipleOrganisationsWithSettings,
        patrons: [testUserPatronMultipleOrganisationsWithSettings.patrons[0]] });
      store.init(single);
      expect(store.isMultiOrganisation()).toBe(false);
    });

    it('should handle user with no patron role', () => {
      const noPatron = new User({ ...testUserPatronMultipleOrganisationsWithSettings,
        patrons: [{ ...testUserPatronMultipleOrganisationsWithSettings.patrons[0], roles: ['librarian' as const] }] });
      store.init(noPatron);
      expect(store.patrons()).toHaveLength(0);
      expect(store.currentPatron()).toBeNull();
    });
  });

  describe('changePatron()', () => {
    beforeEach(() => store.init(user));

    it('should switch to second patron', () => {
      store.changePatron('10');
      expect(store.currentPatron()?.pid).toBe('10');
      expect(store.patronPid()).toBe('10');
    });

    it('should switch back to first patron', () => {
      store.changePatron('10');
      store.changePatron('1');
      expect(store.currentPatron()?.pid).toBe('1');
    });

    it('should set null for unknown patronPid', () => {
      store.changePatron('unknown');
      expect(store.currentPatron()).toBeNull();
      expect(store.patronPid()).toBeNull();
    });
  });

  describe('changeTab()', () => {
    it('should set activeTab', () => {
      store.changeTab('loan');
      expect(store.activeTab()).toBe('loan');
    });

    it('should update activeTab', () => {
      store.changeTab('loan');
      store.changeTab('request');
      expect(store.activeTab()).toBe('request');
    });
  });

});
