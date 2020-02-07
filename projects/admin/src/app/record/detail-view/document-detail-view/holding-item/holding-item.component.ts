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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecordUiService } from '@rero/ng-core';
import { BsModalService } from 'ngx-bootstrap';
import { RecordPermission, RecordPermissionService } from '../../../../service/record-permission.service';
import { UserService } from '../../../../service/user.service';
import { ItemRequestComponent } from '../item-request/item-request.component';


@Component({
  selector: 'admin-holding-item',
  templateUrl: './holding-item.component.html'
})
export class HoldingItemComponent implements OnInit {

  /** Holding record */
  @Input() holding: any;

  /** Item Record */
  @Input() item: any;

  /** Event for delete Item */
  @Output() deleteItem = new EventEmitter();

  /** Item permissions */
  permissions: RecordPermission;

  /** Availables actions */
  get isAvailableActions(): boolean {
    return this._userService.getCurrentUser().currentLibrary
      === this.holding.metadata.library.pid;
  }

  /**
   * Constructor
   * @param _recordUiService - RecordUiService
   * @param _userService - UserService
   * @param recordPermissionMessage - RecordPermissionMessageService
   */
  constructor(
    private _recordUiService: RecordUiService,
    private _recordPermissionService: RecordPermissionService,
    private _userService: UserService,
    private _modalService: BsModalService
  ) { }

  /**
   * Init
   */
  ngOnInit() {
    this._recordPermissionService.getPermission('items', this.item.metadata.pid)
    .subscribe(permissions => this.permissions = permissions);
  }

  /**
   * Add request on item
   * @param itemPid - string
   */
  addRequest(itemPid: string) {
    this._modalService.show(ItemRequestComponent, {
      initialState: { itemPid }
    });
  }

  /**
   * Delete item
   * @param itemPid - Item pid
   */
  delete(itemPid: string) {
    this._recordUiService.deleteRecord('items', itemPid).subscribe((success: any) => {
      if (success) {
        this.deleteItem.emit(itemPid);
      }
    });
  }

  /**
   * Display message if the record cannot be deleted
   * @param item - Item record
   */
  public showDeleteMessage() {
    const message = this._recordPermissionService.generateDeleteMessage(
      this.permissions.delete.reasons
    );
    this._recordUiService.showDeleteMessage(message);
  }
}
