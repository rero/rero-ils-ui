/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DetailRecord, RecordService } from '@rero/ng-core';
import { IPermissions, PERMISSIONS, PermissionsService } from '@rero/shared';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DocumentApiService } from '../../../api/document-api.service';

@Component({
  selector: 'admin-document-detail-view',
  templateUrl: './document-detail-view.component.html'
})
export class DocumentDetailViewComponent implements DetailRecord, OnInit, OnDestroy {

  private translateService: TranslateService = inject(TranslateService);
  private activatedRouter: ActivatedRoute = inject(ActivatedRoute);
  private recordService: RecordService = inject(RecordService);
  private documentApiService: DocumentApiService = inject(DocumentApiService);
  private permissionsService: PermissionsService = inject(PermissionsService);

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Observable of the imported record in marc format */
  marc$: Observable<any>;

  /** Record subscription */
  private _recordObs: Subscription;

  /** Resource type */
  type: string;

  /** Document record */
  record: any;

  /** Related resources */
  relatedResources = [];

  /** Linked documents count */
  linkedDocumentsCount = 0;

  /** Css classes for dd in template */
  ddCssClass = 'col-sm-6 col-md-8 mb-0';

  /** Enables or disables links */
  activateLink: boolean = true;

  recordMessage: any[] = [];

  /** External identifier for imported record. */
  get pid(): string | null {
    if (this.activatedRouter.snapshot && this.activatedRouter.snapshot.params && this.activatedRouter.snapshot.params.pid !== null) {
      return this.activatedRouter.snapshot.params.pid;
    }
    return null;
  }

  /**
   * Get Current language interface
   * @return string - language
   */
  get currentLanguage(): string {
    return this.translateService.currentLang;
  }

  /** return all available permissions for current user */
  permissions: IPermissions = PERMISSIONS;

  /**
   * Show local fields tab
   * @return boolean - if False, hide the local fields tab
   */
  get showLocalFieldsTab(): boolean {
    return this.permissionsService.canAccess([PERMISSIONS.LOFI_SEARCH, PERMISSIONS.LOFI_CREATE]);
  }

  /**
   * Show or hide files tab
   * @return boolean - if False, hide the local fields tab
   */
  get showFilesTab(): boolean {
    return this.permissionsService.canAccess(PERMISSIONS.CIRC_ADMIN);
  }

  /** On init hook */
  ngOnInit(): void {
    this.activateLink = !this.activatedRouter.snapshot.params.type.startsWith('import_');
    this._recordObs = this.record$.pipe(
      switchMap((record: any) => {
        this.record = record;
        this.relatedResources = this.processRelatedResources(record);
        this.message(record);
        if (record != null && record.metadata != null && this.record.metadata.pid == null) {
          this.marc$ = this.recordService.getRecord(
            this.activatedRouter.snapshot.params.type, this.pid, 0, {
            Accept: 'application/marc+json, application/json'
          });
        } else {
          this.marc$ = of(null);
        }
        return this.pid
          ? this.documentApiService.getLinkedDocumentsCount(this.pid)
          : of(0);
      })
    ).subscribe((count: number) => {
      this.linkedDocumentsCount = count;
    });
  }

  /** On destroy hook */
  ngOnDestroy(): void {
    this._recordObs.unsubscribe();
  }

  /**
   * Allow to filter provisionActivity keeping only activities that are 'Publication'
   * @param element: the element to check
   * @return True if element is a 'Publication', False otherwise
   */
  filterPublicationProvisionActivity(element: any): boolean {
    return ('key' in element && element.key === 'bf:Publication');
  }

  /**
   * Format "part of" numbering for display
   *
   * @param num: numbering to format
   * @return formatted numbering (example: 2020, vol. 2, nr. 3, p. 302)
   */
  formatNumbering(num: any) {
    const numbering = [];
    if (num.year) {
      numbering.push(num.year);
    }
    if (num.volume) {
      const volume = [this.translateService.instant('vol'), num.volume];
      numbering.push(volume.join('. '));
    }
    if (num.issue) {
      const issue = [this.translateService.instant('nr'), num.issue];
      numbering.push(issue.join('. '));
    }
    if (num.pages) {
      const pages = [this.translateService.instant('p'), num.pages];
      numbering.push(pages.join('. '));
    }
    return numbering.join(', ');
  }

  /**
   * Get "part of" label from host document type
   * @param hostDocument - host document
   * @return corresponding translated label
   */
  getPartOfLabel(hostDocument: any) {
    switch (hostDocument.metadata.issuance.subtype) {
      case 'periodical':
        return this.translateService.instant('Journal');
      case 'monographicSeries':
        return this.translateService.instant('Series');
      default:
        return this.translateService.instant('Published in');
    }
  }

  /**
   * Process related resources
   * @param record - Record metadata
   * @returns Array of related resources
   */
  private processRelatedResources(record: any): any[] {
    if (record.metadata.electronicLocator) {
      return record.metadata.electronicLocator.filter(
        (electronicLocator: any) => [
          'hiddenUrl', 'noInfo', 'resource', 'relatedResource', 'versionOfResource'
        ].some(t => t === electronicLocator.type && electronicLocator.content !== 'coverImage')
      );
    }

    return [];
  }

  private message(record: any): void {
    if (record.metadata?.adminMetadata?.encodingLevel !== 'Full level' || record.metadata?.adminMetadata?.note) {
      let message = [];
      if (record.metadata?.adminMetadata?.encodingLevel) {
        message.push(this.translateService.instant('Encoding level') + ': ');
        message.push(this.translateService.instant(record.metadata.adminMetadata.encodingLevel) + '.')
      }
      if (record.metadata.adminMetadata.note) {
        message.push(record.metadata.adminMetadata.note.join('. ') + '.')
      }
      this.recordMessage = [{ severity: 'warn', detail: message.join(' '), icon: null }];
    }
  }
}
