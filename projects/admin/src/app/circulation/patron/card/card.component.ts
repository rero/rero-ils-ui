/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { Component, DestroyRef, effect, inject, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { DateTime } from 'luxon';
import { getSeverity } from '../../../utils/utils';
import { CirculationStore } from '../../store/circulation.store';
import { NgClass, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { DateTranslatePipe, GetRecordPipe, Nl2brPipe, UpperCaseFirstPipe } from '@rero/ng-core';
import { TranslatePipe } from '@ngx-translate/core';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'admin-circulation-patron-detailed',
    templateUrl: './card.component.html',
    imports: [NgClass, RouterLink, Bind, Button, AsyncPipe, DateTranslatePipe, GetRecordPipe, Nl2brPipe, UpperCaseFirstPipe, TranslatePipe, MessageModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

  protected store = inject(CirculationStore);

  // COMPONENT ATTRIBUTES =====================================================
  /** the patron */
  patron = input<any>();
  /** the patron barcode */
  barcode = input<string>();
  /** is the circulation messages should be displayed */
  displayCirculationMessages = input(false);
  /** is the clear patron button should be displayed or not */
  clearPatronButton = input(true);
  /** which link should be use on the main patron name */
  linkMode = input('detail');
  /** event emitter when the close button are fired */
  clearPatron = output<any>();

  readonly patronLink = signal('');
  readonly isBirthday = signal(false);
  readonly patronAge = signal(0);
  readonly circulationMessages = this.store.messages;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.store.clearMessages());
    effect(() => {
      const patron = this.patron();
      if (patron) {
        this.patronLink.set(
          (this.linkMode() === 'detail')
            ? '/records/patrons/detail/' + patron.pid
            : '/circulation/patron/' + this.barcode() + '/loan'
        );
        if (patron.birth_date) {
          const today = DateTime.now().toFormat('M-dd');
          const birthDate = DateTime.fromISO(patron.birth_date).toFormat('M-dd');
          this.isBirthday.set(today === birthDate);
          this.patronAge.set(Math.floor(DateTime.now().diff(DateTime.fromISO(patron.birth_date), 'years').years));
        }
      }
    });
  }

  /** Clear current patron */
  clear(): void {
    if (this.patron()) {
      this.clearPatron.emit(this.patron());
    }
    this.store.clearMessages();
  }

  /**
   * Get message severity
   * @param level - string
   * @return string
   */
  getMessageSeverity(level: string): string {
    return getSeverity(level);
  }
}
