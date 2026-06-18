// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { EntitiesLocalGlobalComponent } from '../entities-local-global.component';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
    selector: 'admin-local-place-detail-view',
    templateUrl: './local-place-detail-view.component.html',
    imports: [EntitiesLocalGlobalComponent, TranslateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalPlaceDetailViewComponent {
  /** the current record */
  record = input<any>();
}
