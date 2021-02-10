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
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatronProfileService {

  /** Tabs event */
  private _tabsEvent = new Subject<ITabEvent>();

  /** Cancel event */
  private _cancelRequestEvent = new Subject<string>();

  /** Get tab event observable */
  get tabsEvent$(): Observable<ITabEvent> {
    return this._tabsEvent.asObservable();
  }

  /** Change tab */
  changeTab(tab: ITabEvent): void {
    this._tabsEvent.next(tab);
  }

  /** Cancel Request event observable */
  get cancelRequestEvent$(): Subject<string> {
    return this._cancelRequestEvent;
  }

  /** Cancel request */
  cancelRequest(loanPid: string): void {
    this._cancelRequestEvent.next(loanPid);
  }
}

/** Tab event interface */
export interface ITabEvent {
  name: string;
  count: number;
}
