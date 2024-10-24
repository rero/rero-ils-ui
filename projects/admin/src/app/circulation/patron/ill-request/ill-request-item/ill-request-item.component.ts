/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, inject, Input } from '@angular/core';
import { IllRequestsService } from '@app/admin/service/ill-requests.service';

@Component({
  selector: 'admin-ill-request-item',
  templateUrl: './ill-request-item.component.html',
  styleUrls: ['../../../circulation.scss']
})
export class IllRequestItemComponent {

  private illRequestService: IllRequestsService = inject(IllRequestsService);

  // COMPONENT ATTRIBUTES =====================================================
  /** ILL record. */
  @Input() record: any;
  /** Is detail is collapsed. */
  isCollapsed: boolean = true;

  // COMPONENT FUNCTIONS ======================================================
  /** get the bootstrap color to apply on the request status badge */
  badgeColor(status: string): string {
    return this.illRequestService.badgeColor(status);
  }
}
