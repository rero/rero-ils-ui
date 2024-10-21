/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { Component, input, OnChanges, output, signal, SimpleChanges } from '@angular/core';

@Component({
  selector: 'shared-open-close-button',
  template: `
  <p-button
    [icon]="internalStatus ? 'fa fa-caret-right' : 'fa fa-caret-down'"
    [outlined]="true"
    [rounded]="true"
    severity="secondary"
    (onClick)="updateStatus()"
  />
  `
})
export class OpenCloseButtonComponent implements OnChanges {

  collapsed = input<boolean>(true);

  status = output<boolean>();

  internalStatus: boolean = true;

  ngOnChanges(changes: SimpleChanges): void {
    this.internalStatus = changes.collapsed.currentValue;
  }

  updateStatus(): void {
    this.internalStatus = !this.internalStatus;
    this.status.emit(this.internalStatus);
  }
}
