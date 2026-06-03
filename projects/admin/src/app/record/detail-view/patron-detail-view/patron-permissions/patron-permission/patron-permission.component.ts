/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
 * Copyright (C) 2019-2022 UCLouvain
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
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { IPatronPermission } from '@app/admin/api/permission-api.service';
import { NgClass, KeyValuePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-patron-permission',
    templateUrl: './patron-permission.component.html',
    imports: [NgClass, KeyValuePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronPermissionComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** User permission */
  permission = input<IPatronPermission>();
  /** Hide reasons */
  isCollapsed = true;
}
