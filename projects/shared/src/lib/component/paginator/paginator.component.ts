// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, output, ChangeDetectionStrategy} from '@angular/core';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { Pager } from './model/paginator-model';

@Component({
  selector: 'shared-paginator',
  imports: [Paginator],
  template: `
    <p-paginator
      appendTo="body"
      [alwaysShow]="alwaysShow()"
      [first]="pager().first"
      [rows]="pager().rows"
      [totalRecords]="total()"
      [rowsPerPageOptions]="pager().rowsPerPageOptions"
      (onPageChange)="pageChange.emit($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {

  pager = input.required<Pager>();

  total = input.required<number>();

  alwaysShow = input<boolean>(false);

  pageChange = output<PaginatorState>();
}
