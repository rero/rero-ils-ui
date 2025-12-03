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

import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ApiService, RecordService } from "@rero/ng-core";
import { ItemStatus, UserService } from "@rero/shared";
import { apiResponse } from "projects/shared/src/tests/api";
import { of } from "rxjs";
import { Item, ItemAction, ItemNoteType } from "../classes/items";
import { Loan, LoanState } from "../classes/loans";
import { ItemsService } from "./items.service";

describe('ItemsService', () => {
  let service: ItemsService;

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = {
    patronLibrarian: {
      pid: '1'
    }
  };

  const recordServiceSpy = jasmine.createSpyObj('recordService', ['getRecords', 'totalHits']);
  recordServiceSpy.totalHits.and.returnValue(1);

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
        ApiService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: UserService, useValue: userServiceSpy },
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
    recordServiceSpy.getRecords.and.returnValue(of(apiResponse));
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
    httpClientSpy.get.and.returnValue(of(apiResponse));
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
    httpClientSpy.post.and.returnValue(of(response));
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
    httpClientSpy.get.and.returnValue(of({ metadata: { item: {...itemAll} } }));
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
    httpClientSpy.post.and.returnValue(of(response))
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
    httpClientSpy.post.and.returnValue(of(response));

    const additionalParams = {
      endDate: '2025-04-22'
    };
    service.doAction(itemAll, '1', '1', '1', additionalParams).subscribe((result: any) => {
      expect(result).toBeInstanceOf(Item);
      expect(result.actionDone).toEqual(ItemAction.checkout);
    });
  });

  it('getPickupLocations', () => {
    httpClientSpy.get.and.returnValue(of({ locations: []}));
    service.getPickupLocations('1').subscribe((result: any[]) => expect(result).toEqual([]))
  });

  it('canRequest', () => {
    httpClientSpy.get.and.returnValue(of({ can: true, reasons: {} }));
    service.canRequest('1').subscribe((result: any) => expect(result.can).toBeTrue());
  });

  it('needCallout', () => {
    const item = new Item({ ...itemAll});
    expect(service.needCallout(item)).toBeFalse();

    // Testing the checkin part
    item.actionDone = ItemAction.checkin;
    item.status = ItemStatus.IN_TRANSIT;
    expect(service.needCallout(item)).toBeTrue();
    item.status = ItemStatus.AT_DESK;
    item.pending_loans = [new Loan()];
    expect(service.needCallout(item)).toBeTrue();
    item.pending_loans = [];
    item.notes = [
      { type: ItemNoteType.CHECKIN, content: 'Checkin note' }
    ];
    expect(service.needCallout(item)).toBeTrue();
    item.notes = [];
    expect(service.needCallout(item)).toBeFalse();

    // Testing the checkout part
    item.actionDone = ItemAction.checkout;
    expect(service.needCallout(item)).toBeFalse();
    item.notes = [
      { type: ItemNoteType.CHECKOUT, content: 'Checkout note' }
    ];
    expect(service.needCallout(item)).toBeTrue();
  });
});
