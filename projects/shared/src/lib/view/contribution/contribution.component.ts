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

@Component({
  selector: 'shared-contribution',
  styleUrls: ['./contribution.component.scss'],
  templateUrl: './contribution.component.html'
})
export class ContributionComponent implements OnInit {

  // COMPONENTS ATTRIBUTES ====================================================
  /** List of contributor */
  @Input() contributions: Array<{entity: any, role: Array<string>}>;
  /** List of contributor types to display */
  @Input() filters: string[] = ['bf:Person', 'bf:Organisation']
  /** The number of contributors to display */
  @Input() limitRecord: number | undefined;
  /** Is the role of contributor should be displayed */
  @Input() withRoles: boolean = false;
  /** The view where component is displayed (viewcode | 'professional') */
  @Input() view: string = 'professional';

  /** If the limit is activated, we add 3 dots at the end of the contribution line. */
  limit: boolean = false;

  // CONSTRUCTORS & HOOKS =====================================================
  /**
   * Constructor
   * @param _translateService - TranslateService
   */
  constructor(
    private _translateService: TranslateService
  ) { }

  /** OnInit hook */
  ngOnInit() {
    this.contributions = this.contributions || [];
    this.limitRecord = (this.limitRecord === undefined) ? this.contributions.length : this.limitRecord;
    this.contributions = this.contributions.filter(contributor => this.filters.includes(contributor.entity.type));

    if (this.contributions.length > this.limitRecord) {
      this.contributions = this.contributions.slice(0, this.limitRecord);
      this.limit = true;
    }

    this.contributions.forEach(contributor => {
      if (contributor.entity?.pid) {
        // Linked entity
        const type = contributor.entity.resource_type;
        contributor.entity.target = `contribution.entity.pids.${type}:${contributor.entity.pids[type]}`;
      } else {
        // Textual entity
        const field = `authorized_access_point_${this._translateService.currentLang}`;
        contributor.entity.target = `contribution.entity.${field}:"${contributor.entity[field]}"`;
      }
    });
  }
}
