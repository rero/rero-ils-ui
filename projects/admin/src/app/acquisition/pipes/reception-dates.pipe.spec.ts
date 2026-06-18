// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { ReceptionDatesPipe } from "./reception-dates.pipe";
import { IAcqReceipt, IAcqReceiptLine } from "../classes/receipt";

describe('ReceptionDatesPipe', () => {
  let pipe: ReceptionDatesPipe;

  const acqReceiptLine: IAcqReceiptLine = {
    acq_receipt: {
      pid: '1'
    },
    acq_order_line: {
      pid: '1'
    },
    quantity: 1,
    amount: 20,
    vat_rate: 8,
    receipt_date: '2025-04-17',
    organisation: {
      pid: '1'
    },
    notes: []
  };
  const acqReceiptLine2: IAcqReceiptLine = {...acqReceiptLine};
  acqReceiptLine2.amount = 10;

  const acqReceiptLine3: IAcqReceiptLine = {...acqReceiptLine};
  acqReceiptLine3.amount = 10;
  acqReceiptLine3.receipt_date = '2025-04-10';

  const acqReceipt: IAcqReceipt = {
    acq_order: {
      pid: '1'
    },
    amount_adjustments: [],
    organisation: {
      pid: '1'
    },
    notes: [],
    receipt_lines: [
      acqReceiptLine,
      acqReceiptLine2,
      acqReceiptLine3
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReceptionDatesPipe
      ]
    });

    pipe = TestBed.inject(ReceptionDatesPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the amount without the vat rate calculation', () => {
    expect(pipe.transform(acqReceipt)).toEqual(['2025-04-17', '2025-04-10']);
  });

});
