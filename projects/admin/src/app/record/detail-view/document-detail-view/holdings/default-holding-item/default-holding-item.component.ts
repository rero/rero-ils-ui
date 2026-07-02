// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, linkedSignal, OnInit, output, signal, ChangeDetectionStrategy} from '@angular/core';
import { ItemApiService } from '@app/admin/api/item-api.service';
import { ItemsService } from '@app/admin/service/items.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RecordUiService, Nl2brPipe } from '@rero/ng-core';
import { AppStore, InheritedCallNumberComponent, AvailabilityComponent, ItemHoldingsCallNumberPipe, SafeUrlPipe } from '@rero/shared';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { cloneDeep } from 'lodash-es';
import { forkJoin } from 'rxjs';
import { ItemRequestComponent } from '../../item-request/item-request.component';
import { RecordMaskedComponent } from '../../../record-masked/record-masked.component';
import { DocumentDetailStore } from '../../store/document-detail.store';
import { RouterLink } from '@angular/router';
import { HoldingItemNoteComponent } from '../holding-item-note/holding-item-note.component';
import { HoldingItemTemporaryItemTypeComponent } from '../holding-item-temporary-item-type/holding-item-temporary-item-type.component';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ItemInCollectionPipe } from '../../../../../pipe/item-in-collection.pipe';

@Component({
    selector: 'admin-default-holding-item',
    templateUrl: './default-holding-item.component.html',
    imports: [TranslateDirective, RecordMaskedComponent, RouterLink, InheritedCallNumberComponent, AvailabilityComponent, HoldingItemNoteComponent, HoldingItemTemporaryItemTypeComponent, Bind, Button, Tooltip, AsyncPipe, JsonPipe, TranslatePipe, ItemHoldingsCallNumberPipe, Nl2brPipe, SafeUrlPipe, ItemInCollectionPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultHoldingItemComponent implements OnInit {

  public itemApiService: ItemApiService = inject(ItemApiService);
  protected recordUiService: RecordUiService = inject(RecordUiService);
  protected recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  protected appStore = inject(AppStore);
  protected itemService: ItemsService = inject(ItemsService);
  protected translateService: TranslateService = inject(TranslateService);
  protected documentDetailStore = inject(DocumentDetailStore);
  private dialogService: DialogService = inject(DialogService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Holding record */
  holding = input<any>();
  /** Item Record (input) */
  item = input<any>(undefined);
  /** Event for delete Item */
  deleteItem = output<any>();
  /** Restrict the functionality of interface */
  isCurrentOrganisation = input(true);

  /** Item record (writable, updated after request) */
  // TODO: refactor to use structuredClone when lodash-es dependency is removed
  editableItem = linkedSignal(() => {
    const item = this.item();
    return item ? cloneDeep(item) : item;
  });
  /** Item permissions */
  permissions = signal<any>(undefined);

  // GETTER & SETTER ==========================================================
  /** Current interface language */
  get language() {
    return this.translateService.getCurrentLang();
  }

  /**
   * Get the number of pending request on this item
   * @returns number of request related to this item.
   */
  get itemRequestCounter(): number {
    return (this.editableItem().metadata.availability && this.editableItem().metadata.availability.request)
      ? this.editableItem().metadata.availability.request
      : 0;
  }

  /** Message containing the reasons why the item cannot be deleted. */
  get deleteInfoMessage(): string {
    return this.recordPermissionService.generateTooltipMessage(this.permissions()?.delete?.reasons, 'delete');
  }

  /** Message containing the reasons wht the item cannot be requested. */
  get cannotRequestInfoMessage(): string {
    return this.recordPermissionService.generateTooltipMessage(this.permissions()?.canRequest?.reasons, 'request');
  }

  /** OnInit hook */
  ngOnInit(): void {
    if (this.isCurrentOrganisation()) {
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
    const ref = this.dialogService.open(ItemRequestComponent,{
      header: this.translateService.instant('Item Request'),
      modal: true,
      width: '30vw',
      closable: true,
      data: { recordPid, recordType }
    }) as DynamicDialogRef;
    ref.onClose.subscribe((value: boolean) => {
      if (value) {
        this.itemService.getByPidFromEs(recordPid).subscribe(result => {
          this.editableItem.set(cloneDeep(result));
          this._getPermissions();
        });
      }
    });
  }

  /**
   * Delete item
   * @param itemPid - Item pid
   */
  delete(): void {
    this.deleteItem.emit(this.editableItem());
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================
  /** Get permissions */
  private _getPermissions(): void {
    const permissionObs$ = this.recordPermissionService.getPermission('items', this.editableItem().metadata.pid);
    const canRequestObs$ = this.itemService.canRequest(this.editableItem().metadata.pid);
    forkJoin([permissionObs$, canRequestObs$]).subscribe(
      ([permissions, canRequest]) => {
        // DEV NOTES :: Why using switch location.
        //   The item permissions returned by server could be limited by the `membership` method. This method check if the item owning
        //   library is the same as current UI used library. So the switch library button should be displayed if the user may edit the item
        //   but are not using the same library as item owning library.
        const switchLocation = {can: permissions.update ? permissions.update.can : false };
        const resolved = this.recordPermissionService.membership(this.appStore.currentLibraryPid(), this.editableItem().metadata.library.pid, permissions);
        // membership() restricts delete to same-library, but delete should be allowed across
        // libraries within the current organisation — restore the server-side delete permission.
        resolved.delete = permissions.delete;
        resolved.switchLocation = switchLocation;
        resolved.canRequest = canRequest;
        this.permissions.set(resolved);
      });
  }

}
