/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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

import { Component } from '@angular/core';
import { RecordSearchPageComponent } from '@rero/ng-core';

@Component({
  selector: 'admin-migration-search-page',
  template: `
  <admin-migration-search [adminMode]="adminMode" [currentType]="currentType" [types]="types" [detailUrl]="detailUrl"
  [showSearchInput]="showSearchInput" [q]="q" [page]="page" [size]="size" [sort]="sort"
  (parametersChanged)="updateUrl($event)">
</admin-migration-search>
  `,
})
export class MigrationSearchPageComponent extends RecordSearchPageComponent  {

}
