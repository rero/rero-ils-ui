// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { EntitiesLocalGlobalComponent } from '../entities-local-global.component';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
    selector: 'admin-local-person-detail-view',
    templateUrl: './local-person-detail-view.component.html',
    imports: [EntitiesLocalGlobalComponent, TranslateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalPersonDetailViewComponent {
  /** the current record */
  record = input<any>();
}
