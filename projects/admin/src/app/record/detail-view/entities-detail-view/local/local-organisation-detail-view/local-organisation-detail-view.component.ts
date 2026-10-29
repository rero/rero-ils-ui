// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { EntitiesLocalGlobalComponent } from '../entities-local-global.component';

@Component({
  selector: 'admin-local-organisation-detail-view',
  templateUrl: './local-organisation-detail-view.component.html',
  imports: [TranslatePipe, EntitiesLocalGlobalComponent, NgClass],
})
export class LocalOrganisationDetailViewComponent {
  /** the current record */
  record = input<any>();
}
