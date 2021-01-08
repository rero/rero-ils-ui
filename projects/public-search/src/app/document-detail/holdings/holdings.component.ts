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
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { HoldingsService } from '../../api/holdings.service';

@Component({
  selector: 'public-search-holdings',
  templateUrl: './holdings.component.html'
})
export class HoldingsComponent implements OnInit {

  /** View code */
  @Input() viewcode: string;

  /** Document pid */
  @Input() documentpid: string;

  /** Holdings total */
  holdingsTotal = 0;

  /** Holdings per page */
  private holdingsPerPage = 4;

  /** Current page */
  page = 1;

  /** Holdings records */
  holdings = [];

  /**
   * Is link show more
   * @return boolean
   */
  get isLinkShowMore() {
    return this.holdingsTotal > 0
      && ((this.page * this.holdingsPerPage) < this.holdingsTotal);
  }

  /**
   * Hidden holdings count
   * @return string
   */
  get hiddenHoldings(): string {
    let count = this.holdingsTotal - (this.page * this.holdingsPerPage);
    if (count < 0) {
      count = 0;
    }
    const linkText = (count > 1)
      ? '{{ counter }} hidden holdings'
      : '{{ counter }} hidden holding';
    return this._translateService.instant(linkText, { counter: count});
  }

  /**
   * Constructor
   * @param _holdingsService - HoldingsService
   * @param _translateService - TranslateService
   */
  constructor(
    private _holdingsService: HoldingsService,
    private _translateService: TranslateService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    const totalObservable = this._holdingsService
      .getHoldingsTotalByDocumentPidAndViewcode(this.documentpid, this.viewcode);
    forkJoin([totalObservable, this._HoldingsQuery(1)]).subscribe((results: any[]) => {
      this.holdingsTotal = results[0];
      this.holdings = results[1];
    });
  }

  /** Show more */
  showMore() {
    this.page++;
    this._HoldingsQuery(this.page).subscribe((holdings: any[]) => {
      this.holdings = this.holdings.concat(holdings);
    });
  }

  /**
   * Holdings query
   * @param page - number
   * @return Observable
   */
  private _HoldingsQuery(page: number): Observable<any> {
    return this._holdingsService
      .getHoldingsByDocumentPidAndViewcode(this.documentpid, this.viewcode, page, this.holdingsPerPage);
  }
}
