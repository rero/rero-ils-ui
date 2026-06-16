// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { signalStore } from '@ngrx/signals';
import { of } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';
import { withRequestsFeature } from './request-feature';

const RequestsFeatureStore = signalStore(
  withRequestsFeature()
);

describe('RequestsFeature', () => {
  let store: InstanceType<typeof RequestsFeatureStore>;
  const loanApiService = {
    getRequest: vi.fn(),
    cancel: vi.fn(),
  };
  const request = {
    metadata: {
      pid: 'request-1',
      item: { location: { pid: 'location-1' } },
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
    store = TestBed.configureTestingModule({
      providers: [
        RequestsFeatureStore,
        { provide: LoanApiService, useValue: loanApiService },
      ],
    }).inject(RequestsFeatureStore);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('initializes request pager state', () => {
    expect(store.requestPager()).toEqual({
      page: 1,
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 50],
    });
  });

  it('changes request pager', () => {
    store.changeRequestPager({ page: 1, first: 10, rows: 10 });

    expect(store.requestPager().page).toBe(2);
    expect(store.requestPager().first).toBe(11);
  });

  it('resets request state', () => {
    loanApiService.getRequest.mockReturnValue(of({ hits: { hits: [request], total: { value: 1 } } }));
    store.loadRequests('patron-1', 1, 10).subscribe();
    store.changeRequestPager({
      page: 1,
      first: 10,
      rows: 10,
    });

    store.resetRequests();

    expect(store.requests()).toEqual([]);
    expect(store.requestsTotal()).toBe(0);
    expect(store.requestsLoaded()).toBe(false);
    expect(store.requestPager().page).toBe(1);
    expect(store.requestPager().first).toBe(1);
  });

  it('loads the selected request page', () => {
    const secondRequest = { metadata: { pid: 'request-2' } };
    loanApiService.getRequest
      .mockReturnValueOnce(of({ hits: { hits: [request], total: { value: 2 } } }))
      .mockReturnValueOnce(of({ hits: { hits: [secondRequest], total: { value: 2 } } }));

    store.loadRequests('patron-1', 1, 10).subscribe();
    store.loadRequests('patron-1', 2, 10).subscribe();

    expect(loanApiService.getRequest).toHaveBeenNthCalledWith(1, 'patron-1', 1, 10);
    expect(loanApiService.getRequest).toHaveBeenNthCalledWith(2, 'patron-1', 2, 10);
    expect(store.requests()).toEqual([secondRequest]);
    expect(store.requestsTotal()).toBe(2);
    expect(store.requestsLoaded()).toBe(true);
  });

  it('cancels a request through the API and removes it from state', () => {
    loanApiService.getRequest.mockReturnValue(of({ hits: { hits: [request], total: { value: 1 } } }));
    loanApiService.cancel.mockReturnValue(of({ pid: 'request-1' }));
    store.loadRequests('patron-1', 1, 10).subscribe();

    store.cancelPatronRequest(request, 'patron-1').subscribe();

    expect(loanApiService.cancel).toHaveBeenCalledWith({
      pid: 'request-1',
      transaction_location_pid: 'location-1',
      transaction_user_pid: 'patron-1',
    });
    expect(store.cancelledRequestPid()).toBe('request-1');
    expect(store.requests()).toEqual([]);
    expect(store.requestsTotal()).toBe(0);
  });
});
