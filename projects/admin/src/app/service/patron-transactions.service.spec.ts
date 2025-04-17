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
import { PatronTransactionsService } from "./patron-transactions.service";
import { of } from "rxjs";
import { apiResponse } from "projects/shared/src/tests/api";
import { patronTransaction } from "@rero/shared";
import { RecordService } from "@rero/ng-core";
import { PatronTransaction } from "../classes/patron-transaction";

describe('PatronTransactionsService', () => {
  let service: PatronTransactionsService;

  const response = {...apiResponse};
  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);
  recordServiceSpy.totalHits.and.returnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatronTransactionsService,
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(PatronTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the patron transaction', () => {
    const transaction = {...patronTransaction};
    response.hits.hits = [transaction];
    recordServiceSpy.getRecords.and.returnValue(of(response));

    service.getPatronTransaction('1').subscribe((result: any) => {
      expect(result).toBeInstanceOf(PatronTransaction);
      console.log('result', result);
      expect(result.type).toEqual('overdue');
    });
  });
});
