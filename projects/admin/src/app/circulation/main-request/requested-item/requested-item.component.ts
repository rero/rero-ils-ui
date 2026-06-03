/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LoanState } from '@app/admin/classes/loans';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe, RecordService } from '@rero/ng-core';
import { ContributionComponent, IdAttributePipe, InheritedCallNumberComponent, MainTitlePipe, OpenCloseButtonComponent } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { map, of, switchMap } from 'rxjs';

@Component({
    selector: 'admin-requested-item',
    templateUrl: './requested-item.component.html',
    imports: [NgClass, OpenCloseButtonComponent, RouterLink, ContributionComponent, InheritedCallNumberComponent, Bind, Button, TranslateDirective, DateTranslatePipe, IdAttributePipe, MainTitlePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestedItemComponent {

  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES ====================================================

  // Input/Output attributes
  /** requested item */
  item = input<any>();
  /** Is the detail should be collapsed */
  isCollapsed = model<boolean>();
  /** the callout css class to use for this item */
  callout = input<string|undefined>(undefined);
  /** Event emit when a request is validate */
  requestValidated = output<string>();

  // Class attributes
  /** reference to LoanState class :: To use LoanState into template */
  LoanState = LoanState;
  /** document related to the item */
  document = toSignal(toObservable(this.item).pipe(
      switchMap(item => {
        if (!item?.loan?.document_pid) {
          return of(null);
        }

        return this.recordService.getRecord(
          'documents',
          item.loan.document_pid,
          {
            resolve: 1,
            headers: { Accept: 'application/rero+json, application/json' }
          }
        );
      }),
      map(d => d?.metadata ?? null)
    ),
    { initialValue: null }
  );

  // COMPONENT FUNCTIONS ====================================================
  /** Validate a request */
  validateRequest() {
    this.requestValidated.emit(this.item().barcode);
  }

  /** Get the callout css code if needed.
   *  The callout css is used to highlight a request for a particular reason (new request, validated request, ...)
   */
  getCallout() {
    return (this.callout() !== undefined)
      ? `callout ${this.callout()}`
      : undefined;
  }
}
