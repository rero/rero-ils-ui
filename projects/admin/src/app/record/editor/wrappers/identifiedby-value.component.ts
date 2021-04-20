/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FieldWrapper } from '@ngx-formly/core';
import { Record, RecordService } from '@rero/ng-core';
import issn from 'issn';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { isbn } from 'simple-isbn';

@Component({
  selector: 'admin-identifiedby-value',
  template: `
    <ng-container #fieldComponent></ng-container>
    <div *ngIf="message$ | async as message" class="invalid-feedback text-danger d-block">
      {{ message | translate }}
    </div>
    <div *ngIf="asyncRecord$ | async as record" class="invalid-feedback text-info d-block">
      {{ 'A document already exists under this reference' | translate }}:
      <a [routerLink]="['/records', 'documents', 'detail', record.pid]" target="_blank">
        {{ 'Show' | translate }}
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentifiedbyValueComponent extends FieldWrapper implements OnInit {

  /** Message observable */
  message$: Observable<any>;

  /** Record observable */
  asyncRecord$: Observable<any>;

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(private _recordService: RecordService) {
    super();
  }

  /** OnInit hook */
  ngOnInit(): void {
    const control = this.formControl;
    const type = control.parent.get('type');

    const obs = combineLatest([control.valueChanges, type.valueChanges]);
    this._initializeObservableMessage(obs);
    this._initializeObservableAsyncRecord(obs);
    setTimeout(() => {
      type.updateValueAndValidity();
    });
  }

  /**
   * Initialize message observable
   * @param obs - Observable
   */
  private _initializeObservableMessage(obs: Observable<any>): void {
    this.message$ = obs.pipe(map(([vValue, vType]) => {
      switch (vType) {
        case 'bf:Ean':
          if (vValue.indexOf('-') > -1) {
            return _('Should not contain hyphens.');
          }
          if (vValue && !isbn.isValidIsbn(vValue)) {
            return _('This EAN is not valid.');
          }
          break;
        case 'bf:Isbn':
          if (vValue.indexOf('-') > -1) {
            return _('Do not enter the hyphens.');
          }
          if (vValue && !isbn.isValidIsbn(vValue)) {
            return _('This ISBN is not valid.');
          }
          break;
        case 'bf:Issn':
          if (vValue && !issn(vValue)) {
            return _('This ISSN is not valid.');
          }
          break;
        case 'bf:IssnL':
          if (vValue && !issn(vValue)) {
            return _('This ISSN-L is not valid.');
          }
          break;
      }
      return null;
    }));
  }

  /**
   * Initialize async record observable
   * @param obs - Observable
   */
  private _initializeObservableAsyncRecord(obs: Observable<any>): void {
    this.asyncRecord$ = obs.pipe(switchMap(([vValue, vType]) => {
      const queryParams = {
        'bf:Ean': [],
        'bf:Isbn': [],
        'bf:Issn': [],
        'bf:IssnL': []
      };
      switch (vType) {
        case 'bf:Ean':
          if (vValue) {
            vValue = vValue.replace(/\-/g, '');
            queryParams['bf:Ean'].push(vValue);
            queryParams['bf:Isbn'].push(vValue);
            const query = this._queryParamsGenerate(queryParams);
            return this._queryCheck(query);
          }
          break;
        case 'bf:Isbn':
          if (vValue) {
            queryParams['bf:Ean'].push(vValue.replace(/\-/g, ''));
            queryParams['bf:Isbn'].push(vValue.replace(/\-/g, ''));
            // ISBN value with dash
            if (vValue.indexOf('-') > -1) {
              queryParams['bf:Isbn'].push(vValue);
            }
            const query = this._queryParamsGenerate(queryParams);
            return this._queryCheck(query);
          }
          break;
        case 'bf:Issn':
        case 'bf:IssnL':
          if (vValue) {
            queryParams['bf:Issn'].push(vValue);
            queryParams['bf:IssnL'].push(vValue);
            const query = this._queryParamsGenerate(queryParams);
            return this._queryCheck(query);
          }
          break;
      }
      return of(null);
    }));
  }

  /**
   * Query check
   * @param query - formatted query string
   * @return Observable
   */
  private _queryCheck(query: string): Observable<any> {
    return this._recordService.getRecords('documents', query, 1, 1).pipe(
      map((result: Record) => {
        return (this._recordService.totalHits(result.hits.total) > 0)
          ? result.hits.hits[0].metadata
          : null;
      }));
  }

  /**
   * Query params generate
   * @param queryParams - Object
   * @return string
   */
  private _queryParamsGenerate(queryParams: any): string {
    const query = [];
    const keys = Object.keys(queryParams);
    keys.forEach((key: string) => {
      const keyValues = queryParams[key];
      if (keyValues.length > 0) {
        keyValues.forEach((value: string) => {
          query.push(`(identifiedBy.type:${key.replace(/:/g, '\\:')} AND identifiedBy.value:${value})`);
        });
      }
    });
    return query.join(' OR ');
  }
}
