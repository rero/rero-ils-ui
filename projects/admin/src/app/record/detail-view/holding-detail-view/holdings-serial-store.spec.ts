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

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { HoldingsApiService } from "@app/admin/api/holdings-api.service";
import { HoldingsService, PredictionIssue } from "@app/admin/service/holdings.service";
import { TranslateModule } from "@ngx-translate/core";
import { EsResult, PermissionsService, UserService } from "@rero/shared";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, of } from "rxjs";
import { HoldingsSerialStore } from "./holdings-serial-store";

describe('Holdings Serial Store', () => {
  let permissionService: PermissionsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HoldingsSerialStore,
        holdingsServiceMock,
        holdingsApiServiceMock,
        { provide: HoldingsService, useExisting: holdingsServiceMock },
        { provide: HoldingsApiService, useExisting: holdingsApiServiceMock },
        { provide: UserService, useValue: userServiceSpy },
        MessageService,
        ConfirmationService,
        PermissionsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      imports: [
        TranslateModule.forRoot()
      ]
    });
    permissionService = TestBed.inject(PermissionsService);
  });

  it('should return items and prediction', fakeAsync((store = TestBed.inject(HoldingsSerialStore)) => {
    store.setHoldings(holdings);
    tick(500);
    expect(store.holdings()).toEqual(holdings);
    tick(500);
    expect(store.receivedItems()).toHaveSize(3);
    expect(store.issues()).toHaveSize(3);
  }));

  it('should return more prediction', fakeAsync((store = TestBed.inject(HoldingsSerialStore)) => {
    store.setHoldings(holdings);
    tick(500);
    expect(store.issues()).toHaveSize(3);
    store.moreIssues(6);
    tick(500);
    expect(store.issues()).toHaveSize(6);
  }));

  it('should return a list of issues with the first one marked as new', fakeAsync((store = TestBed.inject(HoldingsSerialStore)) => {
    store.setHoldings(holdings);
    tick(500);
    store.quickIssueReceive();
    tick(500);
    expect(store.receivedItems()[0].new_issue).toBeTrue();
  }));

  it('should return only one result with a filter', fakeAsync((store = TestBed.inject(HoldingsSerialStore)) => {
    store.setHoldings(holdings);
    tick(500);
    store.setFilter('2022');
    tick(500);
    expect(store.receivedItems()).toHaveSize(1);
    expect(store.isFilterEnabled()).toBeTrue();
  }));

  it('should return if an issue can be added', fakeAsync((store = TestBed.inject(HoldingsSerialStore)) => {
    spyOn(permissionService, 'canAccess').and.returnValue(true);
    store.setHoldings(holdings);
    tick(500);
    expect(store.isAllowIssueCreation()).toBeTrue();
    expect(store.isDisplayLocalFieldsTab()).toBeTrue();

    const newHoldings = {...holdings};
    newHoldings.metadata.library.pid = '2';
    store.setHoldings(newHoldings);
    tick(500);
    expect(store.isAllowIssueCreation()).toBeFalse();
    expect(store.isDisplayLocalFieldsTab()).toBeFalse();
  }));

  it('should return false, because the paginator is not active', fakeAsync((store = TestBed.inject(HoldingsSerialStore)) => {
    store.setHoldings(holdings);
    tick(500);
    expect(store.isPaginatorEnabled()).toBeFalse();
  }));

  it('should remove a item record', fakeAsync((store = TestBed.inject(HoldingsSerialStore)) => {
      // Do not test the delete dialog
      store.setHoldings(holdings);
      tick(500);
      store.deleteItem(store.receivedItems()[1]);
      expect(store.receivedItems()).not.toBeNull();
    }));
});

const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = {
    patronLibrarian: {
      pid: '1'
    },
    currentLibrary: '1'
  }

