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
import { Component, computed, input, ChangeDetectionStrategy} from '@angular/core';
import { RouterLink } from '@angular/router';
import { EntityLinkComponent } from '../entity-link.component';
import { ArrayTranslatePipe } from '../../pipe/array-translate.pipe';
import { EntityLabelPipe } from '../../pipe/entity-label.pipe';
import { JoinPipe } from '../../pipe/join.pipe';

@Component({
    selector: 'shared-contribution',
    templateUrl: './contribution.component.html',
    imports: [RouterLink, EntityLinkComponent, ArrayTranslatePipe, EntityLabelPipe, JoinPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContributionComponent {

  // COMPONENTS ATTRIBUTES ====================================================
  /** List of contributor */
  readonly contributions = input<{entity: any, role: string[]}[]>([]);
  /** List of contributor types to display */
  readonly filters = input<string[]>(['bf:Person', 'bf:Organisation']);
  /** The number of contributors to display */
  readonly limitRecord = input<number | undefined>(undefined);
  /** Is the role of contributor should be displayed */
  readonly withRoles = input(false);
  /** The view where component is displayed (viewcode | 'professional') */
  readonly view = input('professional');
  /** Enables or disables links */
  readonly activateLink = input(true);
  /** Is the link to entity detail view should be activated */
  readonly withEntityLink = input(false);

  /** Filtered and sliced contributions for display */
  readonly displayedContributions = computed(() => {
    const filtered = (this.contributions() || []).filter(
      contributor => this.filters().includes(contributor.entity.type)
    );
    const limit = this.limitRecord() ?? filtered.length;
    return filtered.slice(0, limit);
  });

  /** Whether the list has been truncated */
  readonly limit = computed(() => {
    const filtered = (this.contributions() || []).filter(
      contributor => this.filters().includes(contributor.entity.type)
    );
    const limitRecord = this.limitRecord() ?? filtered.length;
    return filtered.length > limitRecord;
  });
}
