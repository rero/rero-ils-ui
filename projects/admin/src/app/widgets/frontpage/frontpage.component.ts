// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective } from '@ngx-translate/core';
import { MenuDashboardComponent } from '../../menu/menu-dashboard/menu-dashboard.component';

@Component({
    selector: 'admin-frontpage',
    templateUrl: './frontpage.component.html',
    imports: [TranslateDirective, MenuDashboardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrontpageComponent {
}
