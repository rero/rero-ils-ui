// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ApiService, RecordService } from "@rero/ng-core";
import { AppStore, ItemStatus } from "@rero/shared";
import { apiResponse } from "@rero/shared";
import { of } from "rxjs";
import { Item, ItemAction, ItemNoteType } from "../classes/items";
import { Loan, LoanState } from "../classes/loans";
import { ItemsService } from "./items.service";

describe('ItemsService', () => {
  let service: ItemsService;

  const httpClientSpy = { get: vi.fn(), post: vi.fn() };

  const appStoreSpy = { } as any;
  const user = {
    patronLibrarian: {
      pid: '1'
    }
  };
  appStoreSpy.user = vi.fn(() => user);

  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.totalHits.mockReturnValue(1);

  const item = {
    pid: '1',
    loan: {
      pid: '2'
    }
  };

  const itemAll = {
    available: false,
    barcode: 'I11111',
    call_number: "CN 11223",
    document: {
      pid: '1'
    },
    status: ItemStatus.ON_SHELF,
    organisation: {
      pid: '1'
    },
    pid: '1',
    requests_count: 0,
    currentAction: ItemAction.checkout,
    loan: {
      pid: '1',
      state: LoanState.CREATED,
      dueDate: '2025-04-22',
      expired: false
    },
    actions: [],
    number_of_extensions: 0,
    pending_loans: [],
    location: {
      pid: '1'
    },
    library: {
      pid: '1'
    },
    library_location_name: 'Library location name',
    acquisition_date: '2025-04-22',
    enumerationAndChronology: "I-12",
    _currentAction: ItemAction.checkout,
    actionDone: ItemAction.checkout,
    notes: []
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        ItemsService,
        { provide: ApiService, useValue: { getEndpointByType: vi.fn().mockReturnValue('/api/') } },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: AppStore, useValue: appStoreSpy },
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(ItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of items', () => {
    const items = [{ pid: '1' }];
    apiResponse.hits.hits = items;
    recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
    service.getByPidFromEs('1')
      .subscribe((result: any) => expect(result).toEqual(items[0]))
  });

  it('should return a list of requested loans', () => {
    apiResponse.hits.hits = [{
      item: {
        loan: undefined
      },
      loan: {
        pid: '1'
      }
    }];
    const response = [{
      loan: {
        pid: '1'
      }
    }];
    httpClientSpy.get.mockReturnValue(of(apiResponse));
    service.getRequestedLoans('1')
      .subscribe((result: any) => expect(result).toEqual(response));
  });

  it('should return the validated request', () => {
    const response = {
      metadata: {...item},
      action_applied: {
        validate: {
          pid: '2',
          validate: true
        }
      }
    }
    httpClientSpy.post.mockReturnValue(of(response));
    service.doValidateRequest(item, '1')
      .subscribe((result: any) => expect(result).toEqual({
        pid: '1',
        loan: {
          pid: '2',
          validate: true
        }
      }));
  });

  it('should return an item', () => {
    httpClientSpy.get.mockReturnValue(of({ metadata: { item: {...itemAll} } }));
    service.getItem('1').subscribe((result: any) => {
      expect(result).toBeInstanceOf(Item);
      expect(result.loan.dueDate).toEqual('2025-04-22');
    });
  });

  it('should return the modified item after the checkin action', () => {
    const response = {
      metadata: {...itemAll},
      action_applied: {
        'checkin': new Loan(),
        'validate': new Loan()
      }
    };
    httpClientSpy.post.mockReturnValue(of(response))
    service.checkin('B1112234', '1').subscribe((result: any) => {
      expect(result).toBeInstanceOf(Item);
      expect(result.actionDone).toEqual('checkin');
      expect(result.action_applied).toEqual(response.action_applied);
    });
  });

  it('doAction', () => {
    const response = {
      metadata: {...itemAll},
      action_applied: {
        'checkin': new Loan(),
        'validate': new Loan()
      }
    };
    httpClientSpy.post.mockReturnValue(of(response));

    const additionalParams = {
      endDate: '2025-04-22'
    };
    service.doAction(itemAll, '1', '1', '1', additionalParams).subscribe((result: any) => {
      expect(result).toBeInstanceOf(Item);
      expect(result.actionDone).toEqual(ItemAction.checkout);
    });
  });

  it('getPickupLocations', () => {
    httpClientSpy.get.mockReturnValue(of({ locations: []}));
    service.getPickupLocations('1').subscribe((result: any[]) => expect(result).toEqual([]))
  });

  it('canRequest', () => {
    httpClientSpy.get.mockReturnValue(of({ can: true, reasons: {} }));
    service.canRequest('1').subscribe((result: any) => expect(result.can).toBe(true));
  });

  it('needCallout', () => {
    const item = new Item({ ...itemAll});
    expect(service.needCallout(item)).toBe(false);

    // Testing the checkin part
    item.actionDone = ItemAction.checkin;
    item.status = ItemStatus.IN_TRANSIT;
    expect(service.needCallout(item)).toBe(true);
    item.status = ItemStatus.AT_DESK;
    item.pending_loans = [new Loan()];
    expect(service.needCallout(item)).toBe(true);
    item.pending_loans = [];
    item.notes = [
      { type: ItemNoteType.CHECKIN, content: 'Checkin note' }
    ];
    expect(service.needCallout(item)).toBe(true);
    item.notes = [];
    expect(service.needCallout(item)).toBe(false);

    // Testing the checkout part
    item.actionDone = ItemAction.checkout;
    expect(service.needCallout(item)).toBe(false);
    item.notes = [
      { type: ItemNoteType.CHECKOUT, content: 'Checkout note' }
    ];
    expect(service.needCallout(item)).toBe(true);
  });
});
