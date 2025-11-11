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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api/toastmessage';
import { Subscription } from 'rxjs';
import { Message, PatronApiService } from '../../api/patron-api.service';
import { PatronProfileMenuService } from '../service/patron-profile-menu.service';

@Component({
    selector: 'public-search-patron-profile-message',
    template: `
    @for (message of messages; track $index) {
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
export class PatronProfileMessageComponent implements OnInit, OnDestroy {
  private patronApiService: PatronApiService = inject(PatronApiService);
  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);

  /** Observable subscription */
  private _subscription = new Subscription();

  /** patron messages */
  messages: ToastMessageOptions[] = [];

  /** OnInit hook */
  ngOnInit(): void {
    this._loanMessage();
    this._subscription.add(
      this.patronProfileMenuService.onChange$.subscribe(() => {
        this._loanMessage();
      })
    );
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /** load message */
  private _loanMessage(): void {
    const patronPid = this.patronProfileMenuService.currentPatron.pid;
    this.patronApiService.getMessages(patronPid).subscribe(
      (messages: Message[]) =>
        (this.messages = messages.map((message:Message): ToastMessageOptions => {
          return { text: message.content, severity: message.type };
        }))
    );
  }
}
