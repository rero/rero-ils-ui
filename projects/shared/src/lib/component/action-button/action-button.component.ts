/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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

@Component({
  selector: 'shared-action-button',
  template: `
    @if (!disabled()) {
      @if (routerLink()?.length > 0) {
        <p-button
          [label]="label()"
          [icon]="icon()"
          [title]="title()"
          [severity]="severity()"
          [styleClass]="class()"
          [outlined]="outlined()"
          size="small"
          [routerLink]="routerLink()"
          [queryParams]="queryParams()"
        />
      } @else {
        <p-button
          [label]="label()"
          [icon]="icon()"
          [title]="title()"
          [severity]="severity()"
          [class]="class()"
          [outlined]="outlined()"
          size="small"
          (onClick)="onClick($event)"
        />
      }
    } @else {
      <p-button
        [label]="label()"
        [icon]="icon()"
        [title]="title()"
        [severity]="severity()"
        [style]="disabled() ? { opacity: 0.5 } : { opacity: 1 }"
        [ngClass]="class()"
        [outlined]="outlined()"
        [pTooltip]="tooltipContent"
        tooltipPosition="top"
        [tooltipDisabled]="message() ? false : true"
        size="small"
        (onClick)="onClick($event)"
      />
      <ng-template #tooltipContent>
        <span [innerHTML]="message() | nl2br"></span>
      </ng-template>
    }
  `
})
export class ActionButtonComponent {
  label = input<string>();
  icon = input<string>();
  title = input.required<string>();
  severity = input<string>('primary');
  routerLink = input<string[]>();
  queryParams = input<any>();
  class = input<string>();
  outlined = input<boolean>(true);
  rounded = input<boolean>(false);
  disabled = input<boolean>(false);
  message = input<string>();
  btnClick = output<Event>();

  onClick($event: Event): void {
    if (!this.disabled) {
      this.btnClick.emit($event);
    }
  }
}
