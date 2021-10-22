/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService, CoreModule } from '@rero/ng-core';
import { AcqAccountService } from '../../../services/acq-account.service';
import { AcqOrderService } from '../../../services/acq-order.service';
import { OrderReceipt } from './order-receipt';
import { OrderReceiptForm } from './order-receipt-form';

describe('OrderReceiptForm', () => {

  let orderReceiptForm: OrderReceiptForm;

  const acqOrderServiceSpy = jasmine.createSpyObj(
    'AcqOrderApiService', ['']
  );
  const acqAccountServiceSpy = jasmine.createSpyObj(
    'AcqAccountApiService', ['']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        ApiService,
        OrderReceipt,
        { provide: AcqOrderService, useValue: acqOrderServiceSpy },
        { provide: AcqAccountService, useValue: acqAccountServiceSpy },

      ]
    });
    orderReceiptForm = TestBed.inject(OrderReceiptForm);
  });

  it('should create an instance', () => {
    expect(orderReceiptForm).toBeTruthy();
  });
});
