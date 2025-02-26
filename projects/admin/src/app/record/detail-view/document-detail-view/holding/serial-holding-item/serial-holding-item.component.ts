/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { Component } from '@angular/core';
import { IssueItemStatus } from '@rero/shared';
import { DefaultHoldingItemComponent } from '../default-holding-item/default-holding-item.component';

@Component({
    selector: 'admin-serial-holding-item',
    templateUrl: './serial-holding-item.component.html',
    standalone: false
})
export class SerialHoldingItemComponent extends DefaultHoldingItemComponent {

  /** reference to ItemIssueStatus */
  itemIssueStatus = IssueItemStatus;
}
