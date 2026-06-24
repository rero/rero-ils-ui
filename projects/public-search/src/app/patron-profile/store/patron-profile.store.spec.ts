// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { testUserPatronMultipleOrganisationsWithSettings, User } from '@rero/shared';
import { PatronProfileStore } from './patron-profile.store';

describe('PatronProfileStore', () => {
  let store: InstanceType<typeof PatronProfileStore>;
  const user = new User(testUserPatronMultipleOrganisationsWithSettings);

  beforeEach(() => {
    store = TestBed.configureTestingModule({ providers: [PatronProfileStore] })
      .inject(PatronProfileStore);
  });

  it('should have correct initial state', () => {
    expect(store.patrons()).toEqual([]);
    expect(store.currentPatron()).toBeNull();
    expect(store.menu()).toEqual([]);
    expect(store.currentMenu()).toBeNull();
    expect(store.isMultiOrganisation()).toBe(false);
    expect(store.activeTab()).toBeNull();
    expect(store.loanFeesTotal()).toBe(0);
    expect(store.cancelledRequestPid()).toBeNull();
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

    it('should set currentPatron and currentMenu to first entries', () => {
      store.init(user);
      expect(store.currentPatron()?.pid).toBe('1');
      expect(store.currentMenu()?.value).toBe('1');
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
      expect(store.currentMenu()).toBeNull();
    });
  });

  describe('changePatron()', () => {
    beforeEach(() => store.init(user));

    it('should switch to second patron', () => {
      store.changePatron('10');
      expect(store.currentPatron()?.pid).toBe('10');
      expect(store.currentMenu()?.value).toBe('10');
    });

    it('should switch back to first patron', () => {
      store.changePatron('10');
      store.changePatron('1');
      expect(store.currentPatron()?.pid).toBe('1');
    });

    it('should set null for unknown patronPid', () => {
      store.changePatron('unknown');
      expect(store.currentPatron()).toBeNull();
      expect(store.currentMenu()).toBeNull();
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

  describe('cancelRequest()', () => {
    it('should set cancelledRequestPid', () => {
      store.cancelRequest('pid-123');
      expect(store.cancelledRequestPid()).toBe('pid-123');
    });

    it('should overwrite previous cancelled pid', () => {
      store.cancelRequest('pid-1');
      store.cancelRequest('pid-2');
      expect(store.cancelledRequestPid()).toBe('pid-2');
    });
  });

  describe('addLoanFees()', () => {
    it('should accumulate fees', () => {
      store.addLoanFees(10.5);
      store.addLoanFees(5);
      expect(store.loanFeesTotal()).toBe(15.5);
    });

    it('should handle zero fees', () => {
      store.addLoanFees(0);
      expect(store.loanFeesTotal()).toBe(0);
    });
  });

  describe('resetLoanFees()', () => {
    it('should reset total and cancelledRequestPid', () => {
      store.addLoanFees(20);
      store.cancelRequest('pid-x');
      store.resetLoanFees();
      expect(store.loanFeesTotal()).toBe(0);
      expect(store.cancelledRequestPid()).toBeNull();
    });

    it('should be idempotent on initial state', () => {
      store.resetLoanFees();
      expect(store.loanFeesTotal()).toBe(0);
      expect(store.cancelledRequestPid()).toBeNull();
    });
  });
});
