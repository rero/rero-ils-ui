/*
 * RERO ILS UI
 * Copyright (C) 2021 UCLouvain
 * Copyright (C) 2021 RERO
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
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-action-button',
  template: `
    <ng-container *ngIf="!disabled; else disabledInfo">
      <ng-container *ngIf="url && url.length > 0; else clickButton">
        <button type="button" class="btn btn-sm {{ class }}" [title]="title" [routerLink]="url" [queryParams]="queryParams">
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </button>
      </ng-container>
      <ng-template #clickButton>
        <button type="button" class="btn btn-sm {{ class }}" [title]="title" (click)="onClick($event)">
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </button>
      </ng-template>
    </ng-container>
    <ng-template #disabledInfo>
      <button type="button" class="btn btn-sm disabled {{ class }}"
              [title]="title" [popover]="tolTemplate" triggers="mouseenter:mouseleave">
        <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
      </button>
      <ng-template #tolTemplate><div [innerHtml]="message | nl2br"></div></ng-template>
    </ng-template>
    <ng-template #contentTpl><ng-content></ng-content></ng-template>
  `
})
export class ActionButtonComponent {
  @Input() title: string;
  @Input() url?: string[];
  @Input() queryParams?: any;
  @Input() class?: string;
  @Input() disabled = false;
  @Input() message?: string;
  @Output() btnClick = new EventEmitter();

  onClick($event: Event): void {
    if (!this.disabled) {
      this.btnClick.emit($event);
    }
  }
}
