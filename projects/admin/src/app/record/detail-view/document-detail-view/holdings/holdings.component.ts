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

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordUiService } from '@rero/ng-core';
import { IPermissions, PERMISSIONS, UserService } from '@rero/shared';
import { HoldingsApiService } from 'projects/admin/src/app/api/holdings-api.service';
import { forkJoin, Observable } from 'rxjs';
import { RecordPermissionService } from '../../../../service/record-permission.service';

@Component({
  selector: 'admin-holdings',
  templateUrl: './holdings.component.html'
})
export class HoldingsComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** Document */
  @Input() document: any;
  /** Holding type related to the parent document. */
  @Input() holdingType: 'electronic' | 'serial' | 'standard';
  /** Restrict the functionality of interface */
  @Input() isCurrentOrganisation = true;

  /** Holdings total */
  holdingsTotal = 0;
  /** Current page */
  page = 1;
  /** query */
  query: string;
  /** Holdings */
  holdings: any[];
  /** Can a new holding be added? */
  canAdd = false;

  // GETTER & SETTER ==========================================================
  /**
   * Is the link `show more holdings` must be displayed.
   * @return boolean
   */
  get isLinkShowMore(): boolean {
    return this.holdingsTotal > 0
      && ((this.page * this._holdingsApiService.ITEMS_PER_PAGE) < this.holdingsTotal);
  }

  /**
   * Hidden holdings count
   * @return string
   */
  get hiddenHoldings(): string {
    let count = this.holdingsTotal - (this.page * this._holdingsApiService.ITEMS_PER_PAGE);
    if (count < 0) {
      count = 0;
    }
    const linkText = (count > 1)
      ? '{{ counter }} hidden holdings'
      : '{{ counter }} hidden holding';
    const linkTextTranslate = this._translateService.instant(linkText);
    return linkTextTranslate.replace('{{ counter }}', count);
  }

  /** return the document pid */
  get documentPid(): string {
    return this.document.metadata.pid;
  }

  /** return the organisation pid */
  get organisationPid(): string {
    return this._userService.user.currentOrganisation;
  }

  /** return all available permissions for current user */
  permissions: IPermissions = PERMISSIONS;

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _userService - UserService
   * @param _holdingsApiService - HoldingsApiService
   * @param _recordUiService - RecordUiService
   * @param _recordPermissionService - RecordPermissionService
   * @param _translateService - TranslateService
   */
  constructor(
    private _userService: UserService,
    private _holdingsApiService: HoldingsApiService,
    private _recordUiService: RecordUiService,
    private _recordPermissionService: RecordPermissionService,
    private _translateService: TranslateService
  ) { }

  /** onInit hook */
  ngOnInit() {
    this.canAdd = this.isCurrentOrganisation && (!('harvested' in this.document.metadata));
    const holdingsRecords = this._holdingsQuery(this.documentPid, this.organisationPid, 1, this.isCurrentOrganisation);
    const holdingsCount = this._holdingsCountQuery(this.documentPid, this.organisationPid, this.isCurrentOrganisation);
    if (this.isCurrentOrganisation) {
      const permissionsRef = this._recordPermissionService.getPermission('holdings');
      forkJoin([holdingsRecords, holdingsCount, permissionsRef])
        .subscribe((result: [any[], number, any]) => {
          this.holdings = result[0];
          this.holdingsTotal = result[1];
          const permissions = result[2];
          this.canAdd = this.canAdd && permissions.create.can;
        });
    } else {
      forkJoin([holdingsRecords, holdingsCount]).subscribe(([records, count]) => {
        this.holdings = records;
        this.holdingsTotal = count;
      });
    }
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Handler when `show more` ink is clicked */
  showMore() {
    this.page++;
    this._holdingsQuery(this.documentPid, this.organisationPid, this.page, this.isCurrentOrganisation)
      .subscribe((holdings: any[]) => {
        this.holdings = this.holdings.concat(holdings);
      });
  }

  /**
   * Delete a given holding.
   * @param data: object with 2 keys :
   *          * 'holding' : the holding to delete
   *          * 'callBackend' : boolean if backend API should be called
   */
  deleteHolding(data: { holding: any, callBackend: boolean }) {
    const holding = data.holding;
    if (data.callBackend === false) {
      this.holdings = this.holdings.filter(
        h => h.metadata.pid !== holding.metadata.pid
      );
    } else {
      this._recordUiService.deleteRecord('holdings', holding.metadata.pid)
        .subscribe((success: any) => {
          if (success) {
            this.holdings = this.holdings.filter(
              h => h.metadata.pid !== holding.metadata.pid
            );
          }
        });
    }
  }

  /**
   * Holdings count
   * @param documentPid - document pid
   * @param organisationPid - organisation pid
   * @param isCurrentOrganisation - is current organisation
   * @returns Observable
   */
  private _holdingsCountQuery(
    documentPid: string, organisationPid: string, isCurrentOrganisation: boolean = true): Observable<number> {
    return this._holdingsApiService.getHoldingsCount(documentPid, organisationPid, isCurrentOrganisation);
  }


  /**
   * Get holdings records
   * @param documentPid - document pid
   * @param organisationPid - organisation pid
   * @param page - current page
   * @param isCurrentOrganisation - is current organisation
   * @returns Observable
   */
  private _holdingsQuery(
    documentPid: string, organisationPid: string, page: number, isCurrentOrganisation: boolean = true): Observable<any> {
    return this._holdingsApiService.getHoldings(
      documentPid, organisationPid, isCurrentOrganisation, page, this._holdingsApiService.ITEMS_PER_PAGE);
  }
}
