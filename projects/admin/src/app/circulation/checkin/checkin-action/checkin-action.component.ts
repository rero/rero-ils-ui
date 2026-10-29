// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog';

@Component({
  selector: 'admin-checkin-action',
  templateUrl: './checkin-action.component.html',
  imports: [Bind, Button, TranslatePipe],
})
export class CheckinActionComponent {
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);

  /** Checkin action */
  public action: 'patron' | 'item';

  /**
   * Set checkin action selected by user
   * @param action - string
   */
  setAction(action: 'patron' | 'item') {
    this.action = action;
    this.dynamicDialogRef.close(action);
  }

  checkinItemOnEnterKey(event: any) {
    if (event.key === 'Enter') {
      this.setAction('item');
    }
  }

  /** Close modal box */
  closeModal() {
    this.dynamicDialogRef.close();
  }
}
