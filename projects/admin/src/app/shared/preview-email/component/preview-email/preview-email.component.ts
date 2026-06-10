/*
 * RERO ILS UI
 * Copyright (C) 2023-2025 RERO
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
import { Component, effect, input, output, signal, ChangeDetectionStrategy} from '@angular/core';
import { Tools } from '@rero/shared';
import { ITypeEmail } from '../../IPreviewInterface';
import { NgTemplateOutlet } from '@angular/common';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { Tag } from 'primeng/tag';
import { Draggable, Droppable } from 'primeng/dragdrop';
import { AutoComplete } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';

@Component({
    selector: 'admin-preview-email',
    templateUrl: './preview-email.component.html',
    imports: [NgTemplateOutlet, TranslateDirective, Bind, Panel, Tag, Draggable, AutoComplete, Droppable, FormsModule, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewEmailComponent {

  /** Suggested emails */
  emails = input<string[]>();
  /** Email body text preview */
  preview = input<string>();
  /** Preview position */
  previewPosition = input('top');
  /** Available types of destination */
  emailTypes = input(['to', 'cc', 'bcc', 'reply_to']);
  /** Mandatory types */
  mandatoryEmailTypes = input(['to']);
  /** Allows to pre-populate the recipients */
  prePopulateRecipients = input<ITypeEmail[]>();
  /** Event to transmit email address recipients */
  data = output<ITypeEmail[]>();
  /** Event to allow closing the dialog */
  closeDialog = output<boolean>();

  readonly isSending = signal(false);

  /** Email address that is in drag mode */
  draggedEmail: string | null = null;

  /** Recipients */
  recipients = { to: [], cc: [], bcc: [], reply_to: [] };

  constructor() {
    effect(() => {
      const rep = this.prePopulateRecipients();
      if (rep) {
        const keys = Object.keys(this.recipients);
        rep.forEach((el: ITypeEmail) => {
          if (keys.includes(el.type)) {
            this.recipients[el.type].push(el.address);
          }
        });
      }
    });
  }

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
    if (this.isSending()) { return; }
    this.isSending.set(true);
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
    if (!this.mandatoryEmailTypes().every((key: string) => this.recipients[key].length > 0)) {
      return false;
    }
    // Validation of all email addresses of each recipient
    return Object.keys(this.recipients).every((key: string) => this.recipients[key].every(email => Tools.validateEmail(email)));
  }

  onBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    if(inputValue) {
      inputElement?.dispatchEvent(new KeyboardEvent('keydown', { 'code': 'Enter' } ));
    }
  }
}
