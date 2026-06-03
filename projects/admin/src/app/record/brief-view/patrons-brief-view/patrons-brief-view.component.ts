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

import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppStore, PERMISSIONS } from '@rero/shared';
import { roleTagSeverity } from '../../../utils/roles';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';

@Component({
    selector: 'admin-patrons-brief-view',
    templateUrl: './patrons-brief-view.component.html',
    imports: [RouterLink, Bind, Button, Tag, TranslatePipe, DateTranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronsBriefViewComponent {

  private appStore = inject(AppStore);
  private router = inject(Router);

  /** the record to display */
  record = input<any>();
  /** the record type */
  type = input<string>();
  /** the url to access detail view */
  detailUrl = input<{ link: string, external: boolean }>();

  /**
   * Circulation access check
   * @return true if the circulation permission is allowed
   */
   get circulationAccess(): boolean {
    return this.appStore.canAccess(PERMISSIONS.CIRC_ADMIN);
  }

  /**
   * Get the color badge to apply for a specific role
   * @param role: the role to check.
   * @return the primeng badge class to use for this role.
   */
  getRoleTagSeverity(role: string): string {
    return roleTagSeverity(role);
  }

  goToCirculation(barcode: string): void {
    this.router.navigate(['/circulation', 'patron', barcode, 'loan']);
  }
}
