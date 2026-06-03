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
import { Component, inject, ChangeDetectionStrategy} from '@angular/core';
import { DetailComponent, DetailButtonComponent, ErrorComponent } from '@rero/ng-core';
import { AppStore, Entity } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-remote-page-detail',
    templateUrl: './remote-page-detail.component.html',
    imports: [DetailButtonComponent, Bind, Button, ErrorComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemotePageDetailComponent extends DetailComponent {

  private appStore = inject(AppStore);

    /**
   * Launch an expert search on the document view.
   * @param record - the current record
   */
    search(record: any): void {
      let catalogKey = undefined;
      let catalogPid = undefined;
      const orderKey = this.findOrderKeyByLanguage(this.translate.getCurrentLang());
      this.appStore.settings()?.agentLabelOrder[orderKey].forEach((source: string) => {
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
      let orderKey = Object.keys(this.appStore.settings()?.agentLabelOrder).find((key: string) => key === language);
      if (!orderKey) {
        orderKey = this.appStore.settings()?.agentLabelOrder.fallback;
      }

      return orderKey;
    }
}
