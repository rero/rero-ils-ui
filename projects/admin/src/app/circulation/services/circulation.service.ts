/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CirculationService {

  messages: WritableSignal<{type: string, content: string}[]> = signal([]);
  statistics: WritableSignal<{[key: string]: number}> = signal({});

  statisticsIncrease(type: string, increment: number = 1): void {
    let stats = this.statistics();
    if (!(type in stats)) {
      stats = { ...stats, [type]: 0 };
    }
    stats[type] += increment;
    this.statistics.set(stats);
  }

  statisticsDecrease(type: string, decrement: number = 1): void {
    const stats = this.statistics();
    if (!(type in stats)) {
      throw new Error(`The statistical "${type}" key doesn't exist`);
    }
    if (stats[type] < decrement) {
      throw new Error(`The decrease value of "${type}" is greater than the statistical value`);
    }
    stats[type] -= decrement;
    this.statistics.set(stats);
  }

  addCirculationMessage(message: {type: string, content: string}): void {
    this.messages.set([...this.messages(), message]);
  }

  /** Clear statistics */
  clear(): void {
    this.messages.set([]);
    this.statistics.set({});
  }
}
