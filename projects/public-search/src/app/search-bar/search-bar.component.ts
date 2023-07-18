/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { SearchBarConfigService } from '@rero/shared';

@Component({
  selector: 'public-search-search-bar',
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent implements OnInit {

  @Input() language: string;
  @Input() viewcode: string;
  @Input() size: string = undefined;
  @Input() placeholder: string;
  @Input() maxLengthSuggestion = 100;


  get action(): string {
    return `/${this.viewcode}/search/documents`;
  }

  get typeaheadOptionsLimit(): number {
    return this._searchBarConfigService.typeaheadOptionsLimit;
  }

  /** Array types config */
  recordTypes = [];

  /**
   * Constructor
   * @param _translateService - TranslateService
   * @param _searchBarConfigService - SearchBarConfigService
   */
  constructor(
    private _translateService: TranslateService,
    private _searchBarConfigService: SearchBarConfigService
  ) {
    this.placeholder = this._translateService.instant('Search');
  }

  /** OnInit hook */
  ngOnInit(): void {
    if (this.language) {
      this._translateService.use(this.language);
    }
    this.recordTypes = this._searchBarConfigService.getConfig(
      false, this, this.viewcode, this.maxLengthSuggestion
    );
  }
}
