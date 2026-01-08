/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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

import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { IPatron, UserService } from '@rero/shared';
import { IMenu } from '../types';

type PatronProfileMenuState = {
  menu: IMenu[];
  patrons: IPatron[];
  currentPatron: IPatron | null;
};

const initialState: PatronProfileMenuState = {
  menu: [],
  patrons: [],
  currentPatron: null,
};

export const PatronProfileMenuStore = signalStore(
  { providedIn: 'root' },
  withState<PatronProfileMenuState>(initialState),
  withComputed((state) => ({
    /** Is multiple organisation */
    isMultiOrganisation: computed(() => state.patrons().length > 1),
  })),
  withMethods((store, userService = inject(UserService)) => ({
    /** Initialize the store with user data */
    init(): void {
      const { user } = userService;
      if (user && user.isAuthenticated) {
        const patrons = user.patrons.filter((patron) => patron.roles.includes('patron'));
        const menu = patrons.map((patron: IPatron) => ({
          value: patron.pid,
          name: patron.organisation.name,
        }));

        patchState(store, {
          patrons,
          currentPatron: patrons[0] || null,
          menu,
        });
      }
    },
    /** Change current patron */
    changePatron(patronPid: string): void {
      const patron = store.patrons().find((p: IPatron) => p.pid === patronPid);
      const menuItem = store.menu().find((m: IMenu) => m.value === patronPid);

      if (patron && menuItem) {
        patchState(store, {
          currentPatron: patron,
        });
      }
    },
  })),
  withHooks((store) => ({
    /** Initialize the store with user data */
    onInit(): void {
      store.init();
    },
  }))
);