const holdings = {
    "created": "2025-11-18T13:37:49.970060+00:00",
    "id": "641",
    "links": {
        "self": "https://localhost:5000/api/holdings/641"
    },
    "metadata": {
        "$schema": "https://bib.rero.ch/schemas/holdings/holding-v0.0.1.json",
        "acquisition_expected_end_date": "2025-12-31",
        "acquisition_method": "purchase",
        "acquisition_status": "currently_received",
        "call_number": "SM af-82",
        "circulation_category": {
            "pid": "3",
            "type": "itty"
        },
        "completeness": "complete",
        "composite_copy_report": "separate",
        "document": {
            "pid": "251",
            "type": "doc"
        },
        "enumerationAndChronology": "No 61(2020)-",
        "general_retention_policy": "permanently_retained",
        "holdings_type": "serial",
        "issue_binding": "10",
        "library": {
            "pid": "1",
            "type": "lib"
        },
        "location": {
            "pid": "3",
            "type": "loc"
        },
        "missing_issues": "Hors s\u00e9rie 18 (2020)",
        "notes": [
            {
                "content": "3 derniers fascicules en salle de lecture",
                "type": "general_note"
            },
            {
                "content": "3 derni\u00e8res ann\u00e9es",
                "type": "conservation_note"
            }
        ],
        "organisation": {
            "pid": "1",
            "type": "org"
        },
        "patterns": {
            "days_before_first_claim": 7,
            "days_before_next_claim": 7,
            "frequency": "rdafr:1010",
            "language": "eng",
            "max_number_of_claims": 3,
            "next_expected_date": "2015-06-01",
            "template": "no {{first_enumeration.level_1}} {{first_chronology.level_2}} {{first_chronology.level_1}}",
            "values": [
                {
                    "levels": [
                        {
                            "next_value": 82,
                            "number_name": "level_1",
                            "starting_value": 61
                        }
                    ],
                    "name": "first_enumeration"
                },
                {
                    "levels": [
                        {
                            "next_value": 2025,
                            "number_name": "level_1",
                            "starting_value": 2020
                        },
                        {
                            "list_name": "level_2",
                            "mapping_values": [
                                "mars",
                                "juin",
                                "sept.",
                                "d\u00e9c."
                            ],
                            "next_value": 2
                        }
                    ],
                    "name": "first_chronology"
                }
            ]
        },
        "pid": "641",
        "second_call_number": "EN 4624",
        "vendor": {
            "pid": "4"
        }
    },
    "updated": "2025-11-18T15:34:59.232091+00:00"
};

class holdingsServiceMock {
  getHoldingPatternPreview(holdingPid: string, size = 10): Observable<PredictionIssue[]> {
    let issues = [
      {
        "expected_date": "2015-03-01",
        "issue": "no 81 mars 2024"
      },
      {
        "expected_date": "2015-06-01",
        "issue": "no 82 juin 2024"
      },
      {
        "expected_date": "2015-09-01",
        "issue": "no 83 sept. 2024"
      }
    ];
    if (size !== 3) {
      issues = [...issues, {
        "expected_date": "2016-03-01",
        "issue": "no 84 mars 2025"
      },
      {
        "expected_date": "2016-06-01",
        "issue": "no 85 juin 2025"
      },
      {
        "expected_date": "2016-09-01",
        "issue": "no 86 sept. 2025"
      }];
    }
    return of(issues);
  }

  quickReceivedIssue(holding: any, displayText?: string, receivedDate?: string) {
    return of({
      "issue": {
        "$schema": "https://bib.rero.ch/schemas/items/item-v0.0.1.json",
        "barcode": "f-20251118043458759280",
        "document": {
          "$ref": "https://bib.rero.ch/api/documents/251"
        },
        "enumerationAndChronology": "no 81 mars 2025",
        "holding": {
          "$ref": "https://bib.rero.ch/api/holdings/641"
        },
        "issue": {
          "expected_date": "2015-03-01",
          "received_date": "2025-11-18",
          "regular": true,
          "status": "received",
          "status_date": "2025-11-18T15:34:58.760892+00:00"
        },
        "item_type": {
          "$ref": "https://bib.rero.ch/api/item_types/3"
        },
        "library": {
          "$ref": "https://bib.rero.ch/api/libraries/1"
        },
        "location": {
          "$ref": "https://bib.rero.ch/api/locations/3"
        },
        "organisation": {
          "$ref": "https://bib.rero.ch/api/organisations/1"
        },
        "pid": "943",
        "status": "on_shelf",
        "type": "issue"
      }
    });
  }
}

