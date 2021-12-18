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
import { RecordService, RecordUiService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { IssueItemStatus, UserService } from '@rero/shared';
import { ToastrService } from 'ngx-toastr';
import { HoldingsService, PredictionIssue } from 'projects/admin/src/app/service/holdings.service';
import { OperationLogsService } from 'projects/admin/src/app/service/operation-logs.service';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';


@Component({
  selector: 'admin-serial-holding-detail-view',
  templateUrl: './serial-holding-detail-view.component.html',
  styleUrls: ['./serial-holding-detail-view.style.scss']
})
export class SerialHoldingDetailViewComponent implements OnInit {

  /** the holding record */
  @Input() holding: any;

  /** array of receive items for this holding */
  receivedItems = [];

  /** array of prediction for this holding */
  predictionsItems: Array<PredictionIssue> = [];

  /** received issue counter : number of received issue to load/display */
  private _receivedIssueCounter = 5;

  /** total number of received item for this holding */
  totalReceivedItems = 0;

  /** prediction issue counter : number of prediction issue to load/display */
  private _predictionIssueCounter = 3;

  /** reference to IssueItemStatus */
  issueItemStatus = IssueItemStatus;

  /**
   * Is operation log enabled
   * @return boolean
   */
  get isEnabledOperationLog(): boolean {
    return this._operationLogsService.isLogVisible('holdings');
  }

  /**
   * Constructor
   *
   * @param _holdingService: HoldingService
   * @param _recordService: RecordService
   * @param _recordUiService: RecordUiService
   * @param _recordPermissionService: RecordPermissionService
   * @param _translateService: TranslateService,
   * @param _toastrService: ToastrService
   * @param _operationLogsService: OperationLogsService
   * @param _userService: UserService
   */
  constructor(
    private _holdingService: HoldingsService,
    private _recordService: RecordService,
    private _recordUiService: RecordUiService,
    private _recordPermissionService: RecordPermissionService,
    private _translateService: TranslateService,
    private _toastrService: ToastrService,
    private _operationLogsService: OperationLogsService,
    private _userService: UserService
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
        '-issue_expected_date'
      ).subscribe((result: Record) => {
        this.totalReceivedItems = this._recordService.totalHits(result.hits.total);
        this.receivedItems = [];
        result.hits.hits.forEach(item => this.receivedItems.push(this._loadItem(item)), this);
      });
  }

  /**
   * Load a received item ; also load item permissions
   * @param item: the item to load
   * @return Return the item with linked permissions
   */
  private _loadItem(item: any) {
    const recordPermission = this._recordPermissionService;
    recordPermission.getPermission('items', item.id)
    .subscribe((permission) => {
      item.permissions = recordPermission
        .membership(this._userService.user, item.metadata.library.pid, permission);
    });
    return item;
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
   * Display message if the record cannot be deleted
   * @param item: The corresponding item (with permissions properties)
   * @return the delete info message use hover the delete button
   */
  deleteInfoMessage(item: any): string {
    return (item && item.permissions && item.permissions.delete && item.permissions.delete.reasons)
      ? this._recordPermissionService.generateDeleteMessage(item.permissions.delete.reasons)
      : '';
  }

  /**
   * Delete an holding issue.
   * @param item: The issue item to delete
   */
  deleteIssue(item) {
    this._recordUiService.deleteRecord('items', item.metadata.pid).subscribe(
      () => {
        this.receivedItems = this.receivedItems.filter(el => el.metadata.pid !== item.metadata.pid);
      }
    );
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
          permissions: {},
          new_issue: true  // Used to flag this issue as new received issue ; allowing to display a visual badge for user
        };
        this.receivedItems.unshift(this._loadItem(item));
        this._loadPrediction(); // as we received a predicted issue, we need to reload predictions
      },
      (error) => {
        const message = `[${error.status}-${error.statusText}] ${error.error.message}`;
        this._toastrService.error(message, this._translateService.instant('Issue creation failed!'));
      }
    );
  }

  /**
   * Make the method getIcon from holdingService available
   * @param status: the item status
   *  @return: the font-awsome icon to use
   */
  getIcon(status: IssueItemStatus): string {
    return this._holdingService.getIcon(status);
  }
}

