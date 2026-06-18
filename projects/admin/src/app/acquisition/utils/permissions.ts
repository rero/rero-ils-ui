// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { IAcqOrder, AcqOrderStatus } from '../classes/order';
import { RecordPermissions } from '../../classes/permissions';

/**
 * Update the permissions analyzing an order. If an order is fully received, none
 * receipt can be created on it anymore.
 * @param permissions - the permissions related to the object.
 * @param order - the order to analyze.
 */
export function validateReceivedOrderPermissions(permissions: RecordPermissions, order: IAcqOrder): RecordPermissions {
  if (order.status === AcqOrderStatus.RECEIVED) {
    permissions.create = {
      can: false,
      reasons: {
        others: {
          order_fully_received: ''
        }
      }
    };
  }
  return permissions;
}
