// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';

@Component({
  selector: 'shared-open-close-button',
  template: `
    <p-button
      [styleClass]="styleClass()"
      [icon]="internalStatus ? 'fa-solid fa-caret-right' : 'fa-solid fa-caret-down'"
      outlined
      [rounded]="true"
      severity="secondary"
      (onClick)="updateStatus()" />
  `,
  imports: [Bind, Button],
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
