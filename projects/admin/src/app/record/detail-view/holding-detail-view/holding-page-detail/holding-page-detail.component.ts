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
import { Component, inject } from '@angular/core';
import { OperationLogsService } from '@rero/shared';
import { DetailComponent } from '@rero/ng-core';

@Component({
    selector: 'admin-holding-page-detail',
    templateUrl: './holding-page-detail.component.html',
    standalone: false
})
export class HoldingPageDetailComponent extends DetailComponent {

  private operationLogsService: OperationLogsService = inject(OperationLogsService);

  /**
   * Is operation log enabled
   * @return boolean
   */
  get isEnabledOperationLog(): boolean {
    return this.operationLogsService.isLogVisible('holdings');
  }
}
