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
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EsRecord, EsResult } from '@rero/shared';
import { withViewCode } from 'projects/shared/src/lib/store/viewcode-feature';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { HoldingsApiService } from '../../api/holdings-api.service';
import { MultiSelectChangeEvent } from 'primeng/multiselect';

type HoldingsState = {
  holdings: EsRecord[],
  filteredHoldings: EsRecord[];
  total: number;
  documentPid: string;
  filter: Library[];
  filteredLibrary: number[];
};

type Library = {
  name: string;
  pid: string;
  type: string;
};

const initialState: HoldingsState = {
  holdings: [],
  filteredHoldings: [],
  total: 0,
  documentPid: "0",
  filter: [],
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
