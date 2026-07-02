// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { IdentifierTypes } from '@app/admin/classes/identifiers';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { OperationLogsDialogComponent, PermissionsDirective } from '@rero/shared';
import { ActionStatus, DetailComponent, DetailButtonComponent, ErrorComponent } from '@rero/ng-core';
import { AppStore, IPermissions, PERMISSIONS } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogImportComponent } from '../dialog-import/dialog-import.component';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { combineLatest, filter, map, of, switchMap, tap } from 'rxjs';
import { DocumentDetailStore } from '../store/document-detail.store';

@Component({
  selector: 'admin-document-detail',
  templateUrl: './document-detail.component.html',
  providers: [DocumentDetailStore],
  imports: [DetailButtonComponent, OperationLogsDialogComponent, Bind, Button, PermissionsDirective, RouterLink, ErrorComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentDetailComponent extends DetailComponent implements OnInit {

  private dialogService: DialogService = inject(DialogService);
  private documentDetailStore = inject(DocumentDetailStore);
  private recordPermissionService = inject(RecordPermissionService);
  protected appStore = inject(AppStore);

  fileTitle = 'files';
  /** return all available permissions for current user */
  permissions: IPermissions = PERMISSIONS;
  private activeDocumentPid: string | null = null;

  readonly refreshedDeleteStatus = toSignal(
    combineLatest([
      toObservable(this.record).pipe(
        tap((record) => this._clearHoldingsTotalOnDocumentChange(record?.metadata?.pid))
      ),
      toObservable(this.documentDetailStore.holdingsTotal),
    ]).pipe(
      filter(([record, holdingsTotal]) => !record?.metadata?.pid || holdingsTotal != null),
      switchMap(([record, holdingsTotal]) => {
        const pid = record?.metadata?.pid;
        if (!pid) {
          return of(this.deleteStatus());
        }
        if (holdingsTotal! > 0) {
          return of({
            can: false,
            message: this.recordPermissionService.generateTooltipMessage({ links: { holdings: holdingsTotal! } }, 'delete'),
          });
        }
        return this.recordPermissionService
          .getPermission('documents', String(pid))
          .pipe(map((permission) => this._deletePermissionToActionStatus(permission)));
      })
    ),
    { initialValue: { can: false, message: '' } }
  );

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
    const libPid = this.appStore.currentLibraryPid();
    if (libPid) {
      this.recordService.getRecord('libraries', libPid).subscribe((library) => {
        this.fileTitle = [
          this.translate.instant('Files'),
          library.metadata.name,
        ].join(' - ');
      });
    }
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
        const regex = /["[\]]/gi;
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
        'documents', { query, page: 1, headers: { accept: 'application/rero+json' } }
      ).subscribe((response: any) => {
        if (this.recordService.totalHits(response.hits.total) === 0 && !warning) {
          this.router.navigate(route, { queryParams: data });
        } else {
          const dynamicDialogRef: DynamicDialogRef = this.dialogService.open(DialogImportComponent, {
            header: this.translate.instant('Import'),
            modal: true,
            closable: true,
            width: '30vw',
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

  private _clearHoldingsTotalOnDocumentChange(pid: any): void {
    const documentPid = pid == null ? null : String(pid);
    if (documentPid !== this.activeDocumentPid) {
      this.activeDocumentPid = documentPid;
      this.documentDetailStore.clearHoldingsTotal();
    }
  }

  private _deletePermissionToActionStatus(permission: RecordPermissions): ActionStatus {
    const canDelete = permission.delete?.can ?? false;
    return {
      can: canDelete,
      message: canDelete
        ? ''
        : this.recordPermissionService.generateTooltipMessage(permission.delete?.reasons, 'delete'),
    };
  }
}
