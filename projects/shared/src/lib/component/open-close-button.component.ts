// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, OnChanges, output, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';

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
    imports: [Bind, Button],
  changeDetection: ChangeDetectionStrategy.OnPush
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
