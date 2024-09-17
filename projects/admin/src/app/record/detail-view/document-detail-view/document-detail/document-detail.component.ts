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
import { Component, inject, OnInit } from '@angular/core';
import { IdentifierTypes } from '@app/admin/classes/identifiers';
import { OperationLogsService } from '@app/admin/service/operation-logs.service';
import {
  DetailComponent,
  Record
} from '@rero/ng-core';
import { IPermissions, PERMISSIONS, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogImportComponent } from '../dialog-import/dialog-import.component';

@Component({
  selector: 'admin-document-detail',
  templateUrl: './document-detail.component.html',
})
export class DocumentDetailComponent extends DetailComponent implements OnInit {

  private dialogService: DialogService = inject(DialogService);
  private operationLogsService: OperationLogsService = inject(OperationLogsService);
  private userService: UserService = inject(UserService);

  fileTitle: string = 'files';
  /** return all available permissions for current user */
  permissions: IPermissions = PERMISSIONS;

  /** Mapping types for import */
  private mappingTypes = {
    'bf:Ean': 'bf:Isbn',
    'bf:Isbn': 'bf:Isbn',
    'bf:Issn': 'bf:IssnL',
    'bf:IssnL': 'bf:Issn',
  };

  /** Identifiers used to check for duplicates */
  private identifiersList = [
    IdentifierTypes.ISBN,
    IdentifierTypes.ISSN,
    IdentifierTypes.DOI,
    IdentifierTypes.LCCN,
    IdentifierTypes.L_ISSN,
    IdentifierTypes.EAN,
  ];

  ngOnInit(): void {
    const libPid = this.userService.user.currentLibrary;
    if (libPid) {
      this.recordService.getRecord('libraries', libPid).subscribe((library) => {
        this.fileTitle = [
          this.translate.instant('Files'),
          library.metadata.name,
        ].join(' - ');
      });
    }
    super.ngOnInit();
  }

  /** Source for imported record. */
  get source() {
    if (
      this.route.snapshot &&
      this.route.snapshot.params &&
      this.route.snapshot.params.type !== null
    ) {
      return this.route.snapshot.params.type.replace('import_', '');
    }
    return null;
  }

  /** External identifier for imported record. */
  get pid(): string | null {
    if (
      this.route.snapshot &&
      this.route.snapshot.params &&
      this.route.snapshot.params.pid !== null
    ) {
      return this.route.snapshot.params.pid;
    }
    return null;
  }

  /**
   * Is operation log enabled
   * @return boolean
   */
  get isEnabledOperationLog(): boolean {
    return this.operationLogsService.isLogVisible('documents');
  }

  /**
   * Import document
   * @param event - Event
   * @param record - the current record to import
   * @param data - The source information
   */
  importDocument(
    event: Event,
    record: any,
    data: { source: string; pid: string }
  ): void {
    event.preventDefault();
    const rec = record.metadata;
    const route = ['/records', 'documents', 'new'];
    const queryParams = [];
    // If we have identifiers
    if (rec.identifiedBy) {
      // We select only a defined part of the identifier
      rec.identifiedBy
        .filter((identifier: any) =>
          this.identifiersList.includes(identifier.type)
        )
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
      const titles = rec.title.filter(
        (rtitle: any) => rtitle.type === 'bf:Title' && '_text' in rtitle
      );
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
      let warning = false;
      let query = queryParams.join(' OR ');
      // If the query exceeds the size of 1024 characters, we truncate it.
      if (query.length > 1024) {
        query = query.substring(0, query.substring(0, 1024).lastIndexOf('OR') - 1);
        warning = true;
      }
      this.recordService.getRecords(
        'documents', query, 1, undefined, undefined, undefined, { accept: 'application/rero+json' }
      ).subscribe((response: Record) => {
        if (this.recordService.totalHits(response.hits.total) === 0 && !warning) {
          this.router.navigate(route, { queryParams: data });
        } else {
          // const config = {
          //   initialState: {
          //     records: response.hits.hits,
          //     warning
          //   }
          // };
          const dynamicDialogRef: DynamicDialogRef = this.dialogService.open(DialogImportComponent, {
            data: {
              records: response.hits.hits,
              warning
            }
          });
          dynamicDialogRef.onClose.subscribe((confirmation: boolean) => {
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
