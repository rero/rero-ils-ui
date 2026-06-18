// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EsResult, extractIdOnRef, RecordService } from '@rero/ng-core';
import { DateTime } from 'luxon';
import { EMPTY, forkJoin, pipe } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ExceptionDates, Library } from '../../../classes/library';
import { NotificationType } from '../../../classes/notification';

type SchemaProperty = {
  enum?: string[];
  properties?: Record<string, SchemaProperty>;
};

type SchemaForm = {
  schema: {
    properties: Record<string, SchemaProperty>;
  };
};


export type LocationRecord = {
  metadata: {
    pid: string;
    name: string;
    [key: string]: unknown;
  };
};

export type LibraryState = {
  library: Library | undefined;
  locations: LocationRecord[];
  exceptionDates: ExceptionDates[];
  availableCommunicationLanguages: string[];
  countryIsoCodes: string[];
  rolloverAccountTransferOptions: string[];
  notificationTypes: NotificationType[];
  isLoading: boolean;
  error: string | undefined;
  currentLibraryETag: string | undefined;
};

const initialState: LibraryState = {
  library: undefined,
  locations: [],
  exceptionDates: [],
  availableCommunicationLanguages: [],
  countryIsoCodes: [],
  rolloverAccountTransferOptions: [],
  notificationTypes: [],
  isLoading: false,
  error: undefined,
  currentLibraryETag: undefined,
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
    organisationPid: computed(() => store.library()?.organisation?.$ref ? extractIdOnRef(store.library()!.organisation.$ref) : ''),
  })),
  withMethods((store, recordService = inject(RecordService)) => ({

    loadLibrary: rxMethod<string>(
      pipe(
        filter(Boolean),
        tap(() => patchState(store, { isLoading: true, error: undefined })),
        switchMap(pid =>
          recordService.getRecordWithEtag('libraries', pid).pipe(
            tap(({body, headers}) => {
              const lib = new Library(body!.metadata);
              patchState(store, {
                library: lib,
                exceptionDates: lib.exception_dates ?? [],
                isLoading: false,
                currentLibraryETag: headers.get('ETag') ?? undefined,
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
        tap(() => patchState(store, { isLoading: true })),
        switchMap(pid =>
          recordService.getRecords('locations', {
            query: `library.pid:${pid}`,
            page: 1,
            itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE,
            sort: 'name',
          }).pipe(
            map((res: EsResult) => (res.hits.hits as unknown as LocationRecord[]) || []),
            tap(locations => patchState(store, { locations, isLoading: false })),
            catchError(() => { patchState(store, { isLoading: false }); return EMPTY; })
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
              const libProps = (libSchema as SchemaForm).schema.properties;
              const notifTypes = ((notifSchema as SchemaForm).schema.properties['notification_type'].enum as NotificationType[])
                .filter(t => t !== NotificationType.ACQUISITION_ORDER)
                .filter(t => t !== NotificationType.CLAIM_ISSUE);
              patchState(store, {
                availableCommunicationLanguages: libProps.communication_language.enum ?? [],
                countryIsoCodes: libProps.acquisition_settings?.properties?.shipping_informations
                  ?.properties?.address?.properties?.country?.enum ?? [],
                rolloverAccountTransferOptions: libProps.rollover_settings?.properties?.account_transfer?.enum ?? [],
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
        exceptionDates: [],
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
      if (store.locations().some(loc => loc.metadata.pid === pid)) {
        patchState(store, {
          locations: store.locations().filter(loc => loc.metadata.pid !== pid),
        });
      }
    },
  })),
  withHooks((store) => ({
    onInit: () => {
      store.loadSchemas();
    },
  }))
);
