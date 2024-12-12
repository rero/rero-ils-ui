/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
 * Copyright (C) 2023 UCLouvain
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
import { Tools } from '@rero/shared';
import { ITypeEmail } from '../../IPreviewInterface';

@Component({
  selector: 'admin-preview-email',
  templateUrl: './preview-email.component.html'
})
export class PreviewEmailComponent {

  /** Suggested emails */
  @Input() emails: string[];
  /** Email body text preview */
  @Input() preview: string;
  /** Preview position */
  @Input() previewPosition: 'top' | 'bottom' = 'top';
  /** Available types of destination */
  @Input() emailTypes: ('to' | 'cc' | 'bcc' | 'reply_to')[] = ['to', 'cc', 'bcc', 'reply_to'];
  /** Mandatory types */
  @Input() mandatoryEmailTypes: ('to' | 'cc' | 'bcc' | 'reply_to')[] = ['to'];
  /** Allows to pre-populate the recipients */
  @Input() set prePopulateRecipients(rep: ITypeEmail[]) {
    const keys = Object.keys(this.recipients);
    rep.forEach((el: ITypeEmail) => {
      if (keys.includes(el.type)) {
        this.recipients[el.type].push(el.address);
      }
    });
  }
  /** Event to transmit email address recipients */
  @Output() data = new EventEmitter<ITypeEmail[]>();
  /** Event to allow closing the dialog */
  @Output() closeDialog = new EventEmitter<boolean>(false);

  /** Email address that is in drag mode */
  draggedEmail: string;

  /** Recipients */
  recipients = { to: [], cc: [], bcc: [], reply_to: [] };

  /**
   * Drag start
   * @param email - string
   */
  dragStart(email: string): void {
    this.draggedEmail = email;
  }

  /** Drag end */
  dragEnd(): void {
    this.draggedEmail = null;
  }

  /**
   * Adding the email address to a specific recipient.
   * @param field - DragEvent
   */
  drop(field: DragEvent): void {
    if (this.draggedEmail) {
      const fieldId = field.target['id'];
      if (fieldId && !this.recipients[fieldId].some((email: string) => email === this.draggedEmail)) {
        this.recipients[fieldId].push(this.draggedEmail);
      }
    }
  }

  /** Closing the dialog */
  close(): void {
    this.closeDialog.emit(true);
  }

  /**
   * Confirmation of dialogue data.
   * Transformation of simple email addresses into TypeEmail type and data transmission.
   * The closing of the dialog takes place in the parent if the transmitted data are valid.
   */
  confirm(): void {
    const recipients = [];
    Object.keys(this.recipients).forEach((key: string) => this.recipients[key].every((email: string) => recipients.push({ type: key, address: email })));
    this.data.emit(recipients);
  }

  /**
   * Data validation.
   * @returns true if the data of the containers are valid.
   */
  formValid(): boolean {
    // Validation of the mandatory types
    if (!this.mandatoryEmailTypes.every((key: string) => this.recipients[key].length > 0)) {
      return false;
    }
    // Validation of all email addresses of each recipient
    return Object.keys(this.recipients).every((key: string) => this.recipients[key].every(email => Tools.validateEmail(email)));
  }
}
