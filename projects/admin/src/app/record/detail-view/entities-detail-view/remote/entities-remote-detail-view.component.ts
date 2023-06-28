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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { EntityType, EntityTypeIcon } from '@rero/shared';

@Component({
  selector: 'admin-remote-entities-remote-detail-view',
  templateUrl: './entities-remote-detail-view.component.html'
})
export class RemoteEntitiesDetailViewComponent implements DetailRecord {

  /** Observable resolving record data */
  record$;

  /** Resource type */
  type: string;

  /**
   * Constructor
   * @param _translateService - TranslateService
   * @param _router - Router
   */
  constructor(
    private _translateService: TranslateService,
    private _router: Router
  ) { }

  /**
   * Icon
   * @param type - type of contribution
   * @return object
   */
  icon(type: string): { class: string, title: string } {
    switch (type) {
      case EntityType.PERSON:
        return { class: EntityTypeIcon.PERSON, title: this._translateService.instant('Person') };
      case EntityType.ORGANISATION:
        return { class: EntityTypeIcon.ORGANISATION, title: this._translateService.instant('Organisation') };
      default:
        return { class: 'fa-question', title: this._translateService.instant('Missing type') };
    }
  }

  /**
   * Launch an expert search on the document view.
   * @param authorized_access_point - the authorized access point for the remote entity
   */
  search(authorized_access_point: string): void {
    this._router.navigate(
      ['/records', 'documents'],
      { queryParams: { q: `contribution.entity:${authorized_access_point}`, simple: '0'}}
    );
  }
}
