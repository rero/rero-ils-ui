/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CirculationService {
  /** Observable on current library closed dates */
  currentLibraryClosedDates$: BehaviorSubject<Array<moment>> = new BehaviorSubject([]);

  /** Circulation informations with messages and statistics */
  circulationInformations: {
    messages: Array<{type: string, content: string}>,
    statistics: any;
  };

  /** Array of current library closed dates */
  private _currentLibraryClosedDates: Array<moment> = [];

  /** Get closed dates of the user current library */
  get currentLibraryClosedDates(): Array<moment> {
    return this._currentLibraryClosedDates;
  }

  /** Set closed dates of the user current library */
  set currentLibraryClosedDates(closedDates: Array<moment>) {
    this._currentLibraryClosedDates = closedDates;
    this.currentLibraryClosedDates$.next(closedDates);
  }

  /**
   * Increment a circulation statistic for this user.
   * @param type - string: the statistic type (pending, request, loans, ...)
   * @param idx - number: the number to increment.
   * @return the new statistic counter
   */
  incrementCirculationStatistic(type: string, idx: number = 1): number {
    this.circulationInformations = this.circulationInformations || {messages: [], statistics: {}};
    this.circulationInformations.statistics[type] = (this.circulationInformations.statistics[type] || 0) + idx;
    return this.circulationInformations.statistics[type];
  }

  /**
   * Decrement a circulation statistic for this user.
   * @param type - string: the statistic type (pending, request, loans, ...)
   * @param idx - number: the number to decrement.
   * @return the new statistic counter
   */
  decrementCirculationStatistic(type: string, idx: number = 1): number {
    this.circulationInformations = this.circulationInformations || {messages: [], statistics: {}};
    if (!(type in this.circulationInformations.statistics)) {
      return 0;
    }
    const newStat = this.circulationInformations.statistics[type] - idx;
    this.circulationInformations.statistics[type] = (newStat > 0)
      ? newStat
      : 0;
    return this.circulationInformations.statistics[type];
  }

  /**
   * Append a circulation message for this user.
   * @param message: the message to append
   */
  addCirculationMessage(message: {type: string, content: string}): void {
    this.circulationInformations = this.circulationInformations || {messages: [], statistics: {}};
    this.circulationInformations.messages.push(message);
  }

  /** Clear statistics */
  clear(): void {
    this.circulationInformations = {
      messages: [],
      statistics: {}
    };
  }
}
