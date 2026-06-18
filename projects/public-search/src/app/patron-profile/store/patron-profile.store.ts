// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
