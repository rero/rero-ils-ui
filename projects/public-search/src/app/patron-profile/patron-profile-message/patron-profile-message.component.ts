// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, effect, inject, signal, untracked } from '@angular/core';
import type { ToastMessageOptions } from '@openng/optimus-ui/api';
import { MessageModule } from '@openng/optimus-ui/message';

import { Message, PatronApiService } from '../../api/patron-api.service';
import { PatronProfileStore } from '../store/patron-profile.store';

@Component({
  selector: 'public-search-patron-profile-message',
  template: `
    @for (message of messages(); track $index) {
      <p-message styleClass="ui:mb-2" [severity]="$any(message.severity)" showTransitionOptions="0ms">
        {{ message.text }}
      </p-message>
    }
  `,
  imports: [MessageModule],
})
export class PatronProfileMessageComponent {
  private patronApiService = inject(PatronApiService);
  private store = inject(PatronProfileStore);

  readonly messages = signal<ToastMessageOptions[]>([]);

  constructor() {
    effect(() => {
      const patron = this.store.currentPatron();
      if (patron) {
        untracked(() => this._loanMessage(patron.pid));
      }
    });
  }

  private _loanMessage(patronPid: string): void {
    this.patronApiService.getMessages(patronPid).subscribe((messages: Message[]) => {
      this.messages.set(
        messages.map((message: Message): ToastMessageOptions => ({
          text: message.content,
          severity: message.type,
        })),
      );
    });
  }
}
