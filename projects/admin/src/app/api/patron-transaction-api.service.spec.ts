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

import { TestBed } from "@angular/core/testing";
import { PatronTransactionApiService } from "./patron-transaction-api.service";
import { HttpClient } from "@angular/common/http";
import { RecordModule, RecordService } from "@rero/ng-core";
import { TranslateModule } from "@ngx-translate/core";
import { FeeFormModel } from "../circulation/patron/patron-transactions/patron-fee/patron-fee.component";
import { of } from "rxjs";

describe('PatronTransactionApiService', () => {
  let service: PatronTransactionApiService;

  const fee: FeeFormModel = {
    type: {
      label: "fee",
      value: "",
      data: ""
    },
    total_amount: 10,
    creation_date: '2025-04-16 12:00:00',
    patron: {
      $ref: ""
    },
    library: {
      $ref: ""
    },
    organisation: {
      $ref: ""
    },
    status: "",
    event: {
      operator: {
        $ref: ""
      },
      library: {
        $ref: ""
      }
    }
  };

  const response = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [{
        metadata: {
          creation_date: '2025-03-31T06:30:35.415610+00:00',
          pid: 1,
          status: 'open',
          total_amount: 0.4
        }
      }]
    },
    links: {}
  };

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RecordModule
      ],
      providers: [
        PatronTransactionApiService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(PatronTransactionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the fee object', () => {
    httpClientSpy.post.and.returnValue(of(fee));
    service.addFee(fee).subscribe((result: Object) => expect(result).toEqual(fee))
  });

  it('should return a list of fees on an item', () => {
    recordServiceSpy.getRecords.and.returnValue(of(response));
    service.getActiveFeesByItemPid('1')
      .subscribe((result: any) => expect(result).toEqual(response.hits.hits))
  });
});
