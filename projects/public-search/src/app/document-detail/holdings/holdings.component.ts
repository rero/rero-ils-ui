/*
 * RERO IL-2024 RERO
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
import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService, User, UserService } from '@rero/shared';
import { Observable, switchMap, tap } from 'rxjs';
import { HoldingsApiService } from '../../api/holdings-api.service';
import { QueryResponse } from '../../record';
import { RecordService } from '@rero/ng-core';

@Component({
  selector: 'public-search-holdings',
  templateUrl: './holdings.component.html',
})
export class HoldingsComponent implements OnInit {
  private holdingsApiService: HoldingsApiService = inject(HoldingsApiService);
  private translateService: TranslateService = inject(TranslateService);
  private userService: UserService = inject(UserService);

  // COMPONENTS ATTRIBUTES ====================================================
  /** View code */
  @Input() viewcode: string;
  @Input() documentPid: string;

  /** Holdings total */
  holdingsTotal = 0;
  /** Current page */
  page = 1;
  /** Holdings records */
  holdings = [];

  /** Holdings per page */
  private holdingsPerPage = 10;

  get user(): User {
    return this.userService.user;
  }

  // GETTER & SETTER ==========================================================
  /**
   * Is the link `show more holdings` must be displayed
   * @return boolean
   */
  get isLinkShowMore() {
    return this.holdingsTotal > 0 && this.page * this.holdingsPerPage < this.holdingsTotal;
  }

  /**
   * Get the string to use when some holdings are still hidden
   * @return string
   */
  get hiddenHoldings(): string {
    const count = this.holdingsTotal - this.page * this.holdingsPerPage;
    if (count <= 0) {
      return '';
    }
    const linkText = count > 1 ? _('{{ counter }} hidden holdings') : _('{{ counter }} hidden holding');
    return this.translateService.instant(linkText, { counter: count });
  }

  /** OnInit hook */
  ngOnInit(): void {
    // Set view code to app settings
    this._holdingsQuery(1)
      .pipe(
        tap((response: QueryResponse) => {
          this.holdingsTotal = response.total.value;
          this.holdings = response.hits;
        })
      )
      .subscribe();
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Handler when 'show more holdings' link is clicked. */
  showMore(event: Event) {
    event.preventDefault(); // Doesn't follow any `href` link
    this.page++;
    this._holdingsQuery(this.page).subscribe(
      (response: QueryResponse) => (this.holdings = this.holdings.concat(response.hits))
    );
  }

  /**
   * Holdings query
   * @param page - number
   * @return Observable
   */
  private _holdingsQuery(page: number): Observable<QueryResponse> {
    return this.holdingsApiService.getHoldingsByDocumentPidAndViewcode(
      this.documentPid,
      this.viewcode,
      page,
      this.holdingsPerPage
    );
  }
}
