/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecordUiService } from '@rero/ng-core';
import { RecordPermissionMessageService } from 'projects/admin/src/app/service/record-permission-message.service';
import { UserService } from 'projects/admin/src/app/service/user.service';

@Component({
  selector: 'admin-holding-item',
  templateUrl: './holding-item.component.html',
  styles: []
})
export class HoldingItemComponent {

  /** Holding record */
  @Input() holding: any;

  /** Item Record */
  @Input() item: any;

  /** Event for delete Item */
  @Output() deleteItem = new EventEmitter();

  /** Availables action */
  get isAvailableActions() {
    return this.userService.getCurrentUser().currentLibrary
      = this.holding.metadata.library.pid;
  }

  /**
   * Constructor
   * @param recordUiService - RecordUiService
   * @param recordPermissionMessage - RecordPermissionMessageService
   */
  constructor(
    private recordUiService: RecordUiService,
    private recordPermissionMessage: RecordPermissionMessageService,
    private userService: UserService
  ) { }

  /**
   * Delete item
   * @param itemPid - Item pid
   */
  delete(itemPid: string) {
    this.recordUiService.deleteRecord('items', itemPid).subscribe((success: any) => {
      if (success) {
        this.deleteItem.emit(itemPid);
      }
    });
  }

  /**
   * Display message if the record cannot be deleted
   * @param item - Item record
   */
  public showDeleteMessage(item: object) {
    const message = this.recordPermissionMessage.generateMessage(item);
    this.recordUiService.showDeleteMessage(message);
  }
}
