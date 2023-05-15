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
import { RecordPermissions } from '@app/admin/classes/permissions';
import { HoldingsService, PredictionIssue } from '@app/admin/service/holdings.service';
import { OperationLogsService } from '@app/admin/service/operation-logs.service';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { IPermissions, IssueItemStatus, PERMISSIONS, PermissionsService } from '@rero/shared';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'admin-serial-holding-detail-view',
  templateUrl: './serial-holding-detail-view.component.html',
  styleUrls: ['./serial-holding-detail-view.style.scss']
})
export class SerialHoldingDetailViewComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** the holding record */
  @Input() holding: any;

  /** array of receive items for this holding */
  receivedItems = [];
  /** array of prediction for this holding */
  predictionsItems: Array<PredictionIssue> = [];
  /** total number of received item for this holding */
  totalReceivedItems = 0;
  /** reference to IssueItemStatus */
  issueItemStatus = IssueItemStatus;
  /** return all permissions */
  permissions: IPermissions = PERMISSIONS;
  /** record permissions */
  recordPermissions: RecordPermissions;

  /** received issue counter : number of received issue to load/display */
  private _receivedIssueCounter = 5;
  /** prediction issue counter : number of prediction issue to load/display */
  private _predictionIssueCounter = 3;


  // GETTER & SETTER ==========================================================
  /** Is operation log enabled */
  get isEnabledOperationLog(): boolean {
    return this._operationLogsService.isLogVisible('holdings');
  }

  /**
   * Show or hide local fields tab
   * @return boolean - if False, hide the local fields tab
   */
  get showhideLocalFieldsTab(): boolean {
    return this._permissionsService.canAccess([PERMISSIONS.LOFI_SEARCH, PERMISSIONS.LOFI_CREATE]);
  }


  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _holdingService: HoldingService
   * @param _recordService: RecordService
   * @param _translateService: TranslateService,
   * @param _toastrService: ToastrService
   * @param _operationLogsService: OperationLogsService
   * @param _permissionsService: PermissionsService
   */
  constructor(
    private _holdingService: HoldingsService,
    private _recordService: RecordService,
    private _translateService: TranslateService,
    private _toastrService: ToastrService,
    private _operationLogsService: OperationLogsService,
    private _permissionsService: PermissionsService
  ) {}

  /**
   * Init hook
   */
  ngOnInit(): void {
    this._loadPrediction();
    this._loadReceivedItems();
  }

  /**
   * Load prediction issues corresponding to the holding.
   */
  private _loadPrediction() {
    this._holdingService.getHoldingPatternPreview(this.holding.id, this._predictionIssueCounter).subscribe(
      (predictions) => {
        this.predictionsItems = predictions;
      }
    );
  }

  /**
   * Load received items corresponding to the holding.
   */
  private _loadReceivedItems() {
    this._recordService
      .getRecords(
        'items',
        `holding.pid:${this.holding.id} AND NOT type:provisional`,
        1,
        this._receivedIssueCounter,
        [], {}, null,
        '-issue_sort_date'
      ).subscribe((result: Record) => {
        this.totalReceivedItems = this._recordService.totalHits(result.hits.total);
        this.receivedItems = result.hits.hits;
      });
  }

  /**
   * Action to perform when user click on a showMore link
   * @param type - string: the type of item to load more
   * @param increment - number: the number to data to load
   */
  showMore(type: string, increment= 10) {
    if (type === 'received') {
      this._receivedIssueCounter += increment;
      this._loadReceivedItems();
    }
    if (type === 'prediction') {
      this._predictionIssueCounter += increment;
      this._loadPrediction();
    }
  }

  /**
   * Get the counter string about not loaded items
   * @return the string to display with the 'show more' link
   */
  get showMoreIssuesCounter() {
    const additionalIssueCounter = this.totalReceivedItems - this.receivedItems.length;
    return (additionalIssueCounter === 1)
      ? this._translateService.instant('1 hidden issue')
      : this._translateService.instant('{{ counter }} hidden issues',
        {counter: additionalIssueCounter});
  }

  /**
   * Delete an holding issue.
   * @param item: The issue item to delete
   */
  deleteIssue(item) {
    this.receivedItems = this.receivedItems.filter(el => el.metadata.pid !== item.metadata.pid);
  }

  /**
   * Quick received issue
   * This function allow to received the next predicted issue for a serial holding
   */
  quickIssueReceive() {
    this._holdingService.quickReceivedIssue(this.holding).subscribe(
      (result) => {
        this._toastrService.success(this._translateService.instant('New issue created.'));
        // change item structure to have same structure as received items
        const item = {
          id: result.issue.pid,
          metadata: result.issue,
          new_issue: true  // Used to flag this issue as new received issue ; allowing to display a visual badge for user
        };
        this.receivedItems.unshift(item);
        this._loadPrediction(); // as we received a predicted issue, we need to reload predictions
      },
      (error) => {
        const message = `[${error.status}-${error.statusText}] ${error.error.message}`;
        this._toastrService.error(message, this._translateService.instant('Issue creation failed!'));
      }
    );
  }
}

