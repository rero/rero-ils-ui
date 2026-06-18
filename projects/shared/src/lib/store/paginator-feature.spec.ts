// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { signalStore } from '@ngrx/signals';
import { withPaginator } from './paginator-feature';
import { Pager } from '../component/paginator/model/paginator-model';
import { PaginatorState } from 'primeng/paginator';

describe('PaginatorFeature', () => {
  const initialPager: Pager = {
    page: 1,
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 20, 50]
  };

  const PaginatorStore = signalStore(
    withPaginator(initialPager)
  );

  let store: InstanceType<typeof PaginatorStore>;

  beforeEach(() => {
    store = TestBed.configureTestingModule({
      providers: [PaginatorStore]
    }).inject(PaginatorStore);
  });

  it('should initialize with provided pager state', () => {
    expect(store.pager()).toEqual(initialPager);
  });

  it('should update page and first index when changePage is called', () => {
    const event: PaginatorState = {
      page: 1, // Moving to 2nd page (0-indexed)
      first: 10,
      rows: 10,
      pageCount: 5
    };

    store.changePage(event);

    expect(store.pager().page).toBe(2); // 1 + 1
    expect(store.pager().first).toBe(11); // 1 * 10 + 1
    expect(store.pager().rows).toBe(10);
  });

  it('should reset to first page if rows per page changes', () => {
    // First move to page 2
    store.changePage({
      page: 1,
      first: 10,
      rows: 10,
      pageCount: 5
    });

    expect(store.pager().page).toBe(2);

    // Now change rows to 20
    const event: PaginatorState = {
      page: 1, // Trying to stay on page 2 (index 1) but changing rows
      first: 10,
      rows: 20,
      pageCount: 3
    };

    store.changePage(event);

    // Should reset to page 1
    expect(store.pager().page).toBe(1); // 0 + 1
    expect(store.pager().first).toBe(1); // 0 * 20 + 1
    expect(store.pager().rows).toBe(20);
  });

  it('should use default rows from initial pager if event rows is missing', () => {
    const event: PaginatorState = {
      page: 2, // 3rd page
      first: 20,
      rows: undefined, // Missing rows
      pageCount: 5
    };

    store.changePage(event);

    expect(store.pager().page).toBe(3); // 2 + 1
    expect(store.pager().rows).toBe(initialPager.rows); // Should fallback to initialPager.rows (10)
    expect(store.pager().first).toBe(21); // 2 * 10 + 1
  });
});
