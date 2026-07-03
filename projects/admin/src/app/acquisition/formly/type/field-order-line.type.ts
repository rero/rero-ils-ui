// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ChangeDetectorRef, Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { extractIdOnRef, RecordService } from '@rero/ng-core';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { DocumentBriefViewComponent } from '@rero/shared';
import { NotesComponent } from '../../components/notes/notes.component';
import { Bind } from 'primeng/bind';
import { OverlayBadge } from 'primeng/overlaybadge';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-formly-order-line-type',
    template: `
    @if (orderLine) {
      <div class="ui:flex ui:gap-2">
        <div class="ui:grow-1">
          @if (document) {
            <shared-document-brief-view [record]="document" />
          } @else if (document === null) {
            <span class="ui:text-muted-color"><i class="fa-solid fa-triangle-exclamation"></i>&nbsp;{{ "Unknown document" | translate }} (pid {{ documentPid }})</span>
          }
          <admin-notes class="ui:text-sm" [notes]="$any(orderLine.notes)"/>
        </div>
        @if(orderLine.priority) {
          <div class="ui:flex">
            <p-overlaybadge [value]="orderLine.priority" [severity]="$any(severity(orderLine.priority))">
              <i class="fa-solid fa-gauge-high" style="font-size: 1.2rem"></i>
            </p-overlaybadge>
          </div>
        }
      </div>
    }
  `,
    imports: [
        DocumentBriefViewComponent,
        NotesComponent,
        Bind,
        OverlayBadge,
        TranslatePipe,
    ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderLineTypeComponent extends FieldType implements OnInit {
  private recordService: RecordService = inject(RecordService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  /** record */
  orderLine: any;
  document: any;

  get documentPid(): string | null {
    return this.orderLine ? extractIdOnRef(this.orderLine.document.$ref) : null;
  }

  /** OnInit hook */
  ngOnInit(): void {
    const pid = extractIdOnRef(this.model.acqOrderLineRef);
    this.recordService
      .getRecord('acq_order_lines', pid)
      .pipe(
        tap((line) => (this.orderLine = line.metadata)),
        map(() => extractIdOnRef(this.orderLine.document.$ref)),
        switchMap((pid) =>
          this.recordService.getRecord('documents', pid).pipe(
            catchError(() => of(null))
          )
        ),
        tap((document) => (this.document = document?.metadata ?? null)),
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
