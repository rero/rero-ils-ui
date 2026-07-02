// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { Error } from "@rero/ng-core";
import type { EsResult } from "@rero/ng-core";
import { AppStore, testUserLibrarianWithSettings, User } from "@rero/shared";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, of, Subject } from "rxjs";
import { HoldingsApiService } from "../../../../../api/holdings-api.service";
import { DocumentDetailStore } from "../../store/document-detail.store";
import { HoldingsStore } from "./holdings-store";

describe('Holdings Store', () => {
  let deleteResult$: Subject<boolean>;
  let documentDetailStore: {
    setHoldingsTotal: ReturnType<typeof vi.fn>;
    deleteChildRecord: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    deleteResult$ = new Subject<boolean>();
    documentDetailStore = {
      setHoldingsTotal: vi.fn(),
      deleteChildRecord: vi.fn().mockReturnValue(deleteResult$),
    };
    TestBed.configureTestingModule({
      providers: [
        HoldingsStore,
        { provide: DocumentDetailStore, useValue: documentDetailStore },
        ConfirmationService,
        MessageService,
        UserServiceMock,
        HoldingsApiServiceMock,
        { provide: HoldingsApiService, useExisting: HoldingsApiServiceMock },
        { provide: AppStore, useExisting: UserServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      imports: [
        TranslateModule.forRoot(),
      ]
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return holdings and library filters', async () => {
    const store = TestBed.inject(HoldingsStore);
    store.setDocument(document);
    await vi.advanceTimersByTimeAsync(500);
    expect(store.holdings()).toHaveLength(12);
    expect(store.total()).toEqual(12);
    expect(store.isDocumentHarvested()).toBe(false);
    expect(store.holdingsCurrentOrganisation()).toHaveLength(9);
    expect(store.holdingsOtherOrganisation()).toHaveLength(3);
    expect(store.filter()).toHaveLength(2);
    expect(documentDetailStore.setHoldingsTotal).toHaveBeenCalledWith(12);
  });

  it('should return the filtered holdings', async () => {
    const store = TestBed.inject(HoldingsStore);
    store.setDocument(document);
    await vi.advanceTimersByTimeAsync(500);
    store.setLibraryFilter({ originalEvent: new Event(''), value: ["1"] });
    expect(store.holdingsCurrentOrganisation()).toHaveLength(9);
    expect(store.holdingsOtherOrganisation()).toHaveLength(0);
    store.setLibraryFilter({ originalEvent: new Event(''), value: ["2"] });
    expect(store.holdingsCurrentOrganisation()).toHaveLength(0);
    expect(store.holdingsOtherOrganisation()).toHaveLength(3);
    store.setLibraryFilter({ originalEvent: new Event(''), value: ["1", "2"] });
    expect(store.holdingsCurrentOrganisation()).toHaveLength(9);
    expect(store.holdingsOtherOrganisation()).toHaveLength(3);
    store.setLibraryFilter({ originalEvent: new Event(''), value: [] });
    expect(store.holdingsCurrentOrganisation()).toHaveLength(9);
    expect(store.holdingsOtherOrganisation()).toHaveLength(3);
  });

  it('should remove a holding record', async () => {
    const store = TestBed.inject(HoldingsStore);
    // Do not test the delete dialog
    store.setDocument(document);
    await vi.advanceTimersByTimeAsync(500);
    const record = store.holdings()[2];
    store.delete(record);
    expect(store.record()).toEqual(record);
    expect(documentDetailStore.deleteChildRecord).toHaveBeenCalledOnce();
    expect(documentDetailStore.deleteChildRecord).toHaveBeenCalledWith('holdings', record.metadata.pid);
  });

  it('should notify document detail when holding delete succeeds', async () => {
    const store = TestBed.inject(HoldingsStore);
    store.setDocument(document);
    await vi.advanceTimersByTimeAsync(500);
    const record = store.holdings()[2];
    store.delete(record);
    deleteResult$.next(true);
    deleteResult$.complete();
    expect(store.holdings()).toHaveLength(11);
    expect(store.total()).toEqual(11);
    expect(store.record()).toBeUndefined();
    expect(documentDetailStore.setHoldingsTotal).toHaveBeenCalledWith(11);
  });

  it('should remove a hidden standard holding and update document holdings total', async () => {
    const store = TestBed.inject(HoldingsStore);
    store.setDocument(document);
    await vi.advanceTimersByTimeAsync(500);
    expect(store.holdings()).toHaveLength(12);
    store.removeHiddenStandardHolding(store.holdings()[2].metadata.pid);
    expect(store.holdings()).toHaveLength(11);
    expect(store.total()).toEqual(11);
    expect(documentDetailStore.setHoldingsTotal).toHaveBeenCalledWith(11);
  });

  it('should not notify document detail when holding delete fails', async () => {
    const store = TestBed.inject(HoldingsStore);
    store.setDocument(document);
    await vi.advanceTimersByTimeAsync(500);
    const record = store.holdings()[2];
    store.delete(record);
    deleteResult$.next(false);
    deleteResult$.complete();
    expect(store.holdings()).toHaveLength(12);
    expect(store.record()).toEqual(record);
    expect(documentDetailStore.setHoldingsTotal).not.toHaveBeenCalledWith(11);
  });
});

const document = {
  "created": "2025-11-03T12:45:51.978055+00:00",
  "id": "262",
  "links": {
    "self": "https://localhost:5000/api/documents/262"
  },
  "metadata": {
    "$schema": "https://bib.rero.ch/schemas/documents/document-v0.0.1.json",
    "adminMetadata": {
      "encodingLevel": "Minimal level" },
    "contentMediaCarrier": [
      {
        "carrierType": "rdact:1049",
        "contentType": [
          "rdaco:1020"
        ],
        "mediaType": "rdamt:1007"
      }
    ],
    "contribution": [
      {
        "entity": {
          "authorized_access_point": "Schefer, Dorothy",
          "type": "bf:Person"
        },
        "role": [
          "ctb"
        ]
      },
      {
        "entity": {
          "authorized_access_point": "Chanine, Nathalie",
          "type": "bf:Person"
        },
        "role": [
          "ctb"
        ]
      }
    ],
    "dimensions": [
      "21 cm"
    ],
    "extent": "399 p.",
    "fiction_statement": "non_fiction",
    "genreForm": [
      {
        "entity": {
          "authorized_access_point": "Photographies",
          "source": "rero",
          "type": "bf:Topic"
        }
      },
      {
        "entity": {
          "authorized_access_point": "\u00c9tudes diverses",
          "source": "rero",
          "type": "bf:Topic"
        }
      }
    ],
    "identifiedBy": [
      {
        "type": "bf:Isbn",
        "value": "9782843231926"
      },
      {
        "source": "BNF",
        "type": "uri",
        "value": "http://catalogue.bnf.fr/ark:/12148/cb371086243"
      }
    ],
    "illustrativeContent": [
      "illustrations"
    ],
    "issuance": {
      "main_type": "rdami:1001",
      "subtype": "materialUnit"
    },
    "language": [
      {
        "type": "bf:Language",
        "value": "fre"
      }
    ],
    "note": [
      {
        "label": "ill.",
        "noteType": "otherPhysicalDetails"
      }
    ],
    "pid": "262",
    "provisionActivity": [
      {
        "_text": [
          {
            "language": "default",
            "value": "Paris : Assouline, 2000"
          }
        ],
        "place": [
          {
            "country": "fr"
          }
        ],
        "startDate": 2000,
        "statement": [
          {
            "label": [
              {
                "value": "Paris"
              }
            ],
            "type": "bf:Place"
          }
        ],
        "type": "bf:Publication"
      }
    ],
    "responsibilityStatement": [
      [
        {
          "value": "introd. par par Dorothy Schefer Faux"
        }
      ]
    ],
    "title": [
      {
        "_text": "Beaut\u00e9 du si\u00e8cle",
        "mainTitle": [
          {
            "value": "Beaut\u00e9 du si\u00e8cle"
          }
        ],
        "type": "bf:Title"
      }
    ],
    "type": [
      {
        "main_type": "docmaintype_book",
        "subtype": "docsubtype_other_book"
      }
    ],
    "ui_responsibilities": [
      "introd. par par Dorothy Schefer Faux",
      "Nathalie Chanine... [et al.]"
    ]
  },
  "updated": "2025-11-03T12:45:51.981000+00:00"
}

class HoldingsApiServiceMock {
  getHoldingsByDocumentPid(_documentPid: string): Observable<EsResult | Error> {
    const holdings = [];

    for (let i = 0; i < 12; i++) {
      const pid = i % 4 ? '1': '2';
      holdings.push({
          "created": "2025-11-03T12:46:15.669328+00:00",
          "id": `${i}`,
          "links": {
              "self": `https://localhost:5000/api/holdings/${i}`
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
                "name": `Bibliothèque communale et scolaire d'Avise (${pid})`,
                "pid": `${pid}`,
                "type": "lib"
              },
              "location": {
                  "name": "Espaces publics",
                  "pid": "11",
                  "type": "loc"
              },
              "organisation": {
                "pid": `${pid}`,
                "type": "org"
              },
              "pid": `${i}`,
              "public_items_count": 1
          },
          "updated": "2025-11-03T12:46:15.669330+00:00"
      });
    }

    return of({
      aggregations: {},
      hits: {
        hits: holdings,
        total: {
          relation: "eq",
          value: holdings.length
        }
      },
      links: {
        self: ''
      }
    });
  }
}

class UserServiceMock {
  private readonly _user = (() => {
    const user = new User(testUserLibrarianWithSettings);
    user.currentOrganisation = '1';
    return user;
  })();

  user() {
    return this._user;
  }

  currentOrganisationPid() {
    return '1';
  }
}
