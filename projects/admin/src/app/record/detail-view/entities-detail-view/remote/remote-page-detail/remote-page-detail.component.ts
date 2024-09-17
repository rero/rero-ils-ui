/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, inject } from '@angular/core';
import { DetailComponent } from '@rero/ng-core';
import { AppSettingsService, Entity } from '@rero/shared';

@Component({
  selector: 'admin-remote-page-detail',
  templateUrl: './remote-page-detail.component.html'
})
export class RemotePageDetailComponent extends DetailComponent {

  private appSettingsService: AppSettingsService = inject(AppSettingsService);

    /**
   * Launch an expert search on the document view.
   * @param record - the current record
   */
    search(record: any): void {
      let catalogKey = undefined;
      let catalogPid = undefined;
      const orderKey = this.findOrderKeyByLanguage(this.translate.currentLang);
      this.appSettingsService.settings.agentLabelOrder[orderKey].forEach((source: string) => {
        if (record.metadata.sources.includes(source) && !catalogKey && !catalogPid) {
          catalogKey = source;
          catalogPid = record.metadata[source].pid;
        }
      });
      if (catalogKey && catalogPid) {
        this.router.navigate(
          ['/records', 'documents'],
          {
            queryParams: { q: Entity.generateSearchQuery(record.metadata.type, catalogKey, catalogPid), simple: '0' },
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
      let orderKey = Object.keys(this.appSettingsService.settings.agentLabelOrder).find((key: string) => key === language);
      if (!orderKey) {
        orderKey = this.appSettingsService.settings.agentLabelOrder.fallback;
      }

      return orderKey;
    }
}
