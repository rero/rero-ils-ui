// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed } from '@angular/core';
import { patchState, signalMethod, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { IPatron, User } from '@rero/shared';
import { withLoansFeature } from './loans-feature';
import { withRequestsFeature } from './request-feature';
import { withFeesFeature } from './fees-feature';
import { withIllRequestsFeature } from './ill-requests-feature';

export type IMenu = { value: string; name: string; };

type PatronProfileState = {
  patrons: IPatron[];
  currentPatron: IPatron | null;
  patronPid: string | null;
  menu: IMenu[];
  activeTab: string | null;
};

export const PatronProfileStore = signalStore(
  { providedIn: 'root' },
  withState<PatronProfileState>({
    patrons: [],
    currentPatron: null,
    patronPid: null,
    menu: [],
    activeTab: null,
  }),
  withComputed(({ menu }) => ({
    isMultiOrganisation: computed(() => menu().length > 1),
  })),
  withLoansFeature(),
  withRequestsFeature(),
  withFeesFeature(),
  withIllRequestsFeature(),
  withMethods((store) => ({
    init(user: User): void {
      const patrons = user.patrons.filter(p => p.roles.includes('patron'));
      const menu = patrons.map(p => ({ value: p.pid, name: p.organisation.name }));
      patchState(store, {
        patrons,
        menu,
        currentPatron: patrons[0] ?? null,
        patronPid: patrons[0]?.pid ?? null,
      });
    },
    changePatron: signalMethod<string>(patronPid => {
      const patron = store.patrons().find(p => p.pid === patronPid) ?? null;
      patchState(store, {
        currentPatron: patron,
        patronPid: patron?.pid ?? null,
      });
    }),
    changeTab: signalMethod<string>(tab => patchState(store, { activeTab: tab })),
  }))
);
