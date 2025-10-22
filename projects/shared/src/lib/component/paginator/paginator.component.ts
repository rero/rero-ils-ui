/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
import { Component, input, output } from '@angular/core';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { PaginatorConfig } from './model/paginator-model';

@Component({
  selector: 'shared-paginator',
  imports: [Paginator],
  template: `
    <p-paginator
      dropdownAppendTo="body"
      alwaysShow="false"
      [first]="paginatorState().first"
      [rows]="paginatorState().rows"
      [totalRecords]="paginatorState().total"
      [rowsPerPageOptions]="[10, 20, 50]"
      (onPageChange)="pageChange.emit($event)" />
  `
})
export class PaginatorComponent {

  paginatorState = input.required<PaginatorConfig>();

  pageChange = output<PaginatorState>();
}
