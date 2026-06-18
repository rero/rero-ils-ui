// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, ChangeDetectionStrategy} from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';

@Component({
    selector: 'admin-checkin-action',
    templateUrl: './checkin-action.component.html',
    imports: [TranslateDirective, Bind, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
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
