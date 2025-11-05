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
import { EsRecord, EsResult } from "@rero/shared";
import { Observable, of } from "rxjs";
import { ItemsStore } from "./items-store";
import { ItemApiService } from "../../../../../api/item-api.service";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ConfirmationService, MessageService } from "primeng/api";

describe('Items Store', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemsStore,
        ConfirmationService,
        MessageService,
        ItemApiServiceMock,
        { provide: ItemApiService, useExisting: ItemApiServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      imports: [
        TranslateModule.forRoot()
      ]
    });
  });

  it('should return items', fakeAsync((store = TestBed.inject(ItemsStore)) => {
    store.setHoldings(holdings);
    tick(500);
    expect(store.holdings()).toEqual(holdings);
    expect(store.items()).toHaveSize(10);
    expect(store.total()).toEqual(12);
    expect(store.filterTotal()).toEqual(12);
  }));

  it('should return items of page 2', fakeAsync((store = TestBed.inject(ItemsStore)) => {
    store.setHoldings(holdings);
    tick(500);
    store.setPaginator({ page: 1, first: 11, rows: 10 });
    tick(500);
    expect(store.items()).toHaveSize(2);
    expect(store.total()).toEqual(12);
    expect(store.filterTotal()).toEqual(12);
  }));

  it('should return a item if a filter is active', fakeAsync((store = TestBed.inject(ItemsStore)) => {
    store.setHoldings(holdings);
    tick(500);
    store.setFilter('100000001');
    tick(500);
    expect(store.items()).toHaveSize(1);
    expect(store.filterTotal()).toEqual(1);
  }));

  it('should remove a item record', fakeAsync((store = TestBed.inject(ItemsStore)) => {
    // Do not test the delete dialog
    store.setHoldings(holdings);
    tick(500);
    const record = store.items()[2];
    store.delete(record);
    expect(store.record()).toEqual(record);
  }));
});

const holdings = {
  "created": "2025-11-03T12:46:15.669328+00:00",
  "id": "199",
  "links": {
    "self": "https://localhost:5000/api/holdings/199"
  },
  "metadata": {
      "$schema": "https://bib.rero.ch/schemas/holdings/holding-v0.0.1.json",
      "circulation_category": {
      "$schema": "https://bib.rero.ch/schemas/item_types/item_type-v0.0.1.json",
      "description": "Standard checkout for adults only (16+)",
      "name": "Standard adult",
      "negative_availability": false,
      "organisation": {
          "$ref": "https://bib.rero.ch/api/organisations/1"
      },
      "pid": "5",
      "type": "standard"
      },
      "document": {
          "pid": "262",
          "type": "doc"
      },
      "holdings_type": "standard",
      "items_count": 1,
      "library": {
        "name": "Bibliothèque communale et scolaire d'Avise",
        "pid": "1",
        "type": "lib"
      },
      "location": {
          "name": "Espaces publics",
          "pid": "11",
          "type": "loc"
      },
      "organisation": {
        "pid": "1",
        "type": "org"
      },
      "pid": "199",
      "public_items_count": 1
  },
  "updated": "2025-11-03T12:46:15.669330+00:00"
};

class ItemApiServiceMock {
  getItemsByHoldings(holdings: Partial<EsRecord>, page: number, itemsPerPage = 10, filter = ''): Observable<EsResult> {
    const items = [];
    for (let i = 0; i < 12; i++) {
      items.push({
        "created": "2025-11-03T12:46:25.825446+00:00",
        "id": `${i}`,
        "links": {
          "self": `https://localhost:5000/api/items/${i}`
        },
        "metadata": {
          "$schema": "https://bib.rero.ch/schemas/items/item-v0.0.1.json",
          "acquisition_date": "2020-08-13",
          "barcode": `10000000${i}`,
          "call_number": `00${i}`,
          "current_pending_requests": 0,
          "document": {
            "document_type": [
              {
                "main_type": "docmaintype_book",
                "subtype": "docsubtype_other_book"
              }
            ],
            "pid": "262",
            "type": "doc"
          },
          "holding": {
            "pid": "199",
            "type": "hold"
          },
          "item_type": {
            "pid": "5",
            "type": "itty"
          },
          "library": {
            "name": "Bibliothèque communale et scolaire d'Avise",
            "pid": "3",
            "type": "lib"
          },
          "location": {
            "name": "Espaces publics",
            "pid": "11",
            "type": "loc"
          },
          "organisation": {
            "pid": "1",
            "type": "org",
            "viewcode": "aoste"
          },
          "pid": `${i}`,
          "price": 18,
          "status": "on_loan",
          "type": "standard",
          "ui_title_text": "Beauté du siècle"
        },
        "updated": "2025-11-03T12:59:22.014051+00:00"
      })
    };

    let itemsHits = [];
    let count = 0;
    if ((!filter)) {
      itemsHits = items.slice((page - 1) * itemsPerPage, ((page - 1) * itemsPerPage) + itemsPerPage);
      count = items.length;
    } else {
      itemsHits = items.filter((item: EsRecord) => item.metadata.barcode === filter);
      count = itemsHits.length;
    }

    const response = {
      aggregations: {},
      hits: {
        hits: itemsHits,
        total: { relation: 'eq', value: count }
      },
      links: {
        self: ''
      }
    };

    return of(response);
  }
}
