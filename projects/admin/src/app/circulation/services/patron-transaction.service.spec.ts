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
import { apiResponse } from "projects/shared/src/tests/api";
import { UserService } from "@rero/shared";
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

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = {
    patronLibrarian: {
      pid: '1'
    },
    currentLibrary: '1'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        PatronTransactionService,
        RouteToolService,
        RecordService,
        { provide: UserService, useValue: userServiceSpy },
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
    spyOn(recordService, 'getRecords').and.returnValue(of(apiResponse));

    service.patronTransactionsByLoan$('1')
      .subscribe((result: PatronTransaction[]) => {
        expect(result.length).toEqual(1);
        expect(result[0]).toBeInstanceOf(PatronTransaction);
        expect(result[0].total_amount).toEqual(10);
      });
  });

  it('should return a list of patron transactions for a patron', () => {
    apiResponse.hits.hits = [patronTransaction];
    spyOn(recordService, 'getRecords').and.returnValue(of(apiResponse));
    service.patronTransactionsByPatron$('1')
      .subscribe((result: PatronTransaction[]) => {
        expect(result[0]).toBeInstanceOf(PatronTransaction);
      });
  });

  it('should emit a list of patron transactions', () => {
    apiResponse.hits.hits = [patronTransaction];
    spyOn(recordService, 'getRecords').and.returnValue(of(apiResponse));
    service.patronTransactionsSubject$.subscribe((result: PatronTransaction[]) => {
      expect(result).toBeInstanceOf(Array);
      if(result.length > 0) {
        expect(result[0]).toBeInstanceOf(PatronTransaction);
      }
    });
    service.emitPatronTransactionByPatron('1');
  });

  it('should add events to a patron transaction', () => {
    apiResponse.hits.hits = [patronTransactionEvent];
    spyOn(recordService, 'getRecords').and.returnValue(of(apiResponse));
    const transaction = new PatronTransaction(patronTransaction.metadata);
    expect(transaction.events.length).toEqual(0);
    service.loadTransactionHistory(transaction);
    expect(transaction.events.length).toEqual(1);
    const transactionEvent = transaction.events[0];
    expect(transactionEvent).toBeInstanceOf(PatronTransactionEvent);
    expect(transactionEvent.amount).toEqual(5);
  });

  it('should return the total of open transactions', () => {
    expect(service.computeTotalTransactionsAmount([
      patronTransaction.metadata,
      patronTransactionSecond.metadata,
      patronTransactionClosed.metadata
    ])).toEqual(15);
  });

  it('should issue the amount of the transaction paid', () => {
    service.patronFeesOperationSubject$.subscribe((result: number) => {
      expect(result).toEqual(-5);
    });
    service.payPatronTransaction(new PatronTransaction(patronTransaction.metadata), 5, 'cash');
  });

  it('should add a dispute to a transaction and emit the transaction', () => {
    apiResponse.hits.hits = [patronTransaction];
    spyOn(recordService, 'getRecords').and.returnValue(of(apiResponse));
    spyOn(recordService, 'create').and.returnValue(of({}));

    service.patronTransactionsSubject$.subscribe((result: any) => {
      if(result.length > 0) {
        expect(result[0]).toBeInstanceOf(PatronTransaction);

      }
    });
    messageService.messageObserver
      .subscribe((options: ToastMessageOptions) => expect(options.severity).toEqual('success'));
    service.disputePatronTransaction(new PatronTransaction(patronTransaction.metadata), 'contest');
  });

  it('should cancel a transaction and emit the amount', () => {
    service.patronFeesOperationSubject$.subscribe((result: number) => {
      expect(result).toEqual(-2);
    });
    service.cancelPatronTransaction(new PatronTransaction(patronTransaction.metadata), 2, 'invalid')
  });
});
