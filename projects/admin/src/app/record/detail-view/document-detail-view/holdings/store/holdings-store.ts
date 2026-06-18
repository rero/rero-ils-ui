// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed, inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { RecordUiService } from "@rero/ng-core";
import { AppStore, EsRecord, nonNullable, setFulfilled, setPending, withRequestStatus } from "@rero/shared";
import { MultiSelectChangeEvent } from "primeng/multiselect";
import { pipe, switchMap, tap } from "rxjs";
import { HoldingsApiService } from "../../../../../api/holdings-api.service";

type HoldingsState = {
  document: EsRecord | undefined;
  record: EsRecord | undefined;
  holdings: EsRecord[];
  total: number;
  filteredLibrary: number[];
}

export const initialHoldingsState: HoldingsState = {
  document: undefined,
  record: undefined,
  holdings: [],
  total: 0,
  filteredLibrary: []
};

export const HoldingsStore = signalStore(
  withState<HoldingsState>(initialHoldingsState),
  withRequestStatus(),
  withProps(() => ({
    appStore: inject(AppStore),
    holdingsApiService: inject(HoldingsApiService),
    recordUiService: inject(RecordUiService),
  })),
  withComputed((store) => ({
    isDocumentHarvested: computed(() => ('harvested' in store.document().metadata)),
    holdingsCurrentOrganisation: computed(
      () => store.holdings().filter(h => (store.filteredLibrary().length === 0)
          ? h.metadata.organisation.pid === store.appStore.currentOrganisationPid()
          : h.metadata.organisation.pid === store.appStore.currentOrganisationPid() && store.filteredLibrary().includes(h.metadata.library.pid)
      )
    ),
    holdingsOtherOrganisation: computed(
      () => store.holdings().filter(h => (store.filteredLibrary().length === 0)
          ? h.metadata.organisation.pid !== store.appStore.currentOrganisationPid()
          : h.metadata.organisation.pid !== store.appStore.currentOrganisationPid() && store.filteredLibrary().includes(h.metadata.library.pid)
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
        ...new Map(libraries.filter(l => l.organisationPid === store.appStore.currentOrganisationPid())
        .map(lib => [JSON.stringify(lib), lib])).values()
      ].sort((a, b) => a.name.localeCompare(b.name));
      // Unique libraries for other organisation(s) and sort.
      const otherOrganisationLibraries = [
        ...new Map(libraries.filter(l => l.organisationPid !== store.appStore.currentOrganisationPid())
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
        tap((result: any) => patchState(store, { holdings: result.hits.hits, total: result.hits.total.value }, setFulfilled()))
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
