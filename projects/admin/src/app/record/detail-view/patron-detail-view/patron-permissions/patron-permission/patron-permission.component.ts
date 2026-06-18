// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
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
