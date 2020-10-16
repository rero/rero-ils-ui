/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable, Subscription } from 'rxjs';
import { User } from '@rero/shared';

@Component({
  selector: 'admin-patron-detail-view',
  templateUrl: './patron-detail-view.component.html'
})
export class PatronDetailViewComponent implements OnInit, DetailRecord, OnDestroy {

  /** Data from patron we received */
  record$: Observable<any>;

  /** Current displayed/used patron */
  patron: User;

  /** record type */
  type: string;

  /** Subscription to (un)follow the record$ Observable */
  private _subscription$ = new Subscription();

  /**
   * Constructor.
   * @param _sanitizer - DomSanitizer, to render html.
   */
  constructor(
    private _sanitizer: DomSanitizer
  ) {}

  /**
   * Current patron initialization.
   */
  ngOnInit() {
    this._subscription$ = this.record$.subscribe(record => {
      this.patron = new User(record.metadata);
    });
  }

  /**
   * Unsubscribe observable when destroying the PatronDetailViewComponent
   */
  ngOnDestroy() {
    this._subscription$.unsubscribe();
  }

  /**
   * Get the patron notes.
   *
   * It replace a new line to the corresponding html code.
   * Allows to render html.
   */
  public get notes(): Array<{type: string, content: SafeHtml}> {
    if (!this.patron.notes || this.patron.notes.length < 1) {
      return [];
    }
    return this.patron.notes.map((note: any) => {
      return {
        type: note.type,
        content: this._sanitizer.bypassSecurityTrustHtml(
          note.content.replace('\n', '<br>'))
      };
    });
  }

}
