// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DateTranslatePipe, GetRecordPipe, RecordService } from '@rero/ng-core';
import { ContributionComponent, MainTitlePipe } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ItemsService } from '../../../../service/items.service';
import { CancelRequestButtonComponent } from '../../cancel-request-button.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'admin-pickup-item',
  templateUrl: './pickup-item.component.html',
  imports: [RouterLink, Bind, Tag, ContributionComponent, CancelRequestButtonComponent, AsyncPipe, DateTranslatePipe, GetRecordPipe, MainTitlePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickupItemComponent {

  private recordService = inject(RecordService);
  private itemService = inject(ItemsService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Loan */
  loan = input<any>(undefined);
  /** Informs parent component to remove request when it is cancelled */
  cancelRequestEvent = output<any>();

  private readonly loanData = toSignal(
    toObservable(this.loan).pipe(
      switchMap(loan => {
        if (!loan) {
          return of(null);
        }
        const item$ = this.itemService.getItem(loan.metadata.item.barcode, loan.metadata.paton_pid);
        const doc$ = this.recordService.getRecord('documents', loan.metadata.item.document.pid, {
          resolve: 1,
          headers: { Accept: 'application/rero+json' }
        });
        return forkJoin([item$, doc$]).pipe(
          map(([itemData, documentData]: [any, any]) => ({ item: itemData, document: documentData.metadata }))
        );
      })
    ),
    { initialValue: null }
  );

  readonly item = computed(() => this.loanData()?.item ?? null);
  readonly document = computed(() => this.loanData()?.document ?? null);

  /**
   * Emit a new cancel request
   * @param loanPid - The current loan pid
   */
  cancelRequest(loanPid: string): void {
    this.cancelRequestEvent.emit(loanPid);
  }
}
