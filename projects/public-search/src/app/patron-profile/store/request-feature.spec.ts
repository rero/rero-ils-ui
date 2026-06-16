// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';
import { withRequestsFeature } from './request-feature';

const RequestsFeatureStore = signalStore(
  withState({ activeTab: null as string | null }),
  withProps(() => ({ patronPid: signal<string | null>(null) })),
  withMethods(store => ({
    setPatronPid(patronPid: string | null): void {
      store.patronPid.set(patronPid);
    },
    setActiveTab(activeTab: string | null): void {
      patchState(store, { activeTab });
    },
  })),
  withRequestsFeature()
);

describe('RequestsFeature', () => {
  let store: InstanceType<typeof RequestsFeatureStore>;
  const loanApiService = {
    getRequest: vi.fn(),
    cancel: vi.fn(),
  };
  const translateService = {
    instant: vi.fn((value: string) => value),
  };
  const messageService = {
    add: vi.fn(),
  };
  const request = {
    metadata: {
      pid: 'request-1',
      item: { location: { pid: 'location-1' } },
    },
  };
  const activateRequests = () => {
    store.setPatronPid('patron-1');
    store.setActiveTab('request');
    TestBed.tick();
  };

  beforeEach(() => {
    vi.resetAllMocks();
    store = TestBed.configureTestingModule({
      providers: [
        RequestsFeatureStore,
        { provide: LoanApiService, useValue: loanApiService },
        { provide: TranslateService, useValue: translateService },
        { provide: MessageService, useValue: messageService },
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
    activateRequests();
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

    activateRequests();
    store.changeRequestPager({ page: 1, first: 10, rows: 10 });
    TestBed.tick();

    expect(loanApiService.getRequest).toHaveBeenNthCalledWith(1, 'patron-1', 1, 10);
    expect(loanApiService.getRequest).toHaveBeenNthCalledWith(2, 'patron-1', 2, 10);
    expect(store.requests()).toEqual([secondRequest]);
    expect(store.requestsTotal()).toBe(2);
    expect(store.requestsLoaded()).toBe(true);
  });

  it('cancels a request through the API and removes it from state', () => {
    loanApiService.getRequest.mockReturnValue(of({ hits: { hits: [request], total: { value: 1 } } }));
    loanApiService.cancel.mockReturnValue(of({ pid: 'request-1' }));
    activateRequests();

    store.cancelPatronRequest('request-1');

    expect(loanApiService.cancel).toHaveBeenCalledWith({
      pid: 'request-1',
      transaction_location_pid: 'location-1',
      transaction_user_pid: 'patron-1',
    });
    expect(store.cancelledRequestPid()).toBe('request-1');
    expect(store.requests()).toEqual([]);
    expect(store.requestsTotal()).toBe(0);
    expect(store.cancellingRequestPid()).toBeNull();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'The request has been cancelled.',
      life: CONFIG.MESSAGE_LIFE,
    });
  });

  it('handles an error while cancelling a request', () => {
    loanApiService.getRequest.mockReturnValue(of({ hits: { hits: [request], total: { value: 1 } } }));
    loanApiService.cancel.mockReturnValue(throwError(() => new Error('Cancellation failed')));
    activateRequests();

    store.cancelPatronRequest('request-1');

    expect(store.requests()).toEqual([request]);
    expect(store.requestsTotal()).toBe(1);
    expect(store.cancellingRequestPid()).toBeNull();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Error during the cancellation of the request.',
      closable: true,
    });
  });
});
