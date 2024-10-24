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
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { forkJoin } from 'rxjs';
import { ItemsService } from '../../../../service/items.service';

@Component({
  selector: 'admin-pickup-item',
  templateUrl: './pickup-item.component.html'
})
export class PickupItemComponent implements OnInit {

  private recordService: RecordService = inject(RecordService);
  private itemService: ItemsService = inject(ItemsService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Loan */
  @Input() loan = undefined;
  /** Informs parent component to remove request when it is cancelled */
  @Output() cancelRequestEvent = new EventEmitter<any>();
  /** Item, document */
  item = undefined;
  document = undefined;

  /** OnInit hook */
  ngOnInit() {
    if (this.loan) {
      const item$ = this.itemService.getItem(this.loan.metadata.item.barcode, this.loan.metadata.paton_pid);
      const doc$ = this.recordService.getRecord('documents', this.loan.metadata.item.document.pid, 1, {Accept: 'application/rero+json'});
      forkJoin([item$, doc$]).subscribe(
        ([itemData, documentData]) => {
          this.item = itemData;
          this.document = documentData.metadata;
        }
      );
    }
  }

  /**
   * Emit a new cancel request
   * @param loanPid - The current loan pid
   */
  cancelRequest(loanPid: string): void {
    this.cancelRequestEvent.emit(loanPid);
  }
}
