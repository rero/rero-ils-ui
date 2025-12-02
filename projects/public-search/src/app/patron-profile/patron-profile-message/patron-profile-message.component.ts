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
import { Component, inject } from '@angular/core';
import { MessagesStore } from '../store/messages-store';

@Component({
  selector: 'public-search-patron-profile-message',
  template: `
    @for (message of messagesStore.displayMessages(); track $index) {
      <p-message
        styleClass="ui:mb-2"
        [text]="message.text"
        [severity]="message.severity"
        showTransitionOptions="0ms"
      />
    }
  `,
  standalone: false
})
export class PatronProfileMessageComponent {
  messagesStore = inject(MessagesStore);
}
