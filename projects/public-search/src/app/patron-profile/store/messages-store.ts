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

import { computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { Message, PatronApiService } from '../../api/patron-api.service';
import { PatronProfileMenuStore } from './patron-profile-menu-store';

type MessagesState = {
  messages: Message[];
  messagesLoading: boolean;
  currentPatronPid: string | undefined;
};

const initialState: MessagesState = {
  messages: [],
  messagesLoading: false,
  currentPatronPid: undefined,
};

export const MessagesStore = signalStore(
  { providedIn: 'root' },
  withState<MessagesState>(initialState),

  withComputed((state) => ({
    /** Transform messages to ToastMessageOptions for display */
    displayMessages: computed(() =>
      state.messages().map((message: Message) => ({
        text: message.content,
        severity: message.type,
      }))
    ),
  })),

  withMethods((store, patronApi = inject(PatronApiService)) => {
    const loadMessages = rxMethod<string>(
      pipe(
        tap(() => patchState(store, { messagesLoading: true })),
        switchMap((patronPid: string) => patronApi.getMessages(patronPid)),
        tap((messages: Message[]) =>
          patchState(store, {
            messages,
            messagesLoading: false,
          })
        ),
        catchError(() => {
          patchState(store, { messagesLoading: false, messages: [] });
          return of([]);
        })
      )
    );

    return { loadMessages };
  }),

  withHooks((store, menuStore = inject(PatronProfileMenuStore)) => ({
    onInit: () => {
      const patron = menuStore.currentPatron();
      if (patron) {
        patchState(store, { currentPatronPid: patron.pid });
        store.loadMessages(patron.pid);
      }
    },

    /** React to patron changes */
    __patronEffect: effect(() => {
      const patron = menuStore.currentPatron();
      if (patron) {
        patchState(store, { currentPatronPid: patron.pid });
        store.loadMessages(patron.pid);
      }
    }),
  }))
);
