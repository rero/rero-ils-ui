// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { validateReceivedOrderPermissions } from "./permissions";
import { RecordPermissions } from "@app/admin/classes/permissions";
import { AcqOrderStatus, IAcqOrder } from "../classes/order";

describe('validateReceivedOrderPermissions', () => {

  const permissions: RecordPermissions = {
    create: { can: true },
    list: { can: true }
  };

  const orderRecord: IAcqOrder = {
    reference: "Order A1112",
    priority: 0,
    status: AcqOrderStatus.ORDERED,
    currency: "CHF",
    order_date: new Date('2025-01-01'),
    account_statement: {
      provisional: { total_amount: 10, quantity: 1 },
      expenditure: { total_amount: 10, quantity: 1 }
    },
    vendor: { pid: '1' },
    is_current_budget: true,
    organisation: { pid: '1' },
    notes: []
  };

  it('should return permissions unchanged when order is not RECEIVED', () => {
    const result = validateReceivedOrderPermissions({ ...permissions, create: { can: true } }, orderRecord);
    expect(result.create.can).toBe(true);
  });

  it('should disable create when order is RECEIVED', () => {
    const receivedOrder = { ...orderRecord, status: AcqOrderStatus.RECEIVED };
    const result = validateReceivedOrderPermissions({ ...permissions, create: { can: true } }, receivedOrder);
    expect(result.create.can).toBe(false);
    expect(result.create.reasons?.others?.order_fully_received).toBeDefined();
  });
});
