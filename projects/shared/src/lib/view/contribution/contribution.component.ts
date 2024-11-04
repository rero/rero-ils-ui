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

@Component({
  selector: 'shared-contribution',
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
  /** Enables or disables links */
  @Input() activateLink: boolean = true;
  /** Is the link to entity detail view should be activated */
  @Input() withEntityLink: boolean = false;

  /** If the limit is activated, we add 3 dots at the end of the contribution line. */
  limit: boolean = false;

  /** OnInit hook */
  ngOnInit() {
    this.contributions = this.contributions || [];
    this.limitRecord = (this.limitRecord === undefined) ? this.contributions.length : this.limitRecord;
    this.contributions = this.contributions.filter(contributor => this.filters.includes(contributor.entity.type));

    if (this.contributions.length > this.limitRecord) {
      this.contributions = this.contributions.slice(0, this.limitRecord);
      this.limit = true;
    }
  }
}
