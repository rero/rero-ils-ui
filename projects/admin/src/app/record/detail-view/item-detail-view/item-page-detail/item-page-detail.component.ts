// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, computed, DestroyRef, inject, signal, ChangeDetectionStrategy} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { IssueService } from '@app/admin/service/issue.service';
import { OperationLogsDialogComponent } from '@rero/shared';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { DetailComponent, DetailButtonComponent, ErrorComponent } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { of, switchMap, tap } from 'rxjs';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
@Component({
    selector: 'admin-item-page-detail',
    templateUrl: './item-page-detail.component.html',
    imports: [DetailButtonComponent, Bind, Button, TranslateDirective, OperationLogsDialogComponent, ErrorComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemPageDetailComponent extends DetailComponent {
  private readonly _destroyRef = inject(DestroyRef);
  private issueService: IssueService = inject(IssueService);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  protected appStore = inject(AppStore);

  readonly recordPermissions = toSignal(
    toObservable(this.record as any).pipe(
      switchMap((record: any) => {
        const pid = record?.metadata?.pid;
        if (!pid) return of(null);
        return this.recordPermissionService.getPermission('items', pid).pipe(
          tap((permission) => {
            this._recordPermissionsValue.set(
              this.recordPermissionService.membership(
                this.appStore.currentLibraryPid(),
                record?.metadata?.library?.pid,
                permission
              )
            );
          })
        );
      })
    ),
    { initialValue: null }
  );
  private readonly _recordPermissionsValue = signal<any>(null);
  readonly resolvedRecordPermissions = computed(() => this._recordPermissionsValue());

  /**
   * Is this record is an issue
   * @return True if the record is an issue ; false otherwise
   */
  get isIssue(): boolean {
    return (this.record() as any)?.metadata?.type === 'issue';
  }

  /** Allow claim (show button) */
  get isClaimAllowed(): boolean {
    return this.issueService.isClaimAllowed((this.record() as any)?.metadata?.issue?.status);
  }

  /** Open claim dialog */
  openClaimEmailDialog(): void {
    const ref: DynamicDialogRef = this.issueService.openClaimEmailDialog(this.record());
    ref.onClose.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((record: any) => {
      if (record) {
        // Force re-fetch by navigating to the same page
        this.router.navigate([], { relativeTo: this.route });
      }
    });
  }
}
