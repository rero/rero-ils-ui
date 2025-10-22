/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { EsResult } from "@rero/shared";
import { EsRecord } from "projects/shared/src/public-api";
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

  it('should return the holdings Pid and view code', (store = TestBed.inject(ItemsStore)) => {
    store.setHoldingsAndViewCode(holdings,"global");
    expect(store.holdings()).toBe(holdings);
    expect(store.viewCode()).toBe("global");
  });

  it('should return the list of results', fakeAsync((store = TestBed.inject(ItemsStore)) => {
    store.setHoldingsAndViewCode(holdings, "global");
    store.load();

    // the value must be greater than the value passed to the debounceTime
    tick(500);

    expect(store.items()).toHaveSize(element);
    expect(store.total()).toEqual(element);
    expect(store.filterTotal()).toEqual(element);

    store.setFilter('f-0');

    tick(500);
    expect(store.items()).toHaveSize(1);
    expect(store.total()).toEqual(element);
    expect(store.filterTotal()).toEqual(1);
  }));

   it('should reset the paginator after setting a filter.', fakeAsync((store = TestBed.inject(ItemsStore)) => {
    store.setPaginator({page: 1, first: 11, rows: 10});
    expect(store.paginator.page()).toEqual(2);
    store.setFilter('f-0');

    tick(500);
    expect(store.paginator.page()).toEqual(1);
    console.log(store.isFilterEnabled());
    expect(store.isFilterEnabled()).toBeTrue();
   }));

   it('should return the status of the paginator display.', fakeAsync((store = TestBed.inject(ItemsStore)) => {
    store.setPaginator({page: 0, first: 1, rows: 10});
    store.setHoldingsAndViewCode(holdings, "global");
    store.load();

    tick(500);
    expect(store.isPaginatorEnabled()).toBeTrue();
    store.setPaginator({page: 0, first: 1, rows: 20});
    expect(store.isPaginatorEnabled()).toBeFalse();
   }));
});

const holdings: EsRecord = {
  created: "2025-10-22T11:59:23.738167+00:00",
  id: "641",
  links: {
    self: "https://localhost:5000/api/holdings/641"
  },
  metadata: {
    $schema: "https://bib.rero.ch/schemas/holdings/holding-v0.0.1.json",
    pid: "641",
    library: {
        name: "Bibliothèque du Lycée de la Vallée d'Aoste",
        pid: "4",
        type: "lib"
    },
  },
  updated: "2025-10-23T05:30:43.803060+00:00"
};

class ItemApiServiceMock {
  getItemsByHoldingsAndViewcode(holdings: Partial<EsRecord>, viewcode: string, page: number, itemsPerPage = 9999, filter = ''): Observable<EsResult> {
    const element = 12;
    const items = [];
    for (let i = 0; i < element; i++) {
      items.push({
        created: "2025-10-22T11:59:23.738167+00:00",
        id: `${i}`,
        links: {
            self: `https://localhost:5000/api/items/${i}`
        },
        metadata: {
            $schema: "https://bib.rero.ch/schemas/items/item-v0.0.1.json",
            barcode: `f-${i}`,
            pid: `${i}`,
            holding: {
              pid: "641",
              type: "hold"
            },
            status: "on_shelf"
        }
      });
    }

    const response = {
      aggregations: {},
      hits: {
        hits: [],
        total: { relation: 'eq', value: element }
      },
      links: {
        self: ''
      }
    };

    response.hits.hits = (!filter) ? items : items.filter((item: EsRecord) => item.metadata.barcode === filter);
    response.hits.total.value = response.hits.hits.length;

    return of(response);
  }
}
