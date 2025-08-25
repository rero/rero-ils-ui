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
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { DateTime } from 'luxon';
import { getSeverity } from '../../../utils/utils';
import { CirculationStatsService } from '../service/circulation-stats.service';

@Component({
    selector: 'admin-circulation-patron-detailed',
    templateUrl: './card.component.html',
    standalone: false
})
export class CardComponent implements OnChanges, OnDestroy {

  private circulationStatsService: CirculationStatsService = inject(CirculationStatsService);

  // COMPONENT ATTRIBUTES =====================================================
  /** the patron */
  @Input() patron: any;
  /** the patron barcode */
  @Input() barcode: string;
  /** is the circulation messages should be displayed */
  @Input() displayCirculationMessages = false;
  /** is the clear patron button should be displayed or not */
  @Input() clearPatronButton = true;
  /** which link should be use on the main patron name */
  @Input() linkMode: 'circulation'|'detail' = 'detail';
  /** event emitter when the close button are fired */
  @Output() clearPatron = new EventEmitter<any>();

  /** Link used on the patron name */
  patronLink: string;
  /** it's the birthday of the patron */
  isBirthday = false;
  /** Patron age */
  patronAge: number;
  /** circulation messages about the loaded patron if exists */
  circulationMessages: WritableSignal<{severity: string, detail: string}[]> = signal([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.patron) {
      if (this.patron) {
      this.patronLink = (this.linkMode === 'detail')
        ? '/records/patrons/detail/' + this.patron.pid
        : '/circulation/patron/' + this.barcode + '/loan';
    }

    if (this.patron && this.patron.birth_date) {
      const today = DateTime.now().toFormat('M-dd');
      const birthDate = DateTime.fromISO(this.patron.birth_date).toFormat('M-dd');
      if (today === birthDate) {
        this.isBirthday = true;
      }
    }

    if (this.patron && this.patron.birth_date) {
      const birthDate = DateTime.fromISO(this.patron.birth_date);
      this.patronAge = Math.floor(DateTime.now().diff(birthDate, 'years').years);
    }

    this.circulationMessages = this.circulationStatsService.messages;
    }
  }

  ngOnDestroy(): void {
    this.circulationStatsService.clearMessages();
  }

  /** Clear current patron */
  clear(): void {
    if (this.patron) {
      this.clearPatron.emit(this.patron);
    }
    this.circulationStatsService.clearMessages();
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
