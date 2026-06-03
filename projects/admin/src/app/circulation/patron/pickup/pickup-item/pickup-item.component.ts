/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
