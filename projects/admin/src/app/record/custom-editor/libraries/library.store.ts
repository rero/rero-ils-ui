/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { RecordService } from '@rero/ng-core';
import { DateTime } from 'luxon';
import { EMPTY, forkJoin, pipe } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ExceptionDates, Library } from '../../../classes/library';
import { NotificationType } from '../../../classes/notification';

export type LibraryState = {
  library: Library | null;
  locations: any[];
  exceptionDates: ExceptionDates[];
  availableCommunicationLanguages: string[];
  countryIsoCodes: string[];
  rolloverAccountTransferOptions: string[];
  notificationTypes: NotificationType[];
  isLoading: boolean;
  error: string | null;
};

const initialState: LibraryState = {
  library: null,
  locations: [],
  exceptionDates: [],
  availableCommunicationLanguages: [],
  countryIsoCodes: [],
  rolloverAccountTransferOptions: [],
  notificationTypes: [],
  isLoading: false,
  error: null,
};

function sortExceptionDates(dates: ExceptionDates[]): ExceptionDates[] {
  return [...dates].sort((a, b) =>
    (DateTime.fromISO(b.start_date as string).toMillis()) -
    (DateTime.fromISO(a.start_date as string).toMillis())
  );
}

export const LibraryStore = signalStore(
  withState<LibraryState>(initialState),
  withComputed((store) => ({
    isNewLibrary: computed(() => !store.library()?.pid),
    organisationPid: computed(() => (store.library() as any)?.organisation?.$ref?.split('/').pop() ?? ''),
  })),
  withMethods((store, recordService = inject(RecordService)) => ({

    loadLibrary: rxMethod<string>(
      pipe(
        filter(Boolean),
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(pid =>
          recordService.getRecord('libraries', pid).pipe(
            tap(record => {
              const lib = new Library(record.metadata as any);
              patchState(store, {
                library: lib,
                exceptionDates: lib.exception_dates ?? [],
                isLoading: false,
              });
            }),
            catchError(err => {
              patchState(store, { error: String(err), isLoading: false });
              return EMPTY;
            })
          )
        )
      )
    ),

    loadLocations: rxMethod<string>(
      pipe(
        filter(Boolean),
        switchMap(pid =>
          recordService.getRecords('locations', {
            query: `library.pid:${pid}`,
            page: 1,
            itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE,
            sort: 'name',
          }).pipe(
            map((res: any) => res.hits.hits || []),
            tap(locations => patchState(store, { locations })),
            catchError(() => EMPTY)
          )
        )
      )
    ),

    loadSchemas: rxMethod<void>(
      pipe(
        switchMap(() =>
          forkJoin([
            recordService.getSchemaForm('libraries'),
            recordService.getSchemaForm('notifications'),
          ]).pipe(
            tap(([libSchema, notifSchema]) => {
              const libProps = (libSchema as any).schema.properties;
              const notifTypes = ((notifSchema as any).schema.properties.notification_type.enum as NotificationType[])
                .filter(t => t !== NotificationType.ACQUISITION_ORDER)
                .filter(t => t !== NotificationType.CLAIM_ISSUE);
              patchState(store, {
                availableCommunicationLanguages: libProps.communication_language.enum,
                countryIsoCodes: libProps.acquisition_settings.properties.shipping_informations
                  .properties.address.properties.country.enum,
                rolloverAccountTransferOptions: libProps.rollover_settings.properties.account_transfer.enum,
                notificationTypes: notifTypes,
              });
            }),
            catchError(err => {
              patchState(store, { error: String(err) });
              return EMPTY;
            })
          )
        )
      )
    ),

    setNewLibrary(): void {
      const lib = new Library({});
      patchState(store, {
        library: lib,
        exceptionDates: lib.exception_dates ?? [],
      });
    },

    addExceptionDate(exception: ExceptionDates): void {
      patchState(store, { exceptionDates: sortExceptionDates([...store.exceptionDates(), exception]) });
    },

    updateExceptionDate(index: number, exception: ExceptionDates): void {
      const updated = [...store.exceptionDates()];
      updated[index] = exception;
      patchState(store, { exceptionDates: sortExceptionDates(updated) });
    },

    deleteExceptionDate(index: number): void {
      const updated = [...store.exceptionDates()];
      updated.splice(index, 1);
      patchState(store, { exceptionDates: updated });
    },

    deleteLocation(pid: string): void {
      patchState(store, {
        locations: store.locations().filter((loc: any) => loc.metadata.pid !== pid),
      });
    },
  })),
  withHooks((store) => ({
    onInit: () => {
      store.loadSchemas();
    },
  }))
);
