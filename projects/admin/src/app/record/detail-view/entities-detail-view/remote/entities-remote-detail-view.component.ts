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
import { Tools } from '@app/admin/utils/tools';
import { TranslateService } from '@ngx-translate/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { AppSettingsService, EntityType, EntityTypeIcon } from '@rero/shared';

@Component({
  selector: 'admin-remote-entities-remote-detail-view',
  templateUrl: './entities-remote-detail-view.component.html'
})
export class RemoteEntitiesDetailViewComponent implements DetailRecord {

  /** Observable resolving record data */
  record$: any;

  /** Resource type */
  type: string;

  /** Enum of type of Entity */
  entityType = EntityType;

  /**
   * Constructor
   * @param _translateService - TranslateService
   * @param _router - Router
   * @param _appSettingsService - AppSettingsService
   */
  constructor(
    private _translateService: TranslateService,
    private _router: Router,
    private _appSettingsService: AppSettingsService
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
      case EntityType.TOPIC:
        return { class: EntityTypeIcon.TOPIC, title: this._translateService.instant('Topic') };
      default:
        return { class: 'fa-question', title: this._translateService.instant('Missing type') };
    }
  }

  /**
   * Launch an expert search on the document view.
   * @param metadata - the record metadata
   * TODO: Modify query params.
   */
  search(metadata: any): void {
    let catalogKey = null;
    let catalogPid = null;
    const orderKey = this.findOrderKeyByLanguage(this._translateService.currentLang);
    // Return false in an every loop to interrupt it
    this._appSettingsService.settings.agentLabelOrder[orderKey].every((catalog: string) => {
      if (metadata.sources.includes(catalog)) {
        catalogKey = catalog;
        catalogPid = metadata[catalog].pid;
        return false;
      }
    });
    if (catalogKey && catalogPid) {
      this._router.navigate(
        ['/records', 'documents'],
        {
          queryParams: { q: Tools.generateEntitySearchQuery(catalogKey, catalogPid), simple: '0' },
          skipLocationChange: true
        }
      );
    }
  }

  /**
   * Find order key by language
   * @param language - language code (Ex: fr, de, en, etc…)
   * @returns The matched language code
   */
  private findOrderKeyByLanguage(language: string): string {
    let orderKey = Object.keys(this._appSettingsService.settings.agentLabelOrder).find((key: string) => key === language);
    if (!orderKey) {
      orderKey = this._appSettingsService.settings.agentLabelOrder.fallback;
    }

    return orderKey;
  }
}
