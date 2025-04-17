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
import { ReceiptLineTotalAmountPipe } from "./receipt-line-total-amount.pipe";
import { IAcqReceiptLine } from "../classes/receipt";

describe('ReceiptLineTotalAmountPipe', () => {
  let pipe: ReceiptLineTotalAmountPipe;

  const acqReceiptLine: IAcqReceiptLine = {
    acq_receipt: {
      pid: '1'
    },
    acq_order_line: {
      pid: '1'
    },
    quantity: 1,
    amount: 20,
    vat_rate: undefined,
    receipt_date: '2025-04-17',
    organisation: {
      pid: '1'
    },
    notes: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReceiptLineTotalAmountPipe
      ]
    });

    pipe = TestBed.inject(ReceiptLineTotalAmountPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the amount without the vat rate calculation', () => {
    expect(pipe.transform(acqReceiptLine)).toEqual(20);
  });

  it('should return the amount with the vat rate calculation', () => {
    const receiptLine = {...acqReceiptLine};
    receiptLine.vat_rate = 8.2;
    expect(pipe.transform(receiptLine)).toEqual(21.64);
  });
});
