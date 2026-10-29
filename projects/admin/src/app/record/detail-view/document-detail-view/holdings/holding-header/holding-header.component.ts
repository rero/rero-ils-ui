// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HoldingsService } from '@app/admin/service/holdings.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { DialogService, DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog';
import { Tooltip } from '@openng/optimus-ui/tooltip';
import { Nl2brPipe } from '@rero/ng-core';
import { AppStore, EsRecord, GetTranslatedLabelPipe } from '@rero/shared';
import { forkJoin } from 'rxjs';

import { RecordMaskedComponent } from '../../../record-masked/record-masked.component';
import { ItemRequestComponent } from '../../item-request/item-request.component';
import { DocumentDetailStore } from '../../store/document-detail.store';
import { HoldingDetailComponent } from '../holding-detail/holding-detail.component';

@Component({
  selector: 'admin-holding-header',
  templateUrl: './holding-header.component.html',
  imports: [
    RecordMaskedComponent,
    Bind,
    Button,
    RouterLink,
    Tooltip,
    HoldingDetailComponent,
    TranslatePipe,
    GetTranslatedLabelPipe,
    Nl2brPipe,
  ],
})
export class HoldingHeaderComponent implements OnInit {
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private holdingService: HoldingsService = inject(HoldingsService);
  private appStore = inject(AppStore);
  private translateService: TranslateService = inject(TranslateService);
  private dialogService: DialogService = inject(DialogService);
  protected documentDetailStore = inject(DocumentDetailStore);

  holding = input.required<EsRecord>();
  isCurrentOrganisation = input.required<boolean>();

  deleteHolding = output<EsRecord>();

  /** shortcut for holding type */
  holdingType: 'electronic' | 'serial' | 'standard';
  /** Holding permissions */
  permissions = signal<any>(undefined);

  get language(): string {
    return this.translateService.getCurrentLang();
  }

  get cannotRequestInfoMessage(): string {
    return this.recordPermissionService.generateTooltipMessage(this.permissions()?.canRequest?.reasons, 'request');
  }

  get deleteInfoMessage(): string {
    return this.recordPermissionService.generateTooltipMessage(this.permissions()?.delete?.reasons, 'delete');
  }

  /** onInit hook */
  ngOnInit() {
    this.holdingType = this.holding().metadata.holdings_type;
    if (this.isCurrentOrganisation()) {
      this._getPermissions();
    }
  }

  addRequest(recordPid: string, recordType: string): void {
    const ref: DynamicDialogRef = this.dialogService.open(ItemRequestComponent, {
      header: this.translateService.instant('Holdings Request'),
      modal: true,
      width: '30vw',
      closable: true,
      data: { recordPid, recordType },
    });
    ref.onClose.subscribe((value?: boolean) => {
      if (value) {
        this._getPermissions();
      }
    });
  }

  delete() {
    this.deleteHolding.emit(this.holding());
  }

  private _getPermissions(): void {
    const permissionObs = this.recordPermissionService.getPermission('holdings', this.holding().metadata.pid);
    const canRequestObs = this.holdingService.canRequest(this.holding().metadata.pid);
    forkJoin([permissionObs, canRequestObs]).subscribe(([permissions, canRequest]) => {
      const resolved = this.recordPermissionService.membership(
        this.appStore.currentLibraryPid(),
        this.holding().metadata.library.pid,
        permissions,
      );
      resolved.canRequest = canRequest;
      this.permissions.set(resolved);
    });
  }
}
