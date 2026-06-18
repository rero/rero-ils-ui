// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EsRecord, EsResult } from '@rero/shared';
import { withViewCode } from '@rero/shared';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { HoldingsApiService } from '../../api/holdings-api.service';
import { MultiSelectChangeEvent } from 'primeng/multiselect';

type HoldingsState = {
  holdings: EsRecord[],
  total: number;
  documentPid: string;
  filteredLibrary: number[];
};


const initialState: HoldingsState = {
  holdings: [],
  total: 0,
  documentPid: "0",
  filteredLibrary: []
};

export const HoldingsStore = signalStore(
  withState<HoldingsState>(initialState),
  withViewCode(),
    withComputed(({ holdings, filteredLibrary }) => ({
    filteredHoldings: computed(() => {
      if (filteredLibrary().length == 0) {
        return holdings();
      }
      return holdings().filter(h => filteredLibrary().includes(h.metadata.library.pid));
    }),
    filter: computed(() =>
      [...new Map(holdings().map(h => h.metadata.library).map(lib => [JSON.stringify(lib), lib])).values()]
      .sort((a, b) => a.name.localeCompare(b.name))
    )
  })),
  withMethods((store, holdingsApiService = inject(HoldingsApiService)) => ({
    setDocumentPidAndViewCode(documentPid: string, viewCode: string) {
      patchState(store, { documentPid, viewCode });
    },
    setLibraryFilter(filter: MultiSelectChangeEvent) {
      patchState(store, { filteredLibrary: filter.value })
    },
    load: rxMethod<void>(
      pipe(
        debounceTime(500),
        switchMap(() => holdingsApiService.getHoldingsByDocumentPidAndViewcode(
          store.documentPid(),
          store.viewCode()
        )),
        tap((result: EsResult) => patchState(store, {
          holdings: result.hits.hits,
          total: result.hits.total.value
        }))
      )
    )
  }))
);
