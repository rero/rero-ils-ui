/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'admin-entities-local-global',
  template: `
  <dl class="entity-fields">
    <ng-content></ng-content>
    <ng-container *ngIf="record.source_catalog">
      <dt translate>
        Source catalog
      </dt>
      <dd>
        {{ record.source_catalog }}
      </dd>
    </ng-container>
    <ng-container *ngIf="record.identifier">
      <dt translate>
        Identifier
      </dt>
      <dd>
        {{ record.identifier.type | translate }} - {{ record.identifier.value }}
        <span *ngIf="record.identifier.source">({{ record.identifier.source }})</span>
      </dd>
    </ng-container>
  </dl>
  `
})
export class EntitiesLocalGlobalComponent {
  @Input() record: any;
}
