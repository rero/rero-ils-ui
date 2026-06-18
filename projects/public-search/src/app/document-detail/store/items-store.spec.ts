// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from "@angular/core/testing";
import { EsRecord, EsResult } from "@rero/shared";
import { Observable, of } from "rxjs";
import { ItemApiService } from "../../api/item-api.service";
import { ItemsStore } from "./items-store";

const element = 12;

describe('ItemsStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemsStore,
        ItemApiServiceMock,
        { provide: ItemApiService, useExisting: ItemApiServiceMock }
      ]
    });
  });

  it('should return the holdings Pid and view code', () => {
    const store = TestBed.inject(ItemsStore);
    store.setHoldingsAndViewCode(holdings, "global");
    expect(store.holdings()).toBe(holdings);
    expect(store.viewCode()).toBe("global");
  });

  it('should return the list of results', async () => {
    vi.useFakeTimers();
    const store = TestBed.inject(ItemsStore);
    store.setHoldingsAndViewCode(holdings, "global");
    store.load();

    // the value must be greater than the value passed to the debounceTime
    await vi.advanceTimersByTimeAsync(500);

    expect(store.items()).toHaveLength(element);
    expect(store.total()).toEqual(element);
    expect(store.filterTotal()).toEqual(element);

    store.setFilter('f-0');

    await vi.advanceTimersByTimeAsync(500);
    vi.useRealTimers();

    expect(store.items()).toHaveLength(1);
    expect(store.total()).toEqual(element);
    expect(store.filterTotal()).toEqual(1);
  });

  it('should reset the paginator after setting a filter.', async () => {
    vi.useFakeTimers();
    const store = TestBed.inject(ItemsStore);
    store.setPaginator({ page: 1, first: 11, rows: 10 });
    expect(store.pager.page()).toEqual(2);
    store.setFilter('f-0');

    await vi.advanceTimersByTimeAsync(500);
    vi.useRealTimers();

    expect(store.pager.page()).toEqual(1);
    expect(store.isFilterEnabled()).toBe(true);
  });

  it('should return the status of the paginator display.', async () => {
    vi.useFakeTimers();
    const store = TestBed.inject(ItemsStore);
    store.setPaginator({ page: 0, first: 1, rows: 10 });
    store.setHoldingsAndViewCode(holdings, "global");
    store.load();

    await vi.advanceTimersByTimeAsync(500);

    expect(store.isPaginatorEnabled()).toBe(true);
    store.setPaginator({ page: 0, first: 1, rows: 20 });
    vi.useRealTimers();

    expect(store.isPaginatorEnabled()).toBe(false);
  });
});

const holdings: EsRecord = {
  created: "2025-10-22T11:59:23.738167+00:00",
  id: "641",
  links: { self: "https://localhost:5000/api/holdings/641" },
  metadata: {
    $schema: "https://bib.rero.ch/schemas/holdings/holding-v0.0.1.json",
    pid: "641",
    library: { name: "Bibliothèque du Lycée de la Vallée d'Aoste", pid: "4", type: "lib" },
  },
  updated: "2025-10-23T05:30:43.803060+00:00"
};

class ItemApiServiceMock {
  getItemsByHoldingsAndViewcode(holdings: Partial<EsRecord>, viewcode: string, page: number, _itemsPerPage = 9999, filter = ''): Observable<EsResult> {
    const element = 12;
    const items = [];
    for (let i = 0; i < element; i++) {
      items.push({
        created: "2025-10-22T11:59:23.738167+00:00",
        id: `${i}`,
        links: { self: `https://localhost:5000/api/items/${i}` },
        metadata: {
          $schema: "https://bib.rero.ch/schemas/items/item-v0.0.1.json",
          barcode: `f-${i}`,
          pid: `${i}`,
          holding: { pid: "641", type: "hold" },
          status: "on_shelf"
        }
      });
    }

    const response: any = {
      aggregations: {},
      hits: {
        hits: [],
        total: { relation: 'eq', value: element }
      },
      links: { self: '' }
    };

    response.hits.hits = (!filter) ? items : items.filter((item: any) => item.metadata.barcode === filter);
    response.hits.total.value = response.hits.hits.length;

    return of(response);
  }
}
