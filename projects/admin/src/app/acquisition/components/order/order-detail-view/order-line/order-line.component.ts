// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { RecordService } from '@rero/ng-core';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AcqOrderApiService } from '../../../../api/acq-order-api.service';
import { AcqOrderLineStatus, IAcqOrderLine } from '../../../../classes/order';
import { AppStore, OpenCloseButtonComponent, DocumentBriefViewComponent, ActionButtonComponent } from '@rero/shared';
import { NgClass, CurrencyPipe } from '@angular/common';
import { Bind } from 'primeng/bind';
import { OverlayBadge } from 'primeng/overlaybadge';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NotesComponent } from '../../../notes/notes.component';
import { RouterLink } from '@angular/router';
import { NoteBadgeColorPipe } from '../../../../pipes/note-badge-color.pipe';

@Component({
    selector: 'admin-order-line',
    templateUrl: './order-line.component.html',
    imports: [OpenCloseButtonComponent, NgClass, DocumentBriefViewComponent, Bind, OverlayBadge, TranslateDirective, NotesComponent, ActionButtonComponent, RouterLink, CurrencyPipe, TranslatePipe, NoteBadgeColorPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderLineComponent {
  private recordPermissionService = inject(RecordPermissionService);
  private recordService = inject(RecordService);
  private acqOrderApiService = inject(AcqOrderApiService);
  private appStore = inject(AppStore);

  orderLine = input.required<IAcqOrderLine>();
  order = input<any>();

  isCollapsed = true;
  readonly orderLineStatus = AcqOrderLineStatus;

  private readonly lineData = toSignal(
    toObservable(this.orderLine).pipe(
      switchMap(line => forkJoin([
        this.recordPermissionService.getPermission('acq_order_lines', line.pid).pipe(
          map(p => this.appStore.validateLibraryPermissions(p, this.order()?.library?.pid ?? ''))
        ),
        this.recordService.getRecord('acq_accounts', line.acq_account.pid),
        this.recordService.getRecord('documents', line.document.pid).pipe(catchError(() => of(null)))
      ]))
    )
  );

  readonly recordPermissions = computed(() => this.lineData()?.[0] as RecordPermissions | undefined);
  readonly account = computed(() => this.lineData()?.[1]);
  readonly document = computed(() => this.lineData()?.[2]);

  get deleteInfoMessage(): string | null {
    return !this.recordPermissions()?.delete?.can
      ? this.recordPermissionService.generateTooltipMessage(this.recordPermissions()?.delete?.reasons, 'delete') ?? null
      : null;
  }

  deleteOrderLine(): void {
    this.acqOrderApiService.deleteOrderLine(this.orderLine());
  }

  severity(): string {
    switch (this.orderLine().priority) {
      case 2: return 'primary';
      case 3: return 'info';
      case 4: return 'warn';
      case 5: return 'danger';
      default: return 'success';
    }
  }
}
