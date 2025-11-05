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
import { computed, inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { Record, RecordUiService } from "@rero/ng-core";
import { EsRecord, nonNullable, setFulfilled, setPending, UserService, withRequestStatus } from "@rero/shared";
import { MultiSelectChangeEvent } from "primeng/multiselect";
import { pipe, switchMap, tap } from "rxjs";
import { HoldingsApiService } from "../../../../../api/holdings-api.service";

type HoldingsState = {
  document: EsRecord | undefined;
  isDocumentHarvested: boolean;
  record: EsRecord | undefined;
  holdings: EsRecord[];
  holdingsCurrentOrganisation: EsRecord[];
  holdingsOtherOrganisation: EsRecord[];
  total: number;
  filter: Library[];
  filteredLibrary: number[];
}

type Library = {
  name: string;
  pid: string;
  type: string;
};

export const initialHoldingsState: HoldingsState = {
  document: undefined,
  isDocumentHarvested: false,
  record: undefined,
  holdings: [],
  holdingsCurrentOrganisation: [],
  holdingsOtherOrganisation: [],
  total: 0,
  filter: [],
  filteredLibrary: []
};

export const HoldingsStore = signalStore(
  withState<HoldingsState>(initialHoldingsState),
  withRequestStatus(),
  withProps(() => ({
    userService: inject(UserService),
    holdingsApiService: inject(HoldingsApiService),
    recordUiService: inject(RecordUiService),
  })),
  withComputed((store) => ({
    isDocumentHarvested: computed(() => ('harvested' in store.document().metadata)),
    holdingsCurrentOrganisation: computed(
      () => store.holdings().filter(h => (store.filteredLibrary().length === 0)
          ? h.metadata.organisation.pid === store.userService.user.currentOrganisation
          : h.metadata.organisation.pid === store.userService.user.currentOrganisation && store.filteredLibrary().includes(h.metadata.library.pid)
      )
    ),
    holdingsOtherOrganisation: computed(
      () => store.holdings().filter(h => (store.filteredLibrary().length === 0)
          ? h.metadata.organisation.pid !== store.userService.user.currentOrganisation
          : h.metadata.organisation.pid !== store.userService.user.currentOrganisation && store.filteredLibrary().includes(h.metadata.library.pid)
      )
    ),
    filter: computed(() => {
      // Extract all libraries and add organisation pid
      const libraries = store.holdings().map(h => {
        const { library } = h.metadata;
        library.organisationPid = h.metadata.organisation.pid;
        return library;
      });

      // Unique libraries for current organisation and sort.
      const currentOrganisationLibraries = [
        ...new Map(libraries.filter(l => l.organisationPid === store.userService.user.currentOrganisation)
        .map(lib => [JSON.stringify(lib), lib])).values()
      ].sort((a, b) => a.name.localeCompare(b.name));
      // Unique libraries for other organisation(s) and sort.
      const otherOrganisationLibraries = [
        ...new Map(libraries.filter(l => l.organisationPid !== store.userService.user.currentOrganisation)
        .map(lib => [JSON.stringify(lib), lib])).values()
      ].sort((a, b) => a.name.localeCompare(b.name));

      return [...currentOrganisationLibraries, ...otherOrganisationLibraries];
    })
  })),
  withMethods((store) => ({
    setDocument(document: EsRecord) {
      patchState(store, { document });
    },
    setLibraryFilter(filter: MultiSelectChangeEvent) {
      patchState(store, { filteredLibrary: filter.value });
    },
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() => store.holdingsApiService.getHoldingsByDocumentPid(store.document().metadata.pid)),
        tap((result: Record) => patchState(store, { holdings: result.hits.hits, total: result.hits.total.value }, setFulfilled()))
      )
    ),
    delete: rxMethod<EsRecord>(
      pipe(
        tap((record: EsRecord) => patchState(store, { record })),
        switchMap(() => store.recordUiService.deleteRecord('holdings', store.record().metadata.pid)),
        tap((success: boolean) => {
          if (success) {
            patchState(store, { holdings: store.holdings().filter((h: EsRecord) => h.metadata.pid !== store.record().metadata.pid), record: null });
          }
        })
      )
    ),
  })),
  withHooks((store) => ({
    onInit: () => {
      toObservable(store.document).pipe(nonNullable()).subscribe(() => store.load());
    }
  }))
);
