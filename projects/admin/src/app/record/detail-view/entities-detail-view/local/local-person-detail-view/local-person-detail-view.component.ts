// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { EntitiesLocalGlobalComponent } from '../entities-local-global.component';

@Component({
  selector: 'admin-local-person-detail-view',
  templateUrl: './local-person-detail-view.component.html',
  imports: [TranslatePipe, EntitiesLocalGlobalComponent],
})
export class LocalPersonDetailViewComponent {
  /** the current record */
  record = input<any>();
}
