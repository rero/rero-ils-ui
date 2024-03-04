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
import { Location } from '@angular/common';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DetailComponent, RecordService, RecordUiService } from '@rero/ng-core';
import { AppSettingsService, Entity } from '@rero/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'admin-remote-page-detail',
  templateUrl: './remote-page-detail.component.html'
})
export class RemotePageDetailComponent extends DetailComponent {

  /**
   * Constructor
   * @param route - ActivatedRoute
   * @param router - Router
   * @param location - Location
   * @param componentFactoryResolver - ComponentFactoryResolver
   * @param recordService - RecordService
   * @param recordUiService - RecordUiService
   * @param toastrService - ToastrService
   * @param translate - TranslateService
   * @param spinner - NgxSpinnerService
   * @param bsModalService - BsModalService
   * @param appSettingsService - AppSettingsService
   */
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected recordService: RecordService,
    protected recordUiService: RecordUiService,
    protected toastrService: ToastrService,
    protected translate: TranslateService,
    protected spinner: NgxSpinnerService,
    protected bsModalService: BsModalService,
    protected appSettingsService: AppSettingsService
  ) {
    super(route, router, location, componentFactoryResolver, recordService, recordUiService, toastrService, translate, spinner);
  }

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
