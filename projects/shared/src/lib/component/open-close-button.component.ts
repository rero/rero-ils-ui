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
import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'shared-open-close-button',
    template: `
  <p-button
    [styleClass]="styleClass()"
    [icon]="internalStatus ? 'fa fa-caret-right' : 'fa fa-caret-down'"
    outlined
    [rounded]="true"
    severity="secondary"
    (onClick)="updateStatus()"
  />
  `,
    standalone: false
})
export class OpenCloseButtonComponent implements OnChanges {

  collapsed = input<boolean>(true);

  styleClass = input<string>('bg-white');

  status = output<boolean>();

  internalStatus = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.collapsed) {
      this.internalStatus = changes.collapsed.currentValue;
    }
  }

  updateStatus(): void {
    this.internalStatus = !this.internalStatus;
    this.status.emit(this.internalStatus);
  }
}
