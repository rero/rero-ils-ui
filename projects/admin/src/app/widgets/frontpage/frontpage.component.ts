// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MenuDashboardComponent } from '../../menu/menu-dashboard/menu-dashboard.component';

@Component({
  selector: 'admin-frontpage',
  templateUrl: './frontpage.component.html',
  imports: [TranslatePipe, MenuDashboardComponent],
})
export class FrontpageComponent {}
