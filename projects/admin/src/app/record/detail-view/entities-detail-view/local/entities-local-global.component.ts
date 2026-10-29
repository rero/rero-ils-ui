// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'admin-entities-local-global',
  template: `
    <dl class="metadata">
      <ng-content></ng-content>
      @if (record().source_catalog) {
        <dt>{{ 'Source catalog' | translate }}</dt>
        <dd>{{ record().source_catalog }}</dd>
      }
      @if (record().identifier) {
        <dt>{{ 'Identifier' | translate }}</dt>
        <dd>
          {{ record().identifier.type | translate }} - {{ record().identifier.value }}
          @if (record().identifier.source) {
            ({{ record().identifier.source }})
          }
        </dd>
      }
    </dl>
  `,
  imports: [TranslatePipe],
})
export class EntitiesLocalGlobalComponent {
  record = input<any>();
}
