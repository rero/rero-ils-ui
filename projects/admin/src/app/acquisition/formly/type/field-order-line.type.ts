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

import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { extractIdOnRef, RecordService } from '@rero/ng-core';
import { map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'admin-formly-order-line-type',
  template: `
    @if (document) {
    <div class="ui:flex ui:gap-2">
      <div class="ui:grow-1">
        <shared-document-brief-view [record]="document" />
        <admin-notes class="ui:text-sm" [notes]="orderLine.notes"/>
      </div>
      @if(orderLine.priority) {
        <div class="ui:flex">
          <p-overlaybadge [value]="orderLine.priority" [severity]="severity(this.orderLine.priority)">
            <i class="fa fa-tachometer" style="font-size: 1.2rem"></i>
          </p-overlaybadge>
        </div>
      }
    </div>
    }
  `,
  standalone: false,
})
export class OrderLineTypeComponent extends FieldType implements OnInit {
  private recordService: RecordService = inject(RecordService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  /** record */
  orderLine: any;
  document: any;

  /** OnInit hook */
  ngOnInit(): void {
    const pid = extractIdOnRef(this.model.acqOrderLineRef);
    this.recordService
      .getRecord('acq_order_lines', pid)
      .pipe(
        tap((line) => (this.orderLine = line.metadata)),
        map(() => extractIdOnRef(this.orderLine.document.$ref)),
        switchMap((pid) => this.recordService.getRecord('documents', pid)),
        tap((document) => (this.document = document.metadata)),
        tap(() => this.changeDetectorRef.detectChanges())
      )
      .subscribe();
  }

  severity(priority: number): string {
    switch (priority) {
      case 2:
        return 'primary';
      case 3:
        return 'info';
      case 4:
        return 'warn';
      case 5:
        return 'danger';
      default:
        return 'success';
    }
  }
}
