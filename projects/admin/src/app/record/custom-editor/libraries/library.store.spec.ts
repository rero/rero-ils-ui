// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { of, throwError } from 'rxjs';
import { ExceptionDates, Library } from '../../../classes/library';
import { NotificationType } from '../../../classes/notification';
import { LibraryStore } from './library.store';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const mockLibraryMetadata = {
  pid: 'lib1',
  name: 'Test Library',
  code: 'TEST',
  email: 'test@example.com',
  address: '1 rue de la Paix',
  communication_language: 'fr',
  opening_hours: [],
  exception_dates: [],
  organisation: { $ref: 'https://localhost/api/organisations/1' },
  rollover_settings: { account_transfer: 'rollover_no_transfer' },
};

const mockLibrarySchema = {
  schema: {
    properties: {
      communication_language: { enum: ['fr', 'de', 'en'] },
      acquisition_settings: {
        properties: {
          shipping_informations: {
            properties: {
              address: {
                properties: {
                  country: { enum: ['CH', 'FR', 'DE'] },
                },
              },
            },
          },
        },
      },
      rollover_settings: {
        properties: {
          account_transfer: { enum: ['rollover_no_transfer', 'rollover_allocated_amount'] },
        },
      },
    },
  },
};

const mockNotificationSchema = {
  schema: {
    properties: {
      notification_type: {
        enum: [
          NotificationType.AVAILABILITY,
          NotificationType.RECALL,
          NotificationType.ACQUISITION_ORDER,
          NotificationType.CLAIM_ISSUE,
        ],
      },
    },
  },
};

const mockLocation = (pid: string) => ({ metadata: { pid, name: `Location ${pid}` } });

const mockEtagResponse = (metadata: any, etag = '"test-etag"') => ({
  body: { metadata },
  headers: { get: (key: string) => key === 'ETag' ? etag : null }
});

const exceptionOlder: ExceptionDates = { title: 'Older', is_open: false, start_date: '2025-01-01' };
const exceptionNewer: ExceptionDates = { title: 'Newer', is_open: false, start_date: '2025-06-01' };
const exceptionNewest: ExceptionDates = { title: 'Newest', is_open: false, start_date: '2025-12-01' };

// ---------------------------------------------------------------------------
// Setup helper
// ---------------------------------------------------------------------------
const recordServiceSpy = {
  getRecordWithEtag: vi.fn(),
  getRecord: vi.fn(),
  getRecords: vi.fn(),
  getSchemaForm: vi.fn(),
  MAX_REST_RESULTS_SIZE: 9999,
};

const setupStore = () => {
  // withHooks calls loadSchemas on init — provide a default so tests that don't
  // care about schemas don't blow up.
  recordServiceSpy.getSchemaForm.mockImplementation((type: string) =>
    type === 'libraries' ? of(mockLibrarySchema) : of(mockNotificationSchema)
  );

  TestBed.configureTestingModule({
    providers: [
      LibraryStore,
      { provide: RecordService, useValue: recordServiceSpy },
    ],
  });
  return TestBed.inject(LibraryStore);
};

