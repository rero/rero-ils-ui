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
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'admin-document-detail-view',
  templateUrl: './document-detail-view.component.html',
  styles: []
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

  /** Css class for dd in template */
  ddCssClass = 'col-sm-6 col-md-8 mb-0';

  /** constructor
   * @param _translateService - TranslateService to translate some strings.
   * @param _router - ActivatedRoute to get url parameters.
   * @param _recordService - RecordService to the MARC version for the record.
   */
  constructor(
    private _translateService: TranslateService,
    private _router: ActivatedRoute,
    private _recordService: RecordService
  ) { }

  /** On init hook */
  ngOnInit() {
    this._recordObs = this.record$.subscribe((record: any) => {
      this.record = record;
      // only for imported record
      if (record != null && record.metadata != null && this.record.metadata.pid == null) {
        this.marc$ = this._recordService.getRecord(
          this._router.snapshot.params.type, this.pid, 0, {
          Accept: 'application/marc+json, application/json'
        });
      } else {
        this.marc$ = of(null);
      }
    });
  }

  /** Source for imported record. */
  get source() {
    if (this._router.snapshot && this._router.snapshot.params && this._router.snapshot.params.type !== null) {
      return this._router.snapshot.params.type.replace('import_', '');
    }
    return null;
  }

  /** External identifier for imported record. */
  get pid() {
    if (this._router.snapshot && this._router.snapshot.params && this._router.snapshot.params.pid !== null) {
      return this._router.snapshot.params.pid;
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
      const status = id.status;
      let idType = id.type;
      if ((undefined === status || status === 'valid') && id.type !== 'bf:Local') {
        if (id.type.indexOf(':') !== -1) {
          idType = id.type.split(':')[1];
        }
        identifiers.push({type: idType, value: id.value });
      }
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
    provisions.map((element: any) => {
      const type =  element.type;
      if ('_text' in element) {
        const elementText = element._text;
        if (!(type in results)) {
          results[type] = [];
        }
        elementText.map(
          (e: {language: string, value: string}) => results[type].push(e.value)
        );
      }
    });

    return results;
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
}
