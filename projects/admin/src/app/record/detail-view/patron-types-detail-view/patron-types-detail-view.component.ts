/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable } from 'rxjs';
import { OrganisationService } from '../../../service/organisation.service';

@Component({
  selector: 'admin-patron-types-detail-view',
  templateUrl: './patron-types-detail-view.component.html'
})
export class PatronTypesDetailViewComponent implements DetailRecord {

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Resource type */
  type: string;

  /** Constructor
   * @param organisationService: OrganisationService
   */
  constructor(private organisationService: OrganisationService) { }

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this.organisationService.organisation;
  }

}
