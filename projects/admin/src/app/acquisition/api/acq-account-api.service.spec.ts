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
import { RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { accountDefaultData, IAcqAccount } from "../classes/account";
import { AcqAccountApiService } from "./acq-account-api.service";

describe('AcqAccountApiService', () => {
  let service: AcqAccountApiService;

  const record: IAcqAccount = {
    name: "AOSTE-CANT1-Collections",
    number: "AOSTE-CANT1.Col.01.000",
    depth: 0,
    is_active: false,
    allocated_amount: 50000,
    encumbrance_amount: {
      children: 341,
      self: 0,
      total: 341
    },
    expenditure_amount: {
      children: 75,
      self: 0,
      total: 75
    },
    distribution: 40000,
    budget: {
      pid: '1'
    },
    parent: undefined,
    organisation: {
      pid: '1',
      type: 'org'
    }
  };

  const record2: IAcqAccount = {
    name: "AOSTE-CANT1-Collections 2",
    number: "AOSTE-CANT1.Col.02.000",
    depth: 0,
    is_active: false,
    allocated_amount: 10000,
    encumbrance_amount: {
      children: 12,
      self: 0,
      total: 12
    },
    expenditure_amount: {
      children: 45,
      self: 0,
      total: 45
    },
    distribution: 2000,
    budget: {
      pid: '1'
    },
    parent: undefined,
    organisation: {
      pid: '1',
      type: 'org'
    }
  };

  const response = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [
        { metadata: record },
        { metadata: record2 }
      ]
    },
    links: {}
  };

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits', 'delete']);
  recordServiceSpy.totalHits.and.returnValue(2);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AcqAccountApiService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(AcqAccountApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an acquisition account with default value', () => {
    recordServiceSpy.getRecords.and.returnValue(of(response));
    const data = {...accountDefaultData, ...record};
    service.getAccount('1').subscribe((result: any) => expect(result).toEqual(data))
  });

  it('should return a list of acquisition accounts', () => {
    recordServiceSpy.getRecords.and.returnValue(of(response));
    const data = [
      {...accountDefaultData, ...record},
      {...accountDefaultData, ...record2},
    ];
    service.getAccounts('1').subscribe((result: any) => expect(result).toEqual(data));
  });

  it('should delete an account', () => {
    recordServiceSpy.delete.and.returnValue(of(undefined));
    service.delete('1').subscribe((result: any) => expect(result).toBeUndefined());
  });

  it('should transfer an amount between 2 accounts', () => {
    httpClientSpy.get.and.returnValue(of({}));
    service.transferFunds('1', '2', 10000).subscribe((result: any) => expect(result).toEqual({}));
  });
});
