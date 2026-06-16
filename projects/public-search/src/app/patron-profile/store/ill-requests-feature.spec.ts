// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { BaseApi } from '@rero/shared';
import { of } from 'rxjs';
import { IllRequestApiService } from '../../api/ill-request-api.service';
import { withIllRequestsFeature } from './ill-requests-feature';

const IllRequestsFeatureStore = signalStore(
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
  withIllRequestsFeature()
);

describe('IllRequestsFeature', () => {
  let store: InstanceType<typeof IllRequestsFeatureStore>;
  const illRequestApiService = { getPublicIllRequest: vi.fn() };

  beforeEach(() => {
    vi.resetAllMocks();
    store = TestBed.configureTestingModule({
      providers: [
        IllRequestsFeatureStore,
        { provide: IllRequestApiService, useValue: illRequestApiService },
      ],
    }).inject(IllRequestsFeatureStore);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('initializes ILL request pager state', () => {
    expect(store.illRequestsPager()).toEqual({
      page: 1,
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 50],
    });
  });

  it('changes ILL request pager', () => {
    store.changeIllRequestsPager({ page: 1, first: 10, rows: 10 });

    expect(store.illRequestsPager().page).toBe(2);
    expect(store.illRequestsPager().first).toBe(11);
  });

  it('resets ILL request state', () => {
    store.changeIllRequestsPager({
      page: 1,
      first: 10,
      rows: 10,
    });

    store.resetIllRequests();

    expect(store.illRequests()).toEqual([]);
    expect(store.illRequestsTotal()).toBe(0);
    expect(store.illRequestsLoaded()).toBe(false);
    expect(store.illRequestsPager().page).toBe(1);
    expect(store.illRequestsPager().first).toBe(1);
  });

  it('loads the selected public ILL request page', () => {
    const request = { metadata: { pid: 'ill-1' } };
    const secondRequest = { metadata: { pid: 'ill-2' } };
    illRequestApiService.getPublicIllRequest
      .mockReturnValueOnce(of({ hits: { hits: [request], total: { value: 2 } } }))
      .mockReturnValueOnce(of({ hits: { hits: [secondRequest], total: { value: 2 } } }));

    store.setPatronPid('patron-1');
    store.setActiveTab('illRequest');
    TestBed.tick();
    store.changeIllRequestsPager({ page: 1, first: 10, rows: 10 });
    TestBed.tick();

    expect(illRequestApiService.getPublicIllRequest).toHaveBeenNthCalledWith(
      1,
      'patron-1',
      1,
      10,
      BaseApi.reroJsonheaders,
      '-created',
      { remove_archived: '1' }
    );
    expect(illRequestApiService.getPublicIllRequest).toHaveBeenNthCalledWith(
      2,
      'patron-1',
      2,
      10,
      BaseApi.reroJsonheaders,
      '-created',
      { remove_archived: '1' }
    );
    expect(store.illRequests()).toEqual([secondRequest]);
    expect(store.illRequestsTotal()).toBe(2);
    expect(store.illRequestsLoaded()).toBe(true);
  });
});
