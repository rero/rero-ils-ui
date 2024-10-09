/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ItemApiService } from '@app/admin/api/item-api.service';
import { ItemsService } from '@app/admin/service/items.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslateService } from '@ngx-translate/core';
import { RecordUiService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { ItemRequestComponent } from '../../item-request/item-request.component';

@Component({
  selector: 'admin-default-holding-item',
  templateUrl: './default-holding-item.component.html'
})
export class DefaultHoldingItemComponent implements OnInit {

  public itemApiService: ItemApiService = inject(ItemApiService);
  protected recordUiService: RecordUiService = inject(RecordUiService);
  protected recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  protected userService: UserService = inject(UserService);
  protected itemService: ItemsService = inject(ItemsService);
  protected translateService: TranslateService = inject(TranslateService);
  private dialogService: DialogService = inject(DialogService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Holding record */
  @Input() holding: any;
  /** Item Record */
  @Input() item: any;
  /** Event for delete Item */
  @Output() deleteItem = new EventEmitter();
  /** Restrict the functionality of interface */
  @Input() isCurrentOrganisation = true;

  /** Item permissions */
  permissions: any;

  // GETTER & SETTER ==========================================================
  /** Current interface language */
  get language() {
    return this.translateService.currentLang;
  }

  /**
   * Get the number of pending request on this item
   * @returns number of request related to this item.
   */
  get itemRequestCounter(): number {
    return (this.item.metadata.availability && this.item.metadata.availability.request)
      ? this.item.metadata.availability.request
      : 0;
  }

  /** Message containing the reasons why the item cannot be deleted. */
  get deleteInfoMessage(): string {
    return this.recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons);
  }

  /** Message containing the reasons wht the item cannot be requested. */
  get cannotRequestInfoMessage(): string {
    return this.recordPermissionService.generateTooltipMessage(this.permissions.canRequest.reasons, 'request');
  }

  /** OnInit hook */
  ngOnInit(): void {
    if (this.isCurrentOrganisation) {
      this._getPermissions();
    }
  }

  // COMPONENT FUNCTIONS ======================================================

  /**
   * Add request on item and refresh permissions
   * @param recordPid - The record pid (should be item pid)
   * @param recordType - the record type (should be `item`)
   */
  addRequest(recordPid: string, recordType: string): void {
    const ref: DynamicDialogRef = this.dialogService.open(ItemRequestComponent, {
      data: { recordPid, recordType }
    })
    ref.onClose.subscribe((value: boolean) => {
      if (value) {
        this.itemService.getByPidFromEs(recordPid).subscribe(result => {
          this.item = result;
          this._getPermissions();
        });
      }
    });
  }

  /**
   * Delete item
   * @param itemPid - Item pid
   */
  delete(itemPid: string): void {
    this.deleteItem.emit(itemPid);
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================
  /** Get permissions */
  private _getPermissions(): void {
    const permissionObs$ = this.recordPermissionService.getPermission('items', this.item.metadata.pid);
    const canRequestObs$ = this.itemService.canRequest(this.item.metadata.pid);
    forkJoin([permissionObs$, canRequestObs$]).subscribe(
      ([permissions, canRequest]) => {
        // DEV NOTES :: Why using switch location.
        //   The item permissions returned by server could be limited by the `membership` method. This method check if the item owning
        //   library is the same as current UI used library. So the switch library button should be displayed if the user may edit the item
        //   but are not using the same library as item owning library.
        const switchLocation = {can: permissions.update.can };
        this.permissions = this.recordPermissionService.membership(this.userService.user, this.item.metadata.library.pid, permissions);
        this.permissions.switchLocation = switchLocation;
        this.permissions.canRequest = canRequest;
      });
  }

}
