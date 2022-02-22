/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
 * Copyright (C) 2022 UCLouvain
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
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordUiService } from '@rero/ng-core';
import { IssueItemStatus } from '@rero/shared';
import { HoldingsService } from 'projects/admin/src/app/service/holdings.service';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';

@Component({
  selector: 'admin-received-issue',
  templateUrl: './received-issue.component.html',
  styleUrls: ['../serial-holding-detail-view.style.scss']
})
export class ReceivedIssueComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** the issue to display */
  @Input() issue;
  /** the parent holding */
  @Input() holding;
  /** Emitter when an issue is deleted */
  @Output() delete = new EventEmitter();

  /** is the issue detail is collapsed or not */
  isCollapsed = true;
  /** IssueItemStatus reference */
  issueItemStatusRef = IssueItemStatus;

  // GETTER & SETTER ==========================================================

  /**
   * Get the icon title to user related to icon
   * @return: the string to use into the HTML title attribute
   */
  get iconTitle(): string {
    return (this.issue.metadata._masked)
      ? this._translateService.instant('Masked')
      : this._translateService.instant(this.issue.metadata.issue.status);
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _holdingService - HoldingService
   * @param _translateService - TranslateService
   * @param _recordPermissionService - RecordPermissionService
   * @param _recordUiService: RecordUiService
   */
  constructor(
    private _holdingService: HoldingsService,
    private _translateService: TranslateService,
    private _recordPermissionService: RecordPermissionService,
    private _recordUiService: RecordUiService,
  ) { }

  // COMPONENT FUNCTIONS ======================================================

  /**
   * Get the best possible status icon to display for this issue
   * @param: realStatus: is we need to get the real status icon or not
   * @return: a string representing the classes to use to render the icon
   */
  getIcon(realState: boolean = false): string {
    return (this.issue.metadata._masked && !realState)
      ? 'fa-eye-slash text-danger'
      : this._holdingService.getIcon(this.issue.metadata.issue.status);
  }

  /**
   * Display message if the record cannot be deleted
   * @param issue: The corresponding item (with permissions properties)
   * @return the delete info message use hover the delete button
   */
  deleteInfoMessage(issue: any): string {
    return (issue && issue.permissions && issue.permissions.delete && issue.permissions.delete.reasons)
      ? this._recordPermissionService.generateDeleteMessage(issue.permissions.delete.reasons)
      : '';
  }

  /**
   * Delete an holding issue and emit the deleted issue.
   * @param issue: The issue item to delete
   */
  deleteIssue(issue) {
    this._recordUiService.deleteRecord('items', issue.metadata.pid).subscribe(
      () => this.delete.emit(issue)
    );
  }

}
