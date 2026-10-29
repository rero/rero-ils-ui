// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Bind } from '@openng/optimus-ui/bind';
import { Button, ButtonSeverity } from '@openng/optimus-ui/button';
import { Tooltip } from '@openng/optimus-ui/tooltip';
import { Nl2brPipe } from '@rero/ng-core';

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
          [queryParams]="queryParams()" />
      } @else {
        <p-button
          [label]="label()"
          [icon]="icon()"
          [title]="title()"
          [severity]="severity()"
          [class]="class()"
          [outlined]="outlined()"
          size="small"
          (onClick)="onClick($event)" />
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
        (onClick)="onClick($event)" />
      <ng-template #tooltipContent>
        <span [innerHTML]="message() | nl2br"></span>
      </ng-template>
    }
  `,
  imports: [Bind, Button, Tooltip, RouterLink, NgClass, Nl2brPipe],
})
export class ActionButtonComponent {
  label = input<string>();
  icon = input<string>();
  title = input.required<string>();
  severity = input<ButtonSeverity>('primary');
  routerLink = input<string[]>();
  queryParams = input<Record<string, string | number | boolean>>();
  class = input<string>();
  outlined = input<boolean>(true);
  rounded = input<boolean>(false);
  disabled = input<boolean>(false);
  message = input<string>();
  btnClick = output<Event>();

  onClick($event: Event): void {
    if (!this.disabled()) {
      this.btnClick.emit($event);
    }
  }
}
