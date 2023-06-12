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

import { Component, Input } from '@angular/core';
import { ResultItem } from '@rero/ng-core';
import { ContributionTypePipe } from '../../../pipe/contribution-type.pipe';

@Component({
  selector: 'shared-person-brief',
  templateUrl: './person-brief.component.html'
})
export class PersonBriefComponent implements ResultItem {

  /** Record data */
  @Input() record: any;

  /** Resource type */
  @Input() type: string;

  /** Detail URL to navigate to detail view */
  @Input() detailUrl: { link: string, external: boolean };

  /**
   * Constructor
   * @param _contributionTypePipe - ContributionTypePipe
   */
  constructor(private _contributionTypePipe: ContributionTypePipe) { }

  /**
   * Contribution type
   * Change contributions term with correct type of contribution
   * @param detailUrlLink - string
   */
  contributionType(detailUrlLink: string) {
    return detailUrlLink.replace(
      'remote_entities',
      this._contributionTypePipe.transform(this.record.metadata.type)
    );
  }
}
