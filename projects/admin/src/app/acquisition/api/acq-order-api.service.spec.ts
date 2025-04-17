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
import { Notification, NotificationType } from "@app/admin/classes/notification";
import { IPreview } from "@app/admin/shared/preview-email/IPreviewInterface";
import { TranslateModule } from "@ngx-translate/core";
import { RecordService, RecordUiService } from "@rero/ng-core";
import { ConfirmationService, MessageService } from "primeng/api";
import { apiResponse } from "projects/shared/src/tests/api";
import { of } from "rxjs";
import { AcqOrderHistoryVersionResponseInterface, AcqOrderLineStatus, AcqOrderStatus, IAcqOrder, IAcqOrderLine, orderDefaultData, orderLineDefaultData } from "../classes/order";
import { AcqOrderApiService } from "./acq-order-api.service";

describe('AcqOrderApiService', () => {
  let service: AcqOrderApiService;

  const orderRecord: IAcqOrder = {
    reference: "Order A1112",
    priority: 0,
    status: AcqOrderStatus.CANCELLED,
    currency: "CHF",
    order_date: new Date('2025-01-01'),
    account_statement: {
      provisional: {
        total_amount: 10,
        quantity: 1
      },
      expenditure: {
        total_amount: 10,
        quantity: 1
      }
    },
    vendor: {
      pid: '1'
    },
    is_current_budget: true,
    organisation: {
      pid: '1'
    },
    notes: []
  };

  const orderPreview = {
    preview: 'preview',
    recipient_suggestions: [
      {address: 'address 1'}
    ]
  }

  const notification = {
    pid: '1',
    creation_date: '2025-04-17',
    notification_sent: true,
    notification_type: NotificationType.AVAILABILITY,
    context: {
      recipients: [{ type: 'to', address: 'foo@bar.com'}]
    }
  }

  const orderHistory: AcqOrderHistoryVersionResponseInterface[] = [
    {
      $ref: '$ref',
      label: 'history label',
      description: 'description',
      created: new Date('2025-04-01'),
      updated: new Date('2025-04-17'),
      current: true
    }
  ];

  const orderLines = [
    {
      metadata: {
        pid: '1',
        status: AcqOrderLineStatus.APPROVED,
        priority: 0,
        quantity: 2,
        received_quantity: 0,
        amount: 10,
        discount_amount: 0,
        total_amount: 20,
        acq_account: {
          pid: '1'
        },
        acq_order: {
          pid: '1'
        },
        document: {
          pid: '1'
        },
        organisation: {
          pid: '1'
        },
        notes: []
      }
    }
  ];

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecord','getRecords', 'totalHits']);
  recordServiceSpy.totalHits.and.returnValue(1);

  const recordUiServiceSpy = jasmine.createSpyObj('RecordUiService', ['deleteRecord']);
  recordUiServiceSpy.deleteRecord.and.returnValue(of(true));

  const httpClientSpy = jasmine.createSpyObj('httpClient', ['get', 'post']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        AcqOrderApiService,
        ConfirmationService,
        MessageService,
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: RecordUiService, useValue: recordUiServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
      ]
    });

    service = TestBed.inject(AcqOrderApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a budget', () => {
    const data = {...orderDefaultData, ...orderRecord};
    recordServiceSpy.getRecord.and.returnValue(of({ metadata: orderRecord }));
    service.getOrder('1').subscribe((result: IAcqOrder) => expect(result).toEqual(data));
  });

  it('should return the order preview', () => {
    httpClientSpy.get.and.returnValue(of(orderPreview));
    service.getOrderPreview('1')
      .subscribe((result: IPreview) => expect(result).toEqual(orderPreview));
  });

  it('should return the notification sent', () => {
    httpClientSpy.post.and.returnValue(of({data: notification}));
    service.sendOrder('1', [{ type: 'to', address: 'foo@bar.com'}])
      .subscribe((result: Notification) => {
        expect(result).toBeInstanceOf(Notification);
      })
  });

  it('should return a list of the order history', () => {
    httpClientSpy.get.and.returnValue(of(orderHistory));
    service.getOrderHistory('1')
      .subscribe((result: any) => expect(result).toEqual(orderHistory));
  });

  it('should return a list of lines in an order', () => {
    apiResponse.hits.hits = orderLines;
    recordServiceSpy.getRecords.and.returnValue(of(apiResponse));
    const data = [{...orderLineDefaultData, ...orderLines[0].metadata}];
    service.getOrderLines('1').subscribe((result: any) => {
        expect(result).toEqual(data);
        expect(result[0].quantity).toEqual(2);
      });
  });

  it('should return to delete a line', () => {
    const orderLine = orderLines[0].metadata;
    service.deletedOrderLineSubject$
      .subscribe((result: IAcqOrderLine) => expect(result).toEqual(orderLine));
    service.deleteOrderLine(orderLine);
  });
});
