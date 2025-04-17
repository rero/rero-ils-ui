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
import { ReceivedOrderPermissionValidator } from "./permissions";
import { RecordPermissions } from "@app/admin/classes/permissions";
import { AcqOrderStatus, IAcqOrder } from "../classes/order";

describe('ReceivedOrderPermissionValidator', () => {
  let service: ReceivedOrderPermissionValidator;

  const permissions: RecordPermissions = {
    create: {
      can: true
    },
    list: {
      can: true
    }
  };

  const orderRecord: IAcqOrder = {
    reference: "Order A1112",
    priority: 0,
    status: AcqOrderStatus.ORDERED,
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReceivedOrderPermissionValidator
      ]
    });

    service = TestBed.inject(ReceivedOrderPermissionValidator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return permissions with can create a true', () => {
    expect(service.validate(permissions, orderRecord)).toEqual(permissions);
  });

  it('should return permissions with can create a false and reasons', () => {
    const orderRecordReceived = {...orderRecord};
    orderRecordReceived.status = AcqOrderStatus.RECEIVED;
    const permissionsResult = {...permissions};
    permissions.create.can = false;
    permissions.create.reasons = {
      others: {
        order_fully_received: ''
      }
    };
    expect(service.validate(permissions, orderRecord)).toEqual(permissionsResult);
  });
});
