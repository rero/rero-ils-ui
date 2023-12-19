
/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { IdentifierTypes } from '@app/admin/classes/identifiers';
import { TranslateService } from '@ngx-translate/core';
import { DetailComponent, Record, RecordService, RecordUiService } from '@rero/ng-core';
import { IPermissions, PERMISSIONS } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DialogImportComponent } from '../dialog-import/dialog-import.component';

@Component({
  selector: 'admin-document-detail',
  templateUrl: './document-detail.component.html'
})
export class DocumentDetailComponent extends DetailComponent {

  /** return all available permissions for current user */
  permissions: IPermissions = PERMISSIONS;

  /** Mapping types for import */
  private mappingTypes = {
    'bf:Ean': 'bf:Isbn',
    'bf:Isbn': 'bf:Isbn',
    'bf:Issn': 'bf:IssnL',
    'bf:IssnL': 'bf:Issn'
  };

  /** Identifiers used to check for duplicates */
  private identifiersList = [
    IdentifierTypes.ISBN,
    IdentifierTypes.ISSN,
    IdentifierTypes.DOI,
    IdentifierTypes.LCCN,
    IdentifierTypes.L_ISSN,
    IdentifierTypes.EAN
  ];

  /** Source for imported record. */
  get source() {
    if (this.route.snapshot && this.route.snapshot.params && this.route.snapshot.params.type !== null) {
      return this.route.snapshot.params.type.replace('import_', '');
    }
    return null;
  }

  /** External identifier for imported record. */
  get pid(): string | null {
    if (this.route.snapshot && this.route.snapshot.params && this.route.snapshot.params.pid !== null) {
      return this.route.snapshot.params.pid;
    }
    return null;
  }

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
    protected bsModalService: BsModalService
  ) {
    super(route, router, location, componentFactoryResolver, recordService, recordUiService, toastrService, translate, spinner);
   }

  /**
   * Import document
   * @param event - Event
   * @param record - the current record to import
   * @param data - The source information
   */
   importDocument(event: Event, record: any, data: { source: string, pid: string }): void {
    event.preventDefault();
    const rec = record.metadata;
    const route = ['/records', 'documents', 'new'];
    const queryParams = [];
    // If we have identifiers
    if (rec.identifiedBy) {
      // We select only a defined part of the identifier
      rec.identifiedBy
        .filter((identifier: any) => this.identifiersList.includes(identifier.type))
        .map((identifier: any) => {
          queryParams.push(this.extractAndFormatQueryParams(identifier));
          if (identifier.type in this.mappingTypes) {
            const cidentifier = cloneDeep(identifier);
            cidentifier.type = this.mappingTypes[cidentifier.type];
            queryParams.push(this.extractAndFormatQueryParams(cidentifier));
          }
        });
    }

    // If we do not have a identifier and we have a title
    // TODO: Nice to have -  create an backend API entrypoint to detect the duplicate resource.
    // https://github.com/rero/rero-ils/issues/2900 (Generalize to all resources)
    if (queryParams.length === 0 && rec.title) {
      // We extract the title
      const titles = rec.title.filter((rtitle: any) => rtitle.type === 'bf:Title' && '_text' in rtitle);
      if (titles.length > 0) {
        // We clean the text string by deleting some characters
        const regex = /["\[\]]/gi;
        queryParams.push(`title._text:"${titles[0]._text.replace(regex, '')}"`);
      }
    }

    // No identifier and no title, we redirect to the add form.
    if (queryParams.length === 0) {
      this.router.navigate(route, { queryParams: data });
    } else {
      // Find documents(s) with query params
      const query = queryParams.join(' OR ');
      this.recordService.getRecords(
        'documents', query, 1, undefined, undefined, undefined, { accept: 'application/rero+json' }
      ).subscribe((response: Record) => {
        if (this.recordService.totalHits(response.hits.total) === 0) {
          this.router.navigate(route, { queryParams: data });
        } else {
          const config = {
            initialState: {
              records: response.hits.hits
            }
          };
          const bsModalRef = this.bsModalService.show(DialogImportComponent, config);
          bsModalRef.content.confirmation$.subscribe((confirmation: boolean) => {
            if (confirmation) {
              this.router.navigate(route, { queryParams: data });
            }
          });
        }
      });
    }
  }

  /**
   * Extract and format query params
   * @param identifier - IdentifiedBy object
   * @return string, query formatted
   */
  private extractAndFormatQueryParams(identifier: any): string {
    const query = [];
    query.push(`identifiedBy.type:"${identifier.type}"`);
    query.push(`identifiedBy.value:"${identifier.value}"`);
    if (identifier.source) {
      query.push(`identifiedBy.source:"${identifier.source}"`);
    }
    return `(${query.join(' AND ')})`;
  }
}
