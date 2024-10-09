/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Component, inject } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'admin-checkin-action',
  templateUrl: './checkin-action.component.html'
})
export class CheckinActionComponent {

  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);

  /** Checkin action */
  public action: 'patron' | 'item';

  /**
   * Set checkin action selected by user
   * @param action - string
   */
  setAction(action: 'patron' | 'item') {
    this.action = action;
    this.dynamicDialogRef.close(action);
  }

  checkinItemOnEnterKey(event: any) {
    if (event.key === 'Enter') {
      this.setAction('item');
    }
  }

  /** Close modal box */
  closeModal() {
    this.dynamicDialogRef.close();
  }
}
