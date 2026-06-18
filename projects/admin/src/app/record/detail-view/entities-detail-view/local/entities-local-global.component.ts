// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-entities-local-global',
    template: `
  <dl class="metadata">
    <ng-content></ng-content>
    @if (record().source_catalog) {
        <dt translate>Source catalog</dt>
        <dd>{{ record().source_catalog }}</dd>
    }
    @if (record().identifier) {
      <dt translate>Identifier</dt>
      <dd>
        {{ record().identifier.type | translate }} - {{ record().identifier.value }}
        @if (record().identifier.source) {
          ({{ record().identifier.source }})
        }
      </dd>
    }
  </dl>
  `,
    imports: [TranslateDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntitiesLocalGlobalComponent {
  record = input<any>();
}
