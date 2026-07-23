// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { signalStore } from '@ngrx/signals';
import { BaseApi } from '@rero/shared';
import { of } from 'rxjs';
import { IllRequestApiService } from '../../api/ill-request-api.service';
import { withIllRequestsFeature } from './ill-requests-feature';

const IllRequestsFeatureStore = signalStore(
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

    store.loadIllRequests('patron-1', 1, 10).subscribe();
    store.loadIllRequests('patron-1', 2, 10).subscribe();

    expect(illRequestApiService.getPublicIllRequest).toHaveBeenNthCalledWith(
      1,
      'patron-1',
      1,
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
