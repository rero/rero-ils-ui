// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Notification, NotificationType } from "@app/admin/classes/notification";
import { IPreview } from "@app/admin/shared/preview-email/IPreviewInterface";
import { TranslateModule } from "@ngx-translate/core";
import { RecordService, RecordUiService } from "@rero/ng-core";
import { apiResponse } from "@rero/shared";
import { ConfirmationService, MessageService } from "primeng/api";
import { of } from "rxjs";
import { AcqOrderHistoryVersionResponseInterface, AcqOrderLineStatus, AcqOrderStatus, IAcqOrder, orderDefaultData, orderLineDefaultData } from "../classes/order";
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

  const recordServiceSpy = { getRecord: vi.fn(), getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.totalHits.mockReturnValue(1);

  const recordUiServiceSpy = { deleteRecord: vi.fn() };
  recordUiServiceSpy.deleteRecord.mockReturnValue(of(true));

  const httpClientSpy = { get: vi.fn(), post: vi.fn() };

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
    recordServiceSpy.getRecord.mockReturnValue(of({ metadata: orderRecord }));
    service.getOrder('1').subscribe((result: IAcqOrder) => expect(result).toEqual(data));
  });

  it('should return the order preview', () => {
    httpClientSpy.get.mockReturnValue(of(orderPreview));
    service.getOrderPreview('1')
      .subscribe((result: IPreview) => expect(result).toEqual(orderPreview));
  });

  it('should return the notification sent', () => {
    httpClientSpy.post.mockReturnValue(of({data: notification}));
    service.sendOrder('1', [{ type: 'to', address: 'foo@bar.com'}])
      .subscribe((result: Notification) => {
        expect(result).toBeInstanceOf(Notification);
      })
  });

  it('should return a list of the order history', () => {
    httpClientSpy.get.mockReturnValue(of(orderHistory));
    service.getOrderHistory('1')
      .subscribe((result: any) => expect(result).toEqual(orderHistory));
  });

  it('should return a list of lines in an order', () => {
    apiResponse.hits.hits = orderLines;
    recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
    const data = [{...orderLineDefaultData, ...orderLines[0].metadata}];
    service.getOrderLines('1').subscribe((result: any) => {
        expect(result).toEqual(data);
        expect(result[0].quantity).toEqual(2);
      });
  });

  it('should update lastDeletedOrderLine signal on deleteOrderLine', () => {
    const orderLine = orderLines[0].metadata;
    service.deleteOrderLine(orderLine);
    expect(service.lastDeletedOrderLine()).toEqual(orderLine);
  });
});
