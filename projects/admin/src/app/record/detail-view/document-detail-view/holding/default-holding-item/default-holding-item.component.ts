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
import { BsModalService } from 'ngx-bootstrap/modal';
import { RecordUiService } from '@rero/ng-core';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { ItemsService } from 'projects/admin/src/app/service/items.service';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';
import { UserService } from 'projects/admin/src/app/service/user.service';
import { ItemRequestComponent } from '../../item-request/item-request.component';


@Component({
  selector: 'admin-default-holding-item',
  templateUrl: './default-holding-item.component.html'
})
export class DefaultHoldingItemComponent implements OnInit {

  /** Holding record */
  @Input() holding: any;

  /** Item Record */
  @Input() item: any;

  /** Event for delete Item */
  @Output() deleteItem = new EventEmitter();

  /** Item permissions */
  permissions: any;


  /**
   * Constructor
   * @param _recordUiService - RecordUiService
   * @param _userService - UserService
   * @param _recordPermissionService - RecordPermissionService
   * @param _modalService - BsModalService
   * @param _itemService - ItemService
   */
  constructor(
    protected _recordUiService: RecordUiService,
    protected _recordPermissionService: RecordPermissionService,
    protected _userService: UserService,
    protected _modalService: BsModalService,
    protected _itemService: ItemsService
  ) { }

  /** Init */
  ngOnInit() {
    this.getPermissions();
  }

  /** Get permissions */
  getPermissions() {
    const permissionObs = this._recordPermissionService.getPermission('items', this.item.metadata.pid);
    const canRequestObs = this._itemService.canRequest(this.item.metadata.pid);
    forkJoin([permissionObs, canRequestObs]).subscribe(
      ([permissions, canRequest]) => {
        this.permissions = permissions;
        this.permissions.canRequest = canRequest;
    });
  }

  /** Check if the holding owning library correspond to the current user library affiliation.
   *
   * Used to display the request button. A more advanced test is performed when the patron barcode is known.
   * @returns - true if match
   */
  get isHoldingMatchUserLibraryPID(): boolean {
    return this._userService.getCurrentUser().currentLibrary === this.holding.metadata.library.pid;
  }

  /**
   * Add request on item and refresh permissions
   * @param itemPid - string
   */
  addRequest(itemPid: string) {
    const modalRef = this._modalService.show(ItemRequestComponent, {
      initialState: { itemPid }
    });
    modalRef.content.onSubmit.pipe(first()).subscribe(value => {
      this.getPermissions();
    });
  }

  /**
   * Delete item
   * @param itemPid - Item pid
   */
  delete(itemPid) {
    this.deleteItem.emit(itemPid);
  }

  /**
   * Return a message containing the reasons why the item cannot be deleted
   */
  get deleteInfoMessage(): string {
    return this._recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons);
  }

  /**
   * Return a message containing the reasons wht the item cannot be requested
   */
  get cannotRequestInfoMessage(): string {
    return this._recordPermissionService.generateTooltipMessage(this.permissions.canRequest.reasons, 'request');
  }

}
