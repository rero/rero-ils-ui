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
import { Observable, of } from "rxjs";
import { HoldingsApiService } from "../../api/holdings-api.service";
import { HoldingsStore } from "./holdings-store";

describe('HoldingsStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HoldingsStore,
        HoldingsApiServiceMock,
        { provide: HoldingsApiService, useExisting: HoldingsApiServiceMock }
      ]
    });
  });

  it('should return the document and view code', (store = TestBed.inject(HoldingsStore)) => {
    store.setDocumentPidAndViewCode("251","global");
    expect(store.documentPid()).toBe("251");
    expect(store.viewCode()).toBe("global");
  });

  it('should return the list of results', fakeAsync((store = TestBed.inject(HoldingsStore)) => {
    store.setDocumentPidAndViewCode("251","global");
    store.load();

    // the value must be greater than the value passed to the debounceTime
    tick(600);

    expect(store.holdings()).toHaveSize(3);
    expect(store.total()).toEqual(3);
    expect(store.filteredHoldings()).toEqual(store.holdings());
    // Library uniqueness check
    expect(store.filter()).toHaveSize(2);
  }));

  it('should return the library holdings', fakeAsync((store = TestBed.inject(HoldingsStore)) => {
    store.setDocumentPidAndViewCode("251","global");
    store.load();
    tick(600);

    store.setLibraryFilter({ originalEvent: new Event('library'), value: ["5"], });
    expect(store.filteredLibrary()).toHaveSize(1);
    expect(store.filteredHoldings()).toHaveSize(1);
    expect(store.filteredHoldings()[0].id).toEqual("643");

    store.setLibraryFilter({ originalEvent: new Event('library'), value: ["4"], });
    expect(store.filteredHoldings()).toHaveSize(2);

    store.setLibraryFilter({ originalEvent: new Event('library'), value: ["4", "5"], });
    expect(store.filteredHoldings()).toHaveSize(3);
  }));

});

class HoldingsApiServiceMock {
  getHoldingsByDocumentPidAndViewcode(): Observable<EsResult> {
    return of({
      aggregations: {},
      hits: {
        hits: [
          {
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
          },
          {
            created: "2025-10-22T11:59:23.738167+00:00",
            id: "642",
            links: {
              self: "https://localhost:5000/api/holdings/642"
            },
            metadata: {
              $schema: "https://bib.rero.ch/schemas/holdings/holding-v0.0.1.json",
              pid: "642",
              library: {
                name: "Bibliothèque du Lycée de la Vallée d'Aoste",
                pid: "4",
                type: "lib"
              },
            },
            updated: "2025-10-23T05:30:43.803060+00:00"
          },
          {
            created: "2025-10-22T11:59:23.738167+00:00",
            id: "643",
            links: {
              self: "https://localhost:5000/api/holdings/643"
            },
            metadata: {
              $schema: "https://bib.rero.ch/schemas/holdings/holding-v0.0.1.json",
              pid: "643",
              library: {
                name: "Hogwarts Library",
                pid: "5",
                type: "lib"
              },
            },
            updated: "2025-10-23T05:30:43.803060+00:00"
          }
        ],
        total: { relation: 'eq', value: 3 }
      },
      links: {
        self: ''
      }
    })
  }
}