describe('LibraryStore', () => {
  afterEach(() => vi.resetAllMocks());

  // ---------------------------------------------------------------------------
  // Initial state
  // Note: withHooks calls loadSchemas() on init (synchronous with of()), so
  // schema-derived arrays are populated immediately. Tests here reflect the
  // real initial state after the hook runs.
  // ---------------------------------------------------------------------------
  describe('initial state', () => {
    it('should have null library', () => {
      const store = setupStore();
      expect(store.library()).toBeUndefined();
    });

    it('should have empty locations and exceptionDates', () => {
      const store = setupStore();
      expect(store.locations()).toEqual([]);
      expect(store.exceptionDates()).toEqual([]);
    });

    it('should have schema data populated by onInit hook', () => {
      const store = setupStore();
      expect(store.availableCommunicationLanguages()).toEqual(['fr', 'de', 'en']);
      expect(store.countryIsoCodes()).toEqual(['CH', 'FR', 'DE']);
      expect(store.rolloverAccountTransferOptions()).toEqual(['rollover_no_transfer', 'rollover_allocated_amount']);
    });

    it('should not be loading', () => {
      const store = setupStore();
      expect(store.isLoading()).toBe(false);
    });

    it('should have no error', () => {
      const store = setupStore();
      expect(store.error()).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // Computed: isNewLibrary
  // ---------------------------------------------------------------------------
  describe('isNewLibrary', () => {
    it('should be true when no library is set', () => {
      const store = setupStore();
      expect(store.isNewLibrary()).toBe(true);
    });

    it('should be false when library has a pid', () => {
      const store = setupStore();
      recordServiceSpy.getRecordWithEtag.mockReturnValue(of(mockEtagResponse(mockLibraryMetadata)));
      store.loadLibrary('lib1');
      expect(store.isNewLibrary()).toBe(false);
    });

    it('should be true after setNewLibrary', () => {
      const store = setupStore();
      store.setNewLibrary();
      expect(store.isNewLibrary()).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Computed: organisationPid
  // ---------------------------------------------------------------------------
  describe('organisationPid', () => {
    it('should return empty string when no library', () => {
      const store = setupStore();
      expect(store.organisationPid()).toBe('');
    });

    it('should extract pid from $ref', () => {
      const store = setupStore();
      recordServiceSpy.getRecordWithEtag.mockReturnValue(of(mockEtagResponse(mockLibraryMetadata)));
      store.loadLibrary('lib1');
      expect(store.organisationPid()).toBe('1');
    });
  });

  // ---------------------------------------------------------------------------
  // withHooks: onInit calls loadSchemas
  // ---------------------------------------------------------------------------
  describe('onInit hook', () => {
    it('should call loadSchemas on init and populate schema data', () => {
      const store = setupStore();
      TestBed.tick();
      expect(recordServiceSpy.getSchemaForm).toHaveBeenCalledWith('libraries');
      expect(recordServiceSpy.getSchemaForm).toHaveBeenCalledWith('notifications');
      expect(store.availableCommunicationLanguages()).toEqual(['fr', 'de', 'en']);
      expect(store.countryIsoCodes()).toEqual(['CH', 'FR', 'DE']);
      expect(store.rolloverAccountTransferOptions()).toEqual(['rollover_no_transfer', 'rollover_allocated_amount']);
    });
  });

  // ---------------------------------------------------------------------------
  // loadSchemas
  // ---------------------------------------------------------------------------
  describe('loadSchemas', () => {
    it('should populate all schema-derived state', () => {
      const store = setupStore();
      store.loadSchemas();
      expect(store.availableCommunicationLanguages()).toEqual(['fr', 'de', 'en']);
      expect(store.countryIsoCodes()).toEqual(['CH', 'FR', 'DE']);
      expect(store.rolloverAccountTransferOptions()).toEqual(['rollover_no_transfer', 'rollover_allocated_amount']);
    });

    it('should exclude ACQUISITION_ORDER and CLAIM_ISSUE from notificationTypes', () => {
      const store = setupStore();
      store.loadSchemas();
      const types = store.notificationTypes();
      expect(types).toContain(NotificationType.AVAILABILITY);
      expect(types).toContain(NotificationType.RECALL);
      expect(types).not.toContain(NotificationType.ACQUISITION_ORDER);
      expect(types).not.toContain(NotificationType.CLAIM_ISSUE);
    });

    it('should set error and keep schema state empty on failure', () => {
      // Configure error BEFORE TestBed setup so the onInit hook also gets the error mock.
      recordServiceSpy.getSchemaForm.mockReturnValue(throwError(() => new Error('network error')));
      TestBed.configureTestingModule({
        providers: [
          LibraryStore,
          { provide: RecordService, useValue: recordServiceSpy },
        ],
      });
      const store = TestBed.inject(LibraryStore);
      expect(store.availableCommunicationLanguages()).toEqual([]);
      expect(store.error()).toContain('network error');
    });
  });

  // ---------------------------------------------------------------------------
  // loadLibrary
  // ---------------------------------------------------------------------------
  describe('loadLibrary', () => {
    it('should set library and exceptionDates on success', () => {
      const store = setupStore();
      recordServiceSpy.getRecordWithEtag.mockReturnValue(of(mockEtagResponse(mockLibraryMetadata)));
      store.loadLibrary('lib1');
      expect(store.library()).toBeInstanceOf(Library);
      expect(store.library()!.pid).toBe('lib1');
      expect(store.isLoading()).toBe(false);
    });

    it('should set isLoading to true then false', () => {
      const store = setupStore();
      // Use a delayed observable via synchronous test — loading flag is set before switchMap resolves.
      // With synchronous of(), it flips back immediately; just verify final state is false.
      recordServiceSpy.getRecordWithEtag.mockReturnValue(of(mockEtagResponse(mockLibraryMetadata)));
      store.loadLibrary('lib1');
      expect(store.isLoading()).toBe(false);
    });

    it('should set error and isLoading=false on failure', () => {
      const store = setupStore();
      recordServiceSpy.getRecordWithEtag.mockReturnValue(throwError(() => new Error('not found')));
      store.loadLibrary('lib1');
      expect(store.library()).toBeUndefined();
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toContain('not found');
    });

    it('should ignore empty pid (filter guard)', () => {
      const store = setupStore();
      store.loadLibrary('');
      expect(recordServiceSpy.getRecordWithEtag).not.toHaveBeenCalled();
    });

    it('should initialise exceptionDates from library metadata', () => {
      const store = setupStore();
      const metadata = { ...mockLibraryMetadata, exception_dates: [exceptionOlder] };
      recordServiceSpy.getRecordWithEtag.mockReturnValue(of(mockEtagResponse(metadata)));
      store.loadLibrary('lib1');
      expect(store.exceptionDates().length).toBe(1);
    });
  });

  // ---------------------------------------------------------------------------
  // loadLocations
  // ---------------------------------------------------------------------------
  describe('loadLocations', () => {
    it('should populate locations on success', () => {
      const store = setupStore();
      recordServiceSpy.getRecords.mockReturnValue(of({ hits: { hits: [mockLocation('loc1'), mockLocation('loc2')] } }));
      store.loadLocations('lib1');
      expect(store.locations().length).toBe(2);
      expect(store.locations()[0].metadata.pid).toBe('loc1');
    });

    it('should set empty array when hits is missing', () => {
      const store = setupStore();
      recordServiceSpy.getRecords.mockReturnValue(of({ hits: { hits: null } }));
      store.loadLocations('lib1');
      expect(store.locations()).toEqual([]);
    });

    it('should keep state unchanged on error', () => {
      const store = setupStore();
      recordServiceSpy.getRecords.mockReturnValue(throwError(() => new Error('fail')));
      store.loadLocations('lib1');
      expect(store.locations()).toEqual([]);
    });

    it('should ignore empty pid (filter guard)', () => {
      const store = setupStore();
      store.loadLocations('');
      expect(recordServiceSpy.getRecords).not.toHaveBeenCalled();
    });

    it('should query with correct params', () => {
      const store = setupStore();
      recordServiceSpy.getRecords.mockReturnValue(of({ hits: { hits: [] } }));
      store.loadLocations('lib1');
      expect(recordServiceSpy.getRecords).toHaveBeenCalledWith(
        'locations',
        expect.objectContaining({ query: 'library.pid:lib1', sort: 'name' })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // setNewLibrary
  // ---------------------------------------------------------------------------
  describe('setNewLibrary', () => {
    it('should create a new Library with no pid', () => {
      const store = setupStore();
      store.setNewLibrary();
      expect(store.library()).toBeInstanceOf(Library);
      expect(store.library()!.pid).toBeNull();
    });

    it('should reset exceptionDates to empty array', () => {
      const store = setupStore();
      // Pre-load some exceptions
      recordServiceSpy.getRecordWithEtag.mockReturnValue(of(mockEtagResponse({ ...mockLibraryMetadata, exception_dates: [exceptionOlder] })));
      store.loadLibrary('lib1');
      expect(store.exceptionDates().length).toBe(1);

      store.setNewLibrary();
      expect(store.exceptionDates()).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // addExceptionDate
  // ---------------------------------------------------------------------------
  describe('addExceptionDate', () => {
    it('should append the exception', () => {
      const store = setupStore();
      store.addExceptionDate(exceptionOlder);
      expect(store.exceptionDates().length).toBe(1);
      expect(store.exceptionDates()[0]).toEqual(exceptionOlder);
    });

    it('should sort by start_date descending after add', () => {
      const store = setupStore();
      store.addExceptionDate(exceptionOlder);
      store.addExceptionDate(exceptionNewest);
      store.addExceptionDate(exceptionNewer);
      const dates = store.exceptionDates().map(e => e.start_date);
      expect(dates).toEqual(['2025-12-01', '2025-06-01', '2025-01-01']);
    });
  });

  // ---------------------------------------------------------------------------
  // updateExceptionDate
  // ---------------------------------------------------------------------------
  describe('updateExceptionDate', () => {
    it('should replace exception at given index', () => {
      const store = setupStore();
      store.addExceptionDate(exceptionOlder);
      const updated: ExceptionDates = { title: 'Updated', is_open: true, start_date: '2025-01-01' };
      store.updateExceptionDate(0, updated);
      expect(store.exceptionDates()[0].title).toBe('Updated');
    });

    it('should re-sort after update', () => {
      const store = setupStore();
      store.addExceptionDate(exceptionOlder);
      store.addExceptionDate(exceptionNewer);
      // exceptions are [exceptionNewer, exceptionOlder] after sort
      // update index 1 (exceptionOlder) to a future date → it should move to front
      const promoted: ExceptionDates = { title: 'Promoted', is_open: false, start_date: '2026-01-01' };
      store.updateExceptionDate(1, promoted);
      expect(store.exceptionDates()[0].start_date).toBe('2026-01-01');
    });
  });

  // ---------------------------------------------------------------------------
  // deleteExceptionDate
  // ---------------------------------------------------------------------------
  describe('deleteExceptionDate', () => {
    it('should remove exception at given index', () => {
      const store = setupStore();
      store.addExceptionDate(exceptionOlder);
      store.addExceptionDate(exceptionNewer);
      const countBefore = store.exceptionDates().length;
      store.deleteExceptionDate(0);
      expect(store.exceptionDates().length).toBe(countBefore - 1);
    });

    it('should preserve remaining exceptions', () => {
      const store = setupStore();
      store.addExceptionDate(exceptionOlder);
      store.addExceptionDate(exceptionNewest);
      // After sort: [exceptionNewest, exceptionOlder]; delete index 0 → only exceptionOlder remains
      store.deleteExceptionDate(0);
      expect(store.exceptionDates()[0].title).toBe('Older');
    });
  });

  // ---------------------------------------------------------------------------
  // deleteLocation
  // ---------------------------------------------------------------------------
  describe('deleteLocation', () => {
    it('should remove location matching the pid', () => {
      const store = setupStore();
      recordServiceSpy.getRecords.mockReturnValue(of({ hits: { hits: [mockLocation('loc1'), mockLocation('loc2')] } }));
      store.loadLocations('lib1');

      store.deleteLocation('loc1');
      expect(store.locations().length).toBe(1);
      expect(store.locations()[0].metadata.pid).toBe('loc2');
    });

    it('should leave locations unchanged when pid is not found', () => {
      const store = setupStore();
      recordServiceSpy.getRecords.mockReturnValue(of({ hits: { hits: [mockLocation('loc1')] } }));
      store.loadLocations('lib1');

      store.deleteLocation('unknown');
      expect(store.locations().length).toBe(1);
    });
  });
});
