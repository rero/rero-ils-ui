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
import { PatronTransactionService } from "./patron-transaction.service";
import { RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { PatronTransaction, PatronTransactionEvent, PatronTransactionEventType, PatronTransactionStatus } from "@app/admin/classes/patron-transaction";
import { computeTotalTransactionsAmount } from "@app/admin/circulation/utils/transaction.utils";
import { apiResponse } from "@rero/shared";
import { AppStore } from "@rero/shared";
import { RouteToolService } from "@app/admin/routes/route-tool.service";
import { TranslateModule } from "@ngx-translate/core";
import { MessageService, ToastMessageOptions } from "primeng/api";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe('PatronTransactionService', () => {
  let service: PatronTransactionService;
  let recordService: RecordService;
  let messageService: MessageService;

  const patronTransaction = {
    metadata: {
      pid: '1',
      creation_date: '2025-04-22 08:00:00',
      type: 'fee',
      status: PatronTransactionStatus.OPEN,
      total_amount: 10,
      events: [],
      patron: {
        pid: '1'
      }
    }
  };

  const patronTransactionSecond = {
    metadata: {
      pid: '1',
      creation_date: '2025-04-22 08:10:00',
      type: 'fee',
      status: PatronTransactionStatus.OPEN,
      total_amount: 5,
      events: [],
      patron: {
        pid: '1'
      }
    }
  };

  const patronTransactionClosed = {
    metadata: {
      pid: '1',
      creation_date: '2025-04-22 08:00:00',
      type: 'fee',
      status: PatronTransactionStatus.CLOSED,
      total_amount: 2,
      events: [],
      patron: {
        pid: '1'
      }
    }
  };

  const patronTransactionEvent = {
    metadata: {
      pid: '1',
      amount: 5,
      type: PatronTransactionEventType.PAYMENT,
      operator: {
        pid: '1'
      },
      parent: patronTransaction
    }
  };

  const appStoreSpy = { } as any;
  const user = {
    patronLibrarian: {
      pid: '1'
    },
    currentLibrary: '1'
  };
  appStoreSpy.user = vi.fn(() => user);
  appStoreSpy.currentLibraryPid = vi.fn(() => '1');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        PatronTransactionService,
        RouteToolService,
        RecordService,
        { provide: AppStore, useValue: appStoreSpy },
        MessageService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(PatronTransactionService);
    recordService = TestBed.inject(RecordService);
    messageService = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of patron transactions', () => {
    apiResponse.hits.hits = [patronTransaction];
    vi.spyOn(recordService, 'getRecords').mockReturnValue(of(apiResponse));

    service.patronTransactionsByLoan('1')
      .subscribe((result: PatronTransaction[]) => {
        expect(result.length).toEqual(1);
        expect(result[0]).toBeInstanceOf(PatronTransaction);
        expect(result[0].total_amount).toEqual(10);
      });
  });

  it('should return a list of patron transactions for a patron', () => {
    apiResponse.hits.hits = [patronTransaction];
    vi.spyOn(recordService, 'getRecords').mockReturnValue(of(apiResponse));
    service.patronTransactionsByPatron('1')
      .subscribe((result: PatronTransaction[]) => {
        expect(result[0]).toBeInstanceOf(PatronTransaction);
      });
  });

  it('should add events to a patron transaction', () => {
    apiResponse.hits.hits = [patronTransactionEvent];
    vi.spyOn(recordService, 'getRecords').mockReturnValue(of(apiResponse));
    const transaction = new PatronTransaction(patronTransaction.metadata);
    expect(transaction.events.length).toEqual(0);
    service.loadTransactionHistory(transaction).subscribe(events => transaction.events = events);
    expect(transaction.events.length).toEqual(1);
    const transactionEvent = transaction.events[0];
    expect(transactionEvent).toBeInstanceOf(PatronTransactionEvent);
    expect(transactionEvent.amount).toEqual(5);
  });

  it('should return the total of open transactions', () => {
    expect(computeTotalTransactionsAmount([
      patronTransaction.metadata,
      patronTransactionSecond.metadata,
      patronTransactionClosed.metadata
    ] as any[])).toEqual(15);
  });

  it('should issue the amount of the transaction paid', () => {
    vi.spyOn(recordService, 'create').mockReturnValue(of({
      created: '', id: '1', links: { self: '' }, metadata: {}, updated: ''
    }));
    service.payPatronTransaction(new PatronTransaction(patronTransaction.metadata), 5, 'cash').subscribe();
    expect(recordService.create).toHaveBeenCalled();
  });

  it('should add a dispute to a transaction and emit a success message', () => {
    vi.spyOn(recordService, 'create').mockReturnValue(of({
      created: '', id: '1', links: { self: '' }, metadata: {}, updated: ''
    }));
    messageService.messageObserver
      .subscribe((options: ToastMessageOptions) => expect(options.severity).toEqual('success'));
    service.disputePatronTransaction(new PatronTransaction(patronTransaction.metadata), 'contest').subscribe();
  });

  it('should cancel a transaction and emit the amount', () => {
    vi.spyOn(recordService, 'create').mockReturnValue(of({
      created: '', id: '1', links: { self: '' }, metadata: {}, updated: ''
    }));
    service.cancelPatronTransaction(new PatronTransaction(patronTransaction.metadata), 2, 'invalid').subscribe();
    expect(recordService.create).toHaveBeenCalled();
  });
});
