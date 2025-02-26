/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { Component, Input } from '@angular/core';
import { ExceptionDates, Library } from '@app/admin/classes/library';

@Component({
    selector: 'admin-exception-date',
    templateUrl: './exception-date.component.html',
    standalone: false
})
export class ExceptionDateComponent {
  @Input() exception: ExceptionDates;

  isOver(exception: ExceptionDates): boolean {
    return Library.isExceptionDateOver(exception);
  }
}
