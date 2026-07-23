// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { RecordService } from '@rero/ng-core';
import { of, Subject } from 'rxjs';
import { PatronApiService } from '../../api/patron-api.service';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { withFeesFeature } from './fees-feature';

const FeesFeatureStore = signalStore(
  withState({ patronPid: null as string | null }),
  withMethods(store => ({
    setPatronPid(patronPid: string | null): void {
      patchState(store, { patronPid });
    },
  })),
  withFeesFeature()
);

describe('FeesFeature', () => {
  let store: InstanceType<typeof FeesFeatureStore>;
  const patronTransactionApiService = { getFees: vi.fn() };
  const patronApiService = { getOverduePreviewByPatronPid: vi.fn() };

  beforeEach(() => {
    vi.resetAllMocks();
    store = TestBed.configureTestingModule({
      providers: [
        FeesFeatureStore,
        { provide: PatronTransactionApiService, useValue: patronTransactionApiService },
        { provide: PatronApiService, useValue: patronApiService },
      ],
    }).inject(FeesFeatureStore);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('clears previous fees while a new request is pending', () => {
    patronTransactionApiService.getFees.mockReturnValueOnce(of({
      hits: {
        hits: [{
          metadata: {
            type: 'manual',
            creation_date: '2026-06-01',
            total_amount: 5,
          },
        }],
      },
    }));
    patronApiService.getOverduePreviewByPatronPid.mockReturnValueOnce(of([]));
    store.setPatronPid('patron-1');
    TestBed.tick();
    expect(store.fees()).toHaveLength(1);
    expect(store.feesLoaded()).toBe(true);

    const feesResponse = new Subject<{ hits: { hits: unknown[] } }>();
    const overdueResponse = new Subject<unknown[]>();
    patronTransactionApiService.getFees.mockReturnValueOnce(feesResponse);
    patronApiService.getOverduePreviewByPatronPid.mockReturnValueOnce(overdueResponse);

    store.setPatronPid('patron-2');
    TestBed.tick();

    expect(store.fees()).toEqual([]);
    expect(store.feesLoaded()).toBe(false);

    feesResponse.next({ hits: { hits: [] } });
    feesResponse.complete();
    overdueResponse.next([]);
    overdueResponse.complete();
  });

  it('groups fee transactions with their overdue fee by loan', () => {
    patronTransactionApiService.getFees.mockReturnValue(of({
      hits: {
        hits: [{
          metadata: {
            type: 'manual',
            creation_date: '2026-06-01',
            total_amount: 4,
            note: 'First fee',
            loan: { pid: 'loan-1' },
          },
        }],
      },
    }));
    patronApiService.getOverduePreviewByPatronPid.mockReturnValue(of([{
      loan: { pid: 'loan-1' },
      fees: { steps: [], total: 2 },
    }]));

    store.setPatronPid('patron-1');
    TestBed.tick();

    expect(patronTransactionApiService.getFees).toHaveBeenCalledWith(
      'patron-1',
      'open',
      1,
      RecordService.MAX_REST_RESULTS_SIZE
    );
    expect(patronApiService.getOverduePreviewByPatronPid).toHaveBeenCalledWith('patron-1');
    expect(store.feesLoaded()).toBe(true);
    expect(store.fees()).toHaveLength(1);
    expect(store.fees()[0]).toMatchObject({
      type: 'manual',
      totalAmount: 6,
      overdue: 2,
      notes: ['First fee'],
      loan: { pid: 'loan-1' },
    });
  });
});
