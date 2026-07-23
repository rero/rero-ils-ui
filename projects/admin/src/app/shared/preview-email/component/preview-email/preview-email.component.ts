// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Tools } from '@rero/shared';
import { AutoComplete } from 'primeng/autocomplete';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { Draggable, Droppable } from 'primeng/dragdrop';
import { Panel } from 'primeng/panel';
import { Tag } from 'primeng/tag';
import { ITypeEmail } from '../../IPreviewInterface';

export type RecipientType = 'to' | 'cc' | 'bcc' | 'reply_to';

@Component({
    selector: 'admin-preview-email',
    templateUrl: './preview-email.component.html',
    imports: [NgTemplateOutlet, TranslateDirective, Bind, Panel, Tag, Draggable, AutoComplete, Droppable, FormsModule, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewEmailComponent {

  /** Suggested emails */
  emails = input<string[]>([]);
  /** Email body text preview */
  preview = input<string>();
  /** Preview position */
  previewPosition = input('top');
  /** Available types of destination */
  emailTypes = input<RecipientType[]>(['to', 'cc', 'bcc', 'reply_to']);
  /** Mandatory types */
  mandatoryEmailTypes = input<RecipientType[]>(['to']);
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
  recipients: Record<RecipientType, string[]> = { to: [], cc: [], bcc: [], reply_to: [] };

  constructor() {
    effect(() => {
      const rep = this.prePopulateRecipients();
      if (rep) {
        const keys = Object.keys(this.recipients) as RecipientType[];
        const recipients: Record<RecipientType, string[]> = { to: [], cc: [], bcc: [], reply_to: [] };
        rep.forEach((el: ITypeEmail) => {
          const type = el.type as RecipientType;
          if (keys.includes(type) && !recipients[type].includes(el.address)) {
            recipients[type].push(el.address);
          }
        });
        this.recipients = recipients;
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
   * @param event - DragEvent
   * @param type - Recipient type the email is dropped onto
   */
  drop(event: DragEvent, type: RecipientType): void {
    if (this.draggedEmail) {
      event.preventDefault();
      const recipients = this.recipients[type];
      if (!recipients.some((email: string) => email === this.draggedEmail)) {
        this.recipients[type] = [...recipients, this.draggedEmail];
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
    const recipients: ITypeEmail[] = [];
    (Object.keys(this.recipients) as RecipientType[]).forEach((key) => this.recipients[key].every((email: string) => recipients.push({ type: key, address: email })));
    this.data.emit(recipients);
  }

  /**
   * Data validation.
   * @returns true if the data of the containers are valid.
   */
  formValid(): boolean {
    // Validation of the mandatory types
    if (!this.mandatoryEmailTypes().every((key: RecipientType) => this.recipients[key].length > 0)) {
      return false;
    }
    // Validation of all email addresses of each recipient
    return (Object.keys(this.recipients) as RecipientType[]).every((key) => this.recipients[key].every(email => Tools.validateEmail(email)));
  }

  onBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    if(inputValue) {
      inputElement?.dispatchEvent(new KeyboardEvent('keydown', { 'code': 'Enter' } ));
    }
  }
}
