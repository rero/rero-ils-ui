// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DocumentApiService } from '@app/admin/api/document-api.service';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Tag } from '@openng/optimus-ui/tag';
import { RecordService } from '@rero/ng-core';
import { ActionButtonComponent, AppStore, DocumentBriefViewComponent, OpenCloseButtonComponent } from '@rero/shared';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AcqOrderApiService } from '../../../../api/acq-order-api.service';
import { AcqOrderLineStatus, IAcqOrderLine } from '../../../../classes/order';
import { NoteBadgeColorPipe } from '../../../../pipes/note-badge-color.pipe';
import { NotesComponent } from '../../../notes/notes.component';

@Component({
  selector: 'admin-order-line',
  templateUrl: './order-line.component.html',
  imports: [
    OpenCloseButtonComponent,
    NgClass,
    DocumentBriefViewComponent,
    Bind,
    Tag,
    NotesComponent,
    ActionButtonComponent,
    RouterLink,
    CurrencyPipe,
    TranslatePipe,
    NoteBadgeColorPipe,
  ],
})
export class OrderLineComponent {
  private recordPermissionService = inject(RecordPermissionService);
  private recordService = inject(RecordService);
  private documentApiService = inject(DocumentApiService);
  private acqOrderApiService = inject(AcqOrderApiService);
  private appStore = inject(AppStore);

  orderLine = input.required<IAcqOrderLine>();
  order = input<any>();

  isCollapsed = true;
  readonly orderLineStatus = AcqOrderLineStatus;

  private readonly lineData = toSignal(
    toObservable(this.orderLine).pipe(
      switchMap((line) =>
        forkJoin([
          this.recordPermissionService
            .getPermission('acq_order_lines', line.pid)
            .pipe(map((p) => this.appStore.validateLibraryPermissions(p, this.order()?.library?.pid ?? ''))),
          this.recordService.getRecord('acq_accounts', line.acq_account.pid),
          this.documentApiService.getDocument(line.document.pid).pipe(catchError(() => of(null))),
        ]),
      ),
    ),
  );

  readonly recordPermissions = computed(() => this.lineData()?.[0] as RecordPermissions | undefined);
  readonly account = computed(() => this.lineData()?.[1]);
  readonly document = computed(() => this.lineData()?.[2]);

  get deleteInfoMessage(): string | null {
    return !this.recordPermissions()?.delete?.can
      ? (this.recordPermissionService.generateTooltipMessage(this.recordPermissions()?.delete?.reasons, 'delete') ??
          null)
      : null;
  }

  deleteOrderLine(): void {
    this.acqOrderApiService.deleteOrderLine(this.orderLine());
  }

  severity(): 'success' | 'secondary' | 'info' | 'warn' | 'danger' {
    switch (this.orderLine().priority) {
      case 2:
        return 'success';
      case 3:
        return 'info';
      case 4:
        return 'warn';
      case 5:
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
