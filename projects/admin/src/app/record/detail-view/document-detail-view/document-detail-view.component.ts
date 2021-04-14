/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Record, RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { cloneDeep } from 'lodash-es';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of, Subscription } from 'rxjs';
import { OperationLogsService } from '../../../service/operation-logs.service';
import { DialogImportComponent } from './dialog-import/dialog-import.component';

@Component({
  selector: 'admin-document-detail-view',
  templateUrl: './document-detail-view.component.html',
  styleUrls: ['./document-detail-view.component.scss']
})
export class DocumentDetailViewComponent implements DetailRecord, OnInit, OnDestroy {

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

  /** Css classes for dd in template */
  ddCssClass = 'col-sm-6 col-md-8 mb-0';

  /** Mapping types for import */
  private mappingtypes = {
    'bf:Ean': 'bf:Isbn',
    'bf:Isbn': 'bf:Isbn',
    'bf:Issn': 'bf:IssnL',
    'bf:IssnL': 'bf:Issn'
  };

  /**
   * Is operation log enabled
   * @return boolean
   */
  get isEnabledOperationLog(): boolean {
    return this._operationLogsService.isLogVisible('documents');
  }

  /**
   * Constructor
   * @param _translateService - TranslateService to translate some strings.
   * @param _activatedRouter - ActivatedRoute to get url parameters.
   * @param _recordService - RecordService to the MARC version for the record.
   * @param _operationLogsService - OperationLogsService
   * @param _router - Router
   * @param _bsModalService - BsModalService
   */
  constructor(
    private _translateService: TranslateService,
    private _activatedRouter: ActivatedRoute,
    private _recordService: RecordService,
    private _operationLogsService: OperationLogsService,
    private _router: Router,
    private _bsModalService: BsModalService
  ) { }

  /** On init hook */
  ngOnInit() {
    this._recordObs = this.record$.subscribe((record: any) => {
      this.record = record;
      // only for imported record
      if (record != null && record.metadata != null && this.record.metadata.pid == null) {
        this.marc$ = this._recordService.getRecord(
          this._activatedRouter.snapshot.params.type, this.pid, 0, {
          Accept: 'application/marc+json, application/json'
        });
      } else {
        this.marc$ = of(null);
      }
    });
  }

  /**
   * Import Document
   * @param event - Event
   * @param record - Current record
   * @param data - Import source reference
   */
  importDocument(event: Event, record: any, data: { source: string, pid: string }): void {
    event.preventDefault();
    const keysTypes = Object.keys(this.mappingtypes);
    const rec = record.metadata;
    const route = ['/records', 'documents', 'new'];
    if (rec.identifiedBy) {
      const queryParams = [];
      rec.identifiedBy.forEach((identifier: any) => {
        queryParams.push(this._extractAndFormatQueryParams(identifier));
        if (keysTypes.indexOf(identifier.type) > -1) {
          const cidentifier = cloneDeep(identifier);
          cidentifier.type = this.mappingtypes[cidentifier.type];
          queryParams.push(this._extractAndFormatQueryParams(cidentifier));
        }
      });
      const query = queryParams.join(' OR ');
      this._recordService.getRecords(
        'documents', query, 1, undefined, undefined, undefined, { accept: 'application/rero+json' }
      ).subscribe((response: Record) => {
        if (this._recordService.totalHits(response.hits.total) === 0) {
          this._router.navigate(route, { queryParams: data });
        } else {
          const config = {
            initialState: {
              records: response.hits.hits
            }
          };
          const bsModalRef = this._bsModalService.show(DialogImportComponent, config);
          bsModalRef.content.confirmation$.subscribe((confirmation: boolean) => {
            if (confirmation) {
              this._router.navigate(route, { queryParams: data });
            }
          });
        }
      });
    } else {
      this._router.navigate(route, { queryParams: data });
    }
  }

  /** Source for imported record. */
  get source() {
    if (this._activatedRouter.snapshot && this._activatedRouter.snapshot.params && this._activatedRouter.snapshot.params.type !== null) {
      return this._activatedRouter.snapshot.params.type.replace('import_', '');
    }
    return null;
  }

  /** External identifier for imported record. */
  get pid() {
    if (this._activatedRouter.snapshot && this._activatedRouter.snapshot.params && this._activatedRouter.snapshot.params.pid !== null) {
      return this._activatedRouter.snapshot.params.pid;
    }
    return null;
  }

  /** On destroy hook */
  ngOnDestroy(): void {
    this._recordObs.unsubscribe();
  }

  /**
   * Get Current language interface
   * @return string - language
   */
  get currentLanguage() {
    return this._translateService.currentLang;
  }

