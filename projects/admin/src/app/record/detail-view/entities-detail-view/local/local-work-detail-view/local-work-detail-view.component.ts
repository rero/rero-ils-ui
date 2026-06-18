// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { EntitiesLocalGlobalComponent } from '../entities-local-global.component';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
    selector: 'admin-local-work-detail-view',
    templateUrl: './local-work-detail-view.component.html',
    imports: [EntitiesLocalGlobalComponent, TranslateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalWorkDetailViewComponent {
  /** the current record */
  record = input<any>();
}