class holdingsApiServiceMock {
  getIssuesByHoldings(holdingsPid: string, page: number, size: number, markedAsNew: boolean, filter?: string) {
    const result: EsResult = {
        "aggregations": {},
        "hits": {
            "hits": [
                {
                    "created": "2025-11-18T14:00:13.099783+00:00",
                    "id": "934",
                    "links": {
                        "self": "https://localhost:5000/api/items/934"
                    },
                    "metadata": {
                        "$schema": "https://bib.rero.ch/schemas/items/item-v0.0.1.json",
                        "barcode": "f-20251118030013063903",
                        "current_pending_requests": 0,
                        "document": {
                            "document_type": [
                                {
                                    "main_type": "docmaintype_serial"
                                }
                            ],
                            "pid": "251",
                            "type": "doc"
                        },
                        "enumerationAndChronology": "no 72 d\u00e9c. 2022",
                        "holding": {
                            "pid": "641",
                            "type": "hold"
                        },
                        "issue": {
                            "expected_date": "2012-12-01",
                            "inherited_first_call_number": "SM af-82",
                            "inherited_second_call_number": "EN 4624",
                            "received_date": "2025-11-18",
                            "regular": true,
                            "sort_date": "2012-12-01",
                            "status": "received",
                            "status_date": "2025-11-18T14:00:13.070254+00:00"
                        },
                        "item_type": {
                            "pid": "3",
                            "type": "itty"
                        },
                        "library": {
                            "pid": "1",
                            "type": "lib"
                        },
                        "location": {
                            "pid": "3",
                            "type": "loc"
                        },
                        "organisation": {
                            "pid": "1",
                            "type": "org"
                        },
                        "pid": "934",
                        "status": "on_shelf",
                        "type": "issue",
                        "vendor": {
                            "pid": "4",
                            "type": "vndr"
                        }
                    },
                    "updated": "2025-11-18T14:00:13.099800+00:00"
                },
                {
                    "created": "2025-11-18T14:00:08.704315+00:00",
                    "id": "933",
                    "links": {
                        "self": "https://localhost:5000/api/items/933"
                    },
                    "metadata": {
                        "$schema": "https://bib.rero.ch/schemas/items/item-v0.0.1.json",
                        "barcode": "f-20251118030008674194",
                        "current_pending_requests": 0,
                        "document": {
                            "document_type": [
                                {
                                    "main_type": "docmaintype_serial"
                                }
                            ],
                            "pid": "251",
                            "type": "doc"
                        },
                        "enumerationAndChronology": "no 71 sept. 2023",
                        "holding": {
                            "pid": "641",
                            "type": "hold"
                        },
                        "issue": {
                            "expected_date": "2012-09-01",
                            "inherited_first_call_number": "SM af-82",
                            "inherited_second_call_number": "EN 4624",
                            "received_date": "2025-11-18",
                            "regular": true,
                            "sort_date": "2012-09-01",
                            "status": "received",
                            "status_date": "2025-11-18T14:00:08.676898+00:00"
                        },
                        "item_type": {
                            "pid": "3",
                            "type": "itty"
                        },
                        "library": {
                            "pid": "1",
                            "type": "lib"
                        },
                        "location": {
                            "pid": "3",
                            "type": "loc"
                        },
                        "organisation": {
                            "pid": "1",
                            "type": "org"
                        },
                        "pid": "933",
                        "status": "on_shelf",
                        "type": "issue",
                        "vendor": {
                            "pid": "4",
                            "type": "vndr"
                        }
                    },
                    "updated": "2025-11-18T14:00:08.704331+00:00"
                },
                {
                    "created": "2025-11-18T14:00:01.079118+00:00",
                    "id": "931",
                    "links": {
                        "self": "https://localhost:5000/api/items/931"
                    },
                    "metadata": {
                        "$schema": "https://bib.rero.ch/schemas/items/item-v0.0.1.json",
                        "barcode": "f-20251118030001045238",
                        "current_pending_requests": 0,
                        "document": {
                            "document_type": [
                                {
                                    "main_type": "docmaintype_serial"
                                }
                            ],
                            "pid": "251",
                            "type": "doc"
                        },
                        "enumerationAndChronology": "no 69 mars 2024",
                        "holding": {
                            "pid": "641",
                            "type": "hold"
                        },
                        "issue": {
                            "expected_date": "2012-03-01",
                            "inherited_first_call_number": "SM af-82",
                            "inherited_second_call_number": "EN 4624",
                            "received_date": "2025-11-18",
                            "regular": true,
                            "sort_date": "2012-03-01",
                            "status": "received",
                            "status_date": "2025-11-18T14:00:01.048339+00:00"
                        },
                        "item_type": {
                            "pid": "3",
                            "type": "itty"
                        },
                        "library": {
                            "pid": "1",
                            "type": "lib"
                        },
                        "location": {
                            "pid": "3",
                            "type": "loc"
                        },
                        "organisation": {
                            "pid": "1",
                            "type": "org"
                        },
                        "pid": "931",
                        "status": "on_shelf",
                        "type": "issue",
                        "vendor": {
                            "pid": "4",
                            "type": "vndr"
                        }
                    },
                    "updated": "2025-11-18T14:00:01.079129+00:00"
                }
            ],
            "total": {
                "relation": "eq",
                "value": 3
            }
        },
        "links": {
            "create": "https://localhost:5000/api/items/",
            "self": "https://localhost:5000/api/items/"
        }
    };
    if (markedAsNew) {
      result.hits.hits[0].new_issue = true;
    }
    if (filter) {
      result.hits.hits = result.hits.hits.filter(i => i.metadata.enumerationAndChronology.indexOf(filter) > -1);
    }
    return of(result);
  }
}
