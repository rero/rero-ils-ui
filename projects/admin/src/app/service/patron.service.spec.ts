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
import { PatronService } from "./patron.service";
import { ApiService, RecordService } from "@rero/ng-core";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { apiResponse, loanPending, testCirculationInformations, testItemWithAllSerializedData, testOverduePreview, testPatron } from "@rero/shared";
import { Item } from "../classes/items";
import { Loan } from "../classes/loans";

describe('PatronService', () => {
  let service: PatronService;

  const httpClientSpy = { get: vi.fn() };

  const recordServiceSpy = { getRecords: vi.fn(), getRecord: vi.fn(), totalHits: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatronService,
        { provide: ApiService, useValue: { getEndpointByType: vi.fn().mockReturnValue('/api/') } },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(PatronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not return a patron', () => {
    const response = {...apiResponse};
    recordServiceSpy.getRecords.mockReturnValue(of(response));
    recordServiceSpy.totalHits.mockReturnValue(0);
    service.getPatron('2010023488').subscribe((result: any) => expect(result).toBeUndefined());
  });

  it('should return a patron', () => {
    const response = {...apiResponse};
    response.hits.hits = [{...testPatron}];
    recordServiceSpy.getRecords.mockReturnValue(of(response));
    recordServiceSpy.totalHits.mockReturnValue(1);
    service.getPatron('2010023488').subscribe((result: any) => {
      expect(result).toEqual(testPatron.metadata);
    });
  });

  it('should return a patron by its pid', () => {
    const patron = {...testPatron};
    recordServiceSpy.getRecord.mockReturnValue(of(patron));
    recordServiceSpy.totalHits.mockReturnValue(1);
    service.getPatronByPid('1')
      .subscribe((result: any) => expect(result).toEqual(patron.metadata));
  });

  it('should return a list of items for a patron', () => {
    const response = {...apiResponse};
    response.hits.hits = [
      {item: { barcode: '10000000406', 'organisation_pid': '1', pid: '406'}},
      {item: { barcode: '10000000423', 'organisation_pid': '1', pid: '423'}}
    ];
    httpClientSpy.get.mockReturnValue(of(response));
    recordServiceSpy.totalHits.mockReturnValue(2);
    service.getItems('1').subscribe((result: any[]) => {
      expect(result[0]).toBeInstanceOf(Item);
      expect(result[0].barcode).toEqual('10000000406');
    });
  });

  it('should return a item with all data', () => {
    httpClientSpy.get.mockReturnValue(of(testItemWithAllSerializedData));
    service.getItem('10000000406')
      .subscribe((result: any) => {
        expect(result).toBeInstanceOf(Item);
        expect(result.document).toEqual(testItemWithAllSerializedData.metadata.item.document);
      })
  });

  it('should return the requested items', () => {
    const response = {...apiResponse};
    response.hits.hits = [{...loanPending}];
    recordServiceSpy.getRecords.mockReturnValue(of(response));
    recordServiceSpy.totalHits.mockReturnValue(1);
    service.getItemsRequested('1')
      .subscribe((result: any) => expect(result).toEqual(response.hits.hits));
  });

  it('should return the pickup items', () => {
    const response = {...apiResponse};
    response.hits.hits = [{...loanPending}];
    recordServiceSpy.getRecords.mockReturnValue(of(response));
    recordServiceSpy.totalHits.mockReturnValue(1);
    service.getItemsPickup('1')
      .subscribe((result: any) => expect(result).toEqual(response.hits.hits));
  });

  it('should return the history', () => {
    const response = {...apiResponse};
    response.hits.hits = [{...loanPending}];
    recordServiceSpy.getRecords.mockReturnValue(of(response));
    recordServiceSpy.totalHits.mockReturnValue(1);
    service.getHistory('1')
      .subscribe((result: any) => expect(result).toEqual(response.hits.hits));
  });

  it('should return circulation information', () => {
    httpClientSpy.get.mockReturnValue(of(testCirculationInformations));
    service.getCirculationInformations('1')
      .subscribe((result: any) => expect(result).toEqual(testCirculationInformations))
  });

  it('should return overdue preview about overdue loans related to a patron', () => {
    httpClientSpy.get.mockReturnValue(of([{...testOverduePreview}]));
    service.getOverduePreview('1').subscribe((result: any) => {
      expect(result[0].fees).toEqual(testOverduePreview.fees);
      expect(result[0].loan).toBeInstanceOf(Loan);
      expect(result[0].loan.document_pid).toEqual('2000110');
    });
  });

});
