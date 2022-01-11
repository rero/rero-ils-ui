/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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

import { Injectable } from '@angular/core';
import { IAcqOrder, AcqOrderStatus } from '../classes/order';
import { RecordPermissions } from '../../classes/permissions';

@Injectable()
export class ReceivedOrderPermissionValidator {

  /**
   * Update the permissions analyzing an order. If an order is fully received, none
   * receipt can be created on it anymore.
   * @param permissions: the permissions related to the object.
   * @param order: the order to analyze.
   */
  validate(permissions: RecordPermissions, order: IAcqOrder){
    setTimeout(() => {}, 0);
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
}
