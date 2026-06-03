/*
 * RERO ILS UI
 * Copyright (C) 2021-2026 RERO
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
import { computed } from '@angular/core';
import { patchState, signalMethod, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { IPatron, IUser } from '@rero/shared';

export type IMenu = { value: string; name: string; };

type PatronProfileState = {
  patrons: IPatron[];
  currentPatron: IPatron | null;
  menu: IMenu[];
  currentMenu: IMenu | null;
  activeTab: string | null;
  loanFeesTotal: number;
  cancelledRequestPid: string | null;
};

export const PatronProfileStore = signalStore(
  { providedIn: 'root' },
  withState<PatronProfileState>({
    patrons: [],
    currentPatron: null,
    menu: [],
    currentMenu: null,
    activeTab: null,
    loanFeesTotal: 0,
    cancelledRequestPid: null,
  }),
  withComputed(({ menu }) => ({
    isMultiOrganisation: computed(() => menu().length > 1),
  })),
  withMethods((store) => ({
    init(user: IUser): void {
      const patrons = user.patrons.filter(p => p.roles.includes('patron'));
      const menu = patrons.map(p => ({ value: p.pid, name: p.organisation.name }));
      patchState(store, { patrons, menu, currentPatron: patrons[0] ?? null, currentMenu: menu[0] ?? null });
    },
    changePatron: signalMethod<string>(patronPid => {
      const patron = store.patrons().find(p => p.pid === patronPid) ?? null;
      const menu = store.menu().find(m => m.value === patronPid) ?? null;
      patchState(store, { currentPatron: patron, currentMenu: menu });
    }),
    changeTab: signalMethod<string>(tab => patchState(store, { activeTab: tab })),
    cancelRequest: signalMethod<string>(pid => patchState(store, { cancelledRequestPid: pid })),
    addLoanFees(fees: number): void {
      patchState(store, { loanFeesTotal: store.loanFeesTotal() + fees });
    },
    resetLoanFees(): void {
      patchState(store, { loanFeesTotal: 0, cancelledRequestPid: null });
    },
  }))
);
