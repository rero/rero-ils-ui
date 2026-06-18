// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { EntitiesLocalGlobalComponent } from '../entities-local-global.component';
import { TranslateDirective } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'admin-local-organisation-detail-view',
    templateUrl: './local-organisation-detail-view.component.html',
    imports: [EntitiesLocalGlobalComponent, TranslateDirective, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalOrganisationDetailViewComponent {
  /** the current record */
  record = input<any>();
}