  /**
   * Get list of document identifiers
   * @return array - identifiers
   */
  get identifiedBy() {
    const identified = this.record.metadata.identifiedBy;
    if (undefined === identified) {
      return [];
    }
    const identifiers = [];
    identified.forEach((id: any) => {
      const details = [];
      // Replace bf:Local by source
      let idType = id.type;
      if (id.type === 'bf:Local') {
        idType = id.source;
      }
      // Format qualifier, status and note
      if (id.qualifier) {
        details.push(id.qualifier);
      }
      if (id.status) {
        details.push(id.status);
      }
      if (id.note) {
        details.push(id.note);
      }
      identifiers.push({
        type: idType,
        value: id.value,
        details: details.join(', ')
      });
    });
    return identifiers;
  }

  /**
   * Get list of document edition statement
   * @return array - edition statement
   */
  getStatement(statements: any) {
    if (null === statements) {
      return [];
    }
    const results = [];
    statements.forEach((element: any) => {
      if ('_text' in element) {
        const elementText = element._text;
        const keys = Object.keys(elementText);
        const indexDefault = keys.indexOf('default');
        if (indexDefault > -1) {
          results.push(elementText.default);
          keys.splice(indexDefault, 1);
        }

        keys.forEach(key => {
          results.push(elementText[key]);
        });
      }
    });
    return results;
  }

  /**
   * Get list of document provisions activity
   * @return array - provisions activity
   */
  get provisionActivity() {
    const provisions = this.record.metadata.provisionActivity;
    if (undefined === provisions) {
      return [];
    }
    const results = {};
    provisions
      .filter((element: any) => '_text' in element)  // Keep only element with '_text'
      .map((element: any) => {
        const type =  element.type;
        if (!(type in results)) {  // if type isn't yet init
          results[type] = [];
        }
        element._text.map((e: {language: string, value: string}) => results[type].push(e.value));
      });
    return results;
  }

  /**
   * Allow to filter provisionActivity keeping only activities that aren't 'Publication'
   * @param element: the element to check
   * @return True if element isn't a 'Publication', False otherwise
   */
  filterNotPublicationProvisionActivity(element: any): boolean {
    return ('key' in element && element.key !== 'bf:Publication');
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
   * Related resources to display below 'Subjects'
   */
  get relatedResources() {
    if (this.record.metadata.electronicLocator) {
      return this.record.metadata.electronicLocator.filter(
        (electronicLocator: any) => ['noInfo', 'relatedResource', 'hiddenUrl'].some(t => t === electronicLocator.type)
      );
    }
  }

  /**
   * Resources to display like a holding
   */
  get resources() {
    if (this.record.metadata.electronicLocator) {
      return this.record.metadata.electronicLocator.filter(
        (electronicLocator: any) => ['resource', 'versionOfResource'].some(t => t === electronicLocator.type)
      );
    }
  }

  /** Get the holding type used to add a new holding. */
  get holdingType(): 'standard'|'electronic'|'serial' {
    const data = this.record.metadata;
    if (data.issuance.main_type === 'rdami:1003') {
      return 'serial';
    }
    if (data.harvested === true && data.type === 'ebook') {
      return 'electronic';
    }
    return 'standard';
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
      const volume = [this._translateService.instant('vol'), num.volume];
      numbering.push(volume.join('. '));
    }
    if (num.issue) {
      const issue = [this._translateService.instant('nr'), num.issue];
      numbering.push(issue.join('. '));
    }
    if (num.pages) {
      const pages = [this._translateService.instant('p'), num.pages];
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
          return this._translateService.instant('Journal');
      case 'monographicSeries':
          return this._translateService.instant('Series');
      default:
           return this._translateService.instant('Published in');
    }
  }

  /**
   * Get short main title
   * @param titles - document titles
   * @return - main title to display
   */
  getShortMainTitle(titles: any) {
    const bfTitles: Array<any> = titles.filter((title: any) => title.type === 'bf:Title');
    for (const bfTitle of bfTitles) {
      for (const mainTitle of bfTitle.mainTitle) {
        if (!mainTitle.language) {
          return mainTitle.value;
        }
      }
    }
  }

  contributionTypeParam(contribution: any) {
    switch (contribution.type) {
      case 'bf:Person':
        return 'persons';
      case 'bf:Organisation':
        return 'corporate-bodies';
      default:
        return 'missing-contribution-type';
    }
  }

  /**
   * Extract and format query params
   * @param identifier - IdentifiedBy object
   * @return string, query formatted
   */
   private _extractAndFormatQueryParams(identifier: any): string {
    const query = [];
    const type = identifier.type.replace(/:/g, '\\:');
    const value = identifier.value.replace(/:/g, '\\:');
    query.push(`identifiedBy.type:${type}`);
    query.push(`identifiedBy.value:${value}`);
    if (identifier.source) {
      const source = identifier.source.replace(/:/g, '\\:');
      query.push(`identifiedBy.source:${source}`);
    }
    return `(${query.join(' AND ')})`;
  }
}
