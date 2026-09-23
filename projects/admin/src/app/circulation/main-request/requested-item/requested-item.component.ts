// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DocumentApiService } from '@app/admin/api/document-api.service';
import { LoanState } from '@app/admin/classes/loans';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';
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

  private documentApiService: DocumentApiService = inject(DocumentApiService);

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

        return this.documentApiService.getDocument(item.loan.document_pid);
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
