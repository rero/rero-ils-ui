/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { EMPTY, firstValueFrom, lastValueFrom, of, throwError } from 'rxjs';
import { UserApiService } from '../api/user-api.service';
import { User } from '../classes/user';
import { testUserLibrarianWithSettings } from '../../tests/user';
import { PERMISSIONS, PERMISSION_OPERATOR } from '../util/permissions';
import { AppStore } from './app.store';

describe('AppStore', () => {
  let store: InstanceType<typeof AppStore>;

  const userApiServiceSpy = {
    getLoggedUser: vi.fn()
  };

  const recordServiceSpy = {
    getRecord: vi.fn().mockReturnValue(EMPTY)
  };

  beforeEach(() => {
    userApiServiceSpy.getLoggedUser.mockReturnValue(of({ ...testUserLibrarianWithSettings }));

    store = TestBed.configureTestingModule({
      providers: [
        AppStore,
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: RecordService, useValue: recordServiceSpy },
      ]
    }).inject(AppStore);
  });

  describe('initial state', () => {
    it('user should be null', () => {
      expect(store.user()).toBeNull();
    });

    it('settings should be null', () => {
      expect(store.settings()).toBeNull();
    });

    it('permissions should be empty', () => {
      expect(store.permissions()).toEqual([]);
    });

    it('organisation should be null', () => {
      expect(store.organisation()).toBeNull();
    });

    it('currentLibraryPid should be null', () => {
      expect(store.currentLibraryPid()).toBeNull();
    });

    it('currentOrganisationPid should be null', () => {
      expect(store.currentOrganisationPid()).toBeNull();
    });

    it('currentBudgetPid should be null', () => {
      expect(store.currentBudgetPid()).toBeNull();
    });

    it('currentViewCode should be null', () => {
      expect(store.currentViewCode()).toBeNull();
    });

    it('isLogged should be false', () => {
      expect(store.isLogged()).toBe(false);
    });

    it('isAuthenticated should be false', () => {
      expect(store.isAuthenticated()).toBe(false);
    });
  });

  describe('load()', () => {
    it('should populate user after load', async () => {
      await firstValueFrom(store.load());
      expect(store.user()).toBeInstanceOf(User);
    });

    it('should populate settings after load', async () => {
      await firstValueFrom(store.load());
      expect(store.settings()).not.toBeNull();
      expect(store.settings()?.language).toBe('fr');
      expect(store.settings()?.baseUrl).toBe('https://bib.rero.ch');
    });

    it('should populate permissions after load', async () => {
      await firstValueFrom(store.load());
      expect(store.permissions().length).toBeGreaterThan(0);
    });

    it('isLogged should be true after load', async () => {
      await firstValueFrom(store.load());
      expect(store.isLogged()).toBe(true);
    });

    it('should set requestStatus to fulfilled on success', async () => {
      await firstValueFrom(store.load());
      expect(store.isFulfilled()).toBe(true);
    });

    it('should set error state on API failure', async () => {
      userApiServiceSpy.getLoggedUser.mockReturnValue(throwError(() => new Error('Network error')));
      await lastValueFrom(store.load(), { defaultValue: null });
      expect(store.user()).toBeNull();
      expect(store.error()).not.toBeNull();
    });
  });

  describe('setCurrentLibrary()', () => {
    it('should update currentLibraryPid', () => {
      store.setCurrentLibrary('lib1');
      expect(store.currentLibraryPid()).toBe('lib1');
    });

    it('should allow updating to a different pid', () => {
      store.setCurrentLibrary('lib1');
      store.setCurrentLibrary('lib2');
      expect(store.currentLibraryPid()).toBe('lib2');
    });
  });

  describe('setCurrentOrganisation()', () => {
    it('should update currentOrganisationPid', () => {
      store.setCurrentOrganisation('org1');
      expect(store.currentOrganisationPid()).toBe('org1');
    });
  });

  describe('setCurrentBudget()', () => {
    it('should update currentBudgetPid', () => {
      store.setCurrentBudget('budget1');
      expect(store.currentBudgetPid()).toBe('budget1');
    });
  });

  describe('setCurrentViewCode()', () => {
    it('should update currentViewCode', () => {
      store.setCurrentViewCode('global');
      expect(store.currentViewCode()).toBe('global');
    });
  });

  describe('canAccess()', () => {
    beforeEach(async () => {
      await firstValueFrom(store.load());
    });

    it('should return true when user has the permission (OR)', () => {
      expect(store.canAccess(PERMISSIONS.UI_ACCESS)).toBe(true);
    });

    it('should return false when user lacks the permission (OR)', () => {
      expect(store.canAccess('non-existent-permission')).toBe(false);
    });

    it('should return true when at least one permission matches (OR)', () => {
      expect(store.canAccess([PERMISSIONS.UI_ACCESS, 'non-existent'])).toBe(true);
    });

    it('should return false when no permissions match (OR)', () => {
      expect(store.canAccess(['perm-a', 'perm-b'])).toBe(false);
    });

    it('should return true when all permissions match (AND)', () => {
      expect(store.canAccess([PERMISSIONS.UI_ACCESS, PERMISSIONS.DEBUG_MODE], PERMISSION_OPERATOR.AND)).toBe(true);
    });

    it('should return false when one permission is missing (AND)', () => {
      expect(store.canAccess([PERMISSIONS.UI_ACCESS, 'non-existent'], PERMISSION_OPERATOR.AND)).toBe(false);
    });

    it('should throw on unknown operator', () => {
      expect(() => store.canAccess([PERMISSIONS.UI_ACCESS], 'xor')).toThrow();
    });
  });

  describe('canAccessDebugMode()', () => {
    it('should return false when permissions are empty', () => {
      expect(store.canAccessDebugMode()).toBe(false);
    });

    it('should return true when DEBUG_MODE permission is present', async () => {
      await firstValueFrom(store.load());
      expect(store.canAccessDebugMode()).toBe(true);
    });
  });

  describe('isLogVisible()', () => {
    it('should return false when settings are not loaded', () => {
      expect(store.isLogVisible('documents')).toBe(false);
    });

    it('should return true for a resource present in operationLogs settings', async () => {
      await firstValueFrom(store.load());
      expect(store.isLogVisible('documents')).toBe(true);
      expect(store.isLogVisible('items')).toBe(true);
    });

    it('should return false for a resource absent from operationLogs settings', async () => {
      await firstValueFrom(store.load());
      expect(store.isLogVisible('patrons')).toBe(false);
    });
  });

  describe('getResourceKeyByResourceName()', () => {
    it('should return the resource key for a known resource', async () => {
      await firstValueFrom(store.load());
      expect(store.getResourceKeyByResourceName('documents')).toBe('doc');
      expect(store.getResourceKeyByResourceName('items')).toBe('item');
    });

    it('should throw when the resource is not in operationLogs settings', async () => {
      await firstValueFrom(store.load());
      expect(() => store.getResourceKeyByResourceName('patrons'))
        .toThrow(new Error('Operation logs: Missing resource key'));
    });
  });
});
