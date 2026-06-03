/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { Component, effect, inject, signal, ChangeDetectionStrategy, untracked } from '@angular/core';
import type { ToastMessageOptions } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { Message, PatronApiService } from '../../api/patron-api.service';
import { PatronProfileStore } from '../store/patron-profile.store';

@Component({
    selector: 'public-search-patron-profile-message',
    template: `
    @for (message of messages(); track $index) {
      <p-message
        styleClass="ui:mb-2"
        [severity]="$any(message.severity)"
        showTransitionOptions="0ms"
      >
        {{ message.text }}
      </p-message>
    }
  `,
    imports: [MessageModule],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    this.patronApiService.getMessages(patronPid).subscribe(
      (messages: Message[]) => {
        this.messages.set(messages.map((message: Message): ToastMessageOptions => ({
          text: message.content, severity: message.type
        })));
      }
    );
  }
}
