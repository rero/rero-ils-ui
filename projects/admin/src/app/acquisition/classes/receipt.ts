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

export interface IReceiptOrder {
  $schema?: string;
  pid?: string;
  acq_order: {
    $ref: string;
  };
  exchange_rate: number;
  amount_adjustments?: IReceiptOrderAmountAdjustment[];
  notes?: IReceiptOrderNote[];
  library: {
    $ref: string;
  };
  organisation: {
    $ref: string;
  };
}

export interface IReceiptOrderAmountAdjustment {
  label: string;
  amount: number;
  acq_account: {
    $ref: string;
  };
}

export interface IReceiptOrderNote {
  type: string;
  content: string;
}

export enum LineStatus {
  SUCCESS = 'success',
  FAILURE = 'failure'
}
