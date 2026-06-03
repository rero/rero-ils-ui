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
import { Component, computed, DestroyRef, effect, inject, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { LoanService } from '@app/admin/service/loan.service';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { CONFIG } from '@rero/ng-core';
import { AppStore, IPermissions, PERMISSIONS, PermissionsDirective } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { forkJoin, of, switchMap } from 'rxjs';
import { ItemRequestComponent } from '../../document-detail-view/item-request/item-request.component';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { ItemTransactionComponent } from '../item-transaction/item-transaction.component';
import { Button } from 'primeng/button';

@Component({
    selector: 'admin-item-transactions',
    templateUrl: './item-transactions.component.html',
    imports: [Bind, Panel, PermissionsDirective, TranslateDirective, ItemTransactionComponent, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemTransactionsComponent {

  private messageService: MessageService = inject(MessageService);
  private dialogService: DialogService = inject(DialogService);
  private loanService: LoanService = inject(LoanService);
  private translateService: TranslateService = inject(TranslateService);
  private appStore = inject(AppStore);

  readonly itemPid = input<string>();
  readonly requestEvent = output<any>();

  readonly permissions: IPermissions = PERMISSIONS;

  private readonly _loans = toSignal(
    toObservable(this.itemPid).pipe(
      switchMap(pid => pid
        ? forkJoin([this.loanService.borrowedBy$(pid), this.loanService.requestedBy$(pid)])
        : of([[], []])
      )
    ),
    { initialValue: [[], []] }
  );

  readonly borrowedBy = computed(() => this._loans()[0] as any[]);
  readonly requestedBy = signal<any[]>([]);

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => this.requestedBy.set(this._loans()[1] as any[]));
  }

  // COMPONENTS FUNCTIONS =====================================================
  /**
   * Add request on this item
   */
  addRequest(): void {
    const ref = this.dialogService.open(ItemRequestComponent, {
      header: this.translateService.instant('Item request'),
      modal: true,
      width: '40vw',
      closable: true,
      data: { recordPid: this.itemPid(), recordType: 'item' }
    });
    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: boolean) => {
      if (value) {
        this.requestEvent.emit(null);
        this._refreshRequestList();
      }
    });
  }

  /**
   * Cancel request
   * @param transaction - request to cancel
   */
  cancelRequest(transaction: any): void {
    this.loanService
      .cancelLoan(this.itemPid(), transaction.metadata.pid, this.appStore.currentLibraryPid())
      .subscribe((_itemData: any) => {
        this.messageService.add({
          severity: 'warn',
          summary: this.translateService.instant('Request'),
          detail: this.translateService.instant('The pending request has been cancelled.'),
          life: CONFIG.MESSAGE_LIFE
        });
        this.requestEvent.emit(null);
        this._refreshRequestList();
      });
  }

  /**
   * Update request pickup location
   * @param data - pickup location pid to change
   */
  updateRequestPickupLocation(data: any): void {
    this.loanService
      .updateLoanPickupLocation(data.transaction.metadata.pid, data.pickupLocationPid)
      .subscribe(_result => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Request'),
          detail: this.translateService.instant('The pickup location has been changed.'),
          life: CONFIG.MESSAGE_LIFE
        });
        this._refreshRequestList();
      });
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================
  /**
   * Refresh the request list
   */
  private _refreshRequestList(): void {
    this.loanService
      .requestedBy$(this.itemPid())
      .subscribe(requestedLoans => this.requestedBy.set(requestedLoans));
  }
}
