/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
 * Copyright (C) 2019-2025 UCLouvain
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
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { RecordData, RecordService } from '@rero/ng-core';
import { EMPTY, Observable, pipe } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { UserApiService } from '../api/user-api.service';
import { Organisation } from '../classes/core';
import { User } from '../classes/user';
import { PERMISSION_OPERATOR, PERMISSIONS } from '../util/permissions';
import { RecordPermission, RecordPermissions } from '../classes/permissions';
import { setError, setFulfilled, setPending, withRequestStatus } from './request-status-feature';

export type ISettings = {
  baseUrl: string;
  agentSources: string[];
  agentAgentTypes: any;
  agentLabelOrder: any;
  globalView: string;
  language: string;
  operationLogs: any;
  documentAdvancedSearch: boolean;
  userProfile: {
    readOnly: boolean;
    readOnlyFields: string[];
  };
};

export type AppState = {
  user: User | null;
  settings: ISettings | null;
  permissions: string[];
  organisation: Organisation | null;
  currentLibraryPid: string | null;
  currentOrganisationPid: string | null;
  currentBudgetPid: string | null;
  currentViewCode: string | null;
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<AppState>({
    user: null,
    settings: null,
    permissions: [],
    organisation: null,
    currentLibraryPid: null,
    currentOrganisationPid: null,
    currentBudgetPid: null,
    currentViewCode: null,
  }),
  withRequestStatus(),
  withComputed((store) => ({
    isLogged: () => store.user() !== null,
    isAuthenticated: () => store.user()?.isAuthenticated ?? false,
  })),
  withMethods((store, userApiService = inject(UserApiService), recordService = inject(RecordService)) => ({
    load(): Observable<User> {
      patchState(store, setPending());
      return userApiService.getLoggedUser().pipe(
        tap((loggedUser: any) => {
          const settings: ISettings = loggedUser.settings;
          const permissions: string[] = loggedUser.permissions ?? [];
          delete loggedUser['settings'];
          const user = new User(loggedUser);
          patchState(store, { user, settings, permissions }, setFulfilled());
        }),
        map(() => store.user()!),
        catchError((error: unknown) => {
          patchState(store, setError(String(error)));
          return EMPTY;
        })
      );
    },

    setCurrentLibrary(pid: string): void {
      patchState(store, { currentLibraryPid: pid });
    },

    setCurrentOrganisation(pid: string): void {
      patchState(store, { currentOrganisationPid: pid });
    },

    setCurrentBudget(pid: string): void {
      patchState(store, { currentBudgetPid: pid });
    },

    setCurrentViewCode(viewCode: string): void {
      patchState(store, { currentViewCode: viewCode });
    },

    loadOrganisation: rxMethod<string>(
      pipe(
        filter(Boolean),
        switchMap((pid) =>
          recordService.getRecord<RecordData<Organisation>>('organisations', pid).pipe(
            map((orgRecord) => orgRecord.metadata),
            tap((organisation) => patchState(store, { organisation })),
            catchError(() => EMPTY)
          )
        )
      )
    ),

    canAccess(permission: string | string[], operator: string = PERMISSION_OPERATOR.OR): boolean {
      const perms = new Set(store.permissions());
      const permArray = typeof permission === 'string' ? [permission] : permission;
      switch (operator) {
        case PERMISSION_OPERATOR.OR:
          return permArray.some((p) => perms.has(p));
        case PERMISSION_OPERATOR.AND:
          return permArray.every((p) => perms.has(p));
        default:
          throw new Error('Permission operator: The values for the operator is "and" or "or".');
      }
    },

    canAccessDebugMode(): boolean {
      return store.permissions().includes(PERMISSIONS.DEBUG_MODE);
    },

    validateLibraryPermissions(permissions: RecordPermissions, ownerLibraryPid: string): RecordPermissions {
      if (store.currentLibraryPid() !== ownerLibraryPid) {
        const disabledPermission: RecordPermission = {
          can: false,
          reasons: { others: { record_not_in_current_library: '' } }
        };
        permissions.create = disabledPermission;
        permissions.delete = disabledPermission;
        permissions.update = disabledPermission;
      }
      return permissions;
    },
  })),
  withHooks((store) => ({
    onInit: () => {
      store.loadOrganisation(
        toObservable(store.currentOrganisationPid).pipe(filter((pid): pid is string => pid !== null))
      );
    },
  }))
);
