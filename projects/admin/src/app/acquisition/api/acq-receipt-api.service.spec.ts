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
import { AcqReceiptApiService } from "./acq-receipt-api.service";
import { RecordService, RecordUiService } from "@rero/ng-core";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { IAcqReceipt, IAcqReceiptLine, receiptDefaultData, receiptLineDefaultData } from "../classes/receipt";
import { apiResponse } from "projects/shared/src/tests/api";
import { ICreateLineMessage } from "../components/receipt/receipt-form/order-receipt";

describe('AcqReceiptApiService', () => {
  let service: AcqReceiptApiService;

  const receipt = {
    metadata: {
      pid: '1',
      acq_order: {
        pid: '1'
      },
      amount_adjustments: [],
      organisation: {
        pid: '1'
      },
      notes: []
    }
  };

  const receiptLine = {
    metadata: {
      acq_receipt: {
        pid: '1'
      },
      acq_order_line: {
        pid: '1'
      },
      quantity: 2,
      amount: 20,
      vat_rate: 8,
      receipt_date: "2025-04-17",
      organisation: {
        pid: '1'
      },
      notes: []
    }
  }

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['create', 'update', 'getRecord','getRecords', 'totalHits']);
  recordServiceSpy.totalHits.and.returnValue(1);

  const httpClientSpy = jasmine.createSpyObj('httpClient', ['get', 'post']);

  const recordUiServiceSpy = jasmine.createSpyObj('RecordUiService', ['deleteRecord']);
  recordUiServiceSpy.deleteRecord.and.returnValue(of(true));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        AcqReceiptApiService,
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: RecordUiService, useValue: recordUiServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
      ]
    });

    service = TestBed.inject(AcqReceiptApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a receipt', () => {
    const data = {...receiptDefaultData, ...receipt.metadata};
    recordServiceSpy.getRecord.and.returnValue(of(receipt));
    service.getReceipt('1').subscribe((result: IAcqReceipt) => expect(result).toEqual(data));
  });

  it('should return a list of receptions depending on whether a query', () => {
    const data = [{...receiptDefaultData, ...receipt.metadata}];
    apiResponse.hits.hits = [receipt];
    recordServiceSpy.getRecords.and.returnValue(of(apiResponse));
    service.searchReceipts('pid:1').subscribe((result: IAcqReceipt[]) => expect(result).toEqual(data));
  });

  it('should return a list of receptions for an order', () => {
    const data = [{...receiptDefaultData, ...receipt.metadata}];
    apiResponse.hits.hits = [receipt];
    recordServiceSpy.getRecords.and.returnValue(of(apiResponse));
    service.getReceiptsForOrder('1').subscribe((result: IAcqReceipt[]) => expect(result).toEqual(data));
  });

  it('should return a list of receptions', () => {
    const data = [{...receiptLineDefaultData, ...receiptLine.metadata}];
    apiResponse.hits.hits = [receiptLine];
    recordServiceSpy.getRecords.and.returnValue(of(apiResponse));
    service.getReceiptLines('1').subscribe((result: IAcqReceiptLine[]) => expect(result).toEqual(data));
  });

  it('should return the reception line created', () => {
    const data = {...receiptDefaultData, ...receipt.metadata};
    recordServiceSpy.create.and.returnValue(of(receipt));
    service.createReceipt(receipt.metadata).subscribe((result: IAcqReceipt) => expect(result).toEqual(data));
  });

  it('should return success when creating lines', () => {
    const data = {success: true};
    httpClientSpy.post.and.returnValue(of({ response: [receiptLine]}));
    service.createReceiptLines('1', [receiptLine.metadata])
      .subscribe((result: ICreateLineMessage) => expect(result).toEqual(data));
  });

  it('should return the updated receipt', () => {
    const data = {...receiptDefaultData, ...receipt.metadata};
    recordServiceSpy.update.and.returnValue(of(receipt));
    service.updateReceipt('1', receipt.metadata)
      .subscribe((result: any) => expect(result).toEqual(data));
  });

  it('should return the deleted receipt', () => {
    service.deletedReceiptSubject$
      .subscribe((result: IAcqReceipt) => expect(result).toEqual(receipt.metadata));
    service.delete(receipt.metadata);
  });

  it('should return the deleted receipt line', () => {
    service.deletedReceiptLineSubject$
      .subscribe((result: IAcqReceiptLine) => expect(result).toEqual(receiptLine.metadata));
      service.deleteReceiptLine(receiptLine.metadata);
  });
});
