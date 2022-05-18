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
import { IdentifierTypes } from '../../../classes/identifiers';

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

  /** Record pid */
  recordPid: string | null;

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
    this.recordPid = this.field.templateOptions.pid;

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
   * Initialize async record observable. This observable will check if a document
   * with the same identifier exists. Alternative identifiers will also be checked.
   * @param obs - The observable to listen to detect change on identifiers
   */
  private _initializeObservableAsyncRecord(obs: Observable<any>): void {
    this.asyncRecord$ = obs.pipe(switchMap(([vValue, vType]) => {
      vValue = vValue.trim();
      if (!vValue) {
        return of(null);
      }
      const identifiersTypesToCheck = [];
      switch (vType) {
        case 'bf:Ean':
        case 'bf:Isbn':
          identifiersTypesToCheck.push(...[IdentifierTypes.EAN, IdentifierTypes.ISBN]);
          break;
        case 'bf:Issn':
        case 'bf:IssnL':
          identifiersTypesToCheck.push(...[IdentifierTypes.ISSN, IdentifierTypes.L_ISSN]);
          break;
      }
      return (identifiersTypesToCheck.length > 0)
        ? this._queryCheck(identifiersTypesToCheck.map(type => `(${type})${vValue}`))
        : of(null);
    }));
  }

  /**
   * Query check
   * @param identifierValues - list of formatted identifiers to search
   * @return Observable with document metadata if any identifiers matching a known document, null otherwise.
   */
  private _queryCheck(identifierValues: Array<string>): Observable<any> {
    return this._recordService
      .getRecords('documents', undefined, 1, 1, undefined, {identifiers: identifierValues})
      .pipe(
        map((result: Record) => {
          return (
            this._recordService.totalHits(result.hits.total) > 0
            && result.hits.hits[0].metadata.pid !== this.recordPid
          )
            ? result.hits.hits[0].metadata
            : null;
        })
      );
  }

}
