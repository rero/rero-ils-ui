/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
 * Copyright (C) 2022-2023 UCLouvain
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
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HoldingsService } from '@app/admin/service/holdings.service';
import { IssueService } from '@app/admin/service/issue.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslateService } from '@ngx-translate/core';
import { RecordUiService } from '@rero/ng-core';
import { IssueItemStatus, UserService } from '@rero/shared';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-received-issue',
  templateUrl: './received-issue.component.html',
  styleUrls: ['../serial-holding-detail-view.style.scss'],
  providers: [IssueService]
})
export class ReceivedIssueComponent implements OnInit, OnDestroy {

  private dialogService: DialogService = inject(DialogService);

  // COMPONENT ATTRIBUTES =====================================================
  /** the issue to display */
  @Input() issue: any;

  /** the parent holding */
  @Input() holding;
  /** Emitter when an issue is deleted */
  @Output() delete = new EventEmitter();

  /** Allow claims */
  isClaimAllowed = false;
  /** is the issue detail is collapsed or not */
  isCollapsed = true;
  /** IssueItemStatus reference */
  issueItemStatusRef = IssueItemStatus;
  /** Record permissions */
  recordPermissions: any = {};

  private subscription = new Subscription();

  // GETTER & SETTER ==========================================================

  /**
   * Get the icon title to user related to icon
   * @return the string to use into the HTML title attribute
   */
  get iconTitle(): string {
    return (this.issue.metadata._masked)
      ? this.translateService.instant('Masked')
      : this.translateService.instant(this.issue.metadata.issue.status);
  }

  /** @return last claim date */
  get claimLastDate(): string {
    return this.issue.metadata.issue.claims.dates
      .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime())[0];
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param holdingService - HoldingService
   * @param translateService - TranslateService
   * @param recordPermissionService - RecordPermissionService
   * @param recordUiService: RecordUiService
   * @param issueService: IssueService
   * @param userService: UserService
   */
  constructor(
    private holdingService: HoldingsService,
    private translateService: TranslateService,
    private recordPermissionService: RecordPermissionService,
    private recordUiService: RecordUiService,
    private issueService: IssueService,
    private userService: UserService
  ) { }

  // COMPONENT FUNCTIONS ======================================================

  /** OnInit hook */
  ngOnInit(): void {
    this.recordPermissionService
      .getPermission('items', this.issue.metadata.pid)
      .subscribe(permission => this.recordPermissions =  this.recordPermissionService.membership(
        this.userService.user,
        this.issue.metadata.library.pid,
        permission
      ));
    this.isClaimAllowed = this.issueService.isClaimAllowed(this.issue.metadata.issue.status);
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  /**
   * Get the best possible status icon to display for this issue
   * @param: realStatus: is we need to get the real status icon or not
   * @return: a string representing the classes to use to render the icon
   */
  getIcon(realState: boolean = false): string {
    return (this.issue.metadata._masked && !realState)
      ? 'fa-eye-slash text-danger'
      : this.holdingService.getIcon(this.issue.metadata.issue.status);
  }

  /**
   * Display message if the record cannot be deleted
   * @param issue: The corresponding item (with permissions properties)
   * @return the delete info message use hover the delete button
   */
  deleteInfoMessage(issue: any): string {
    return (this.recordPermissions?.delete?.reasons)
      ? this.recordPermissionService.generateDeleteMessage(this.recordPermissions.delete.reasons)
      : '';
  }

  /**
   * Delete an holding issue and emit the deleted issue.
   * @param issue: The issue item to delete
   */
  deleteIssue(issue) {
    this.recordUiService.deleteRecord('items', issue.metadata.pid).subscribe(
      () => this.delete.emit(issue)
    );
  }

  /** Open claim dialog */
  openClaimEmailDialog(): void {
    const ref: DynamicDialogRef = this.issueService.openClaimEmailDialog(this.issue);
    this.subscription.add(
      ref.onClose.subscribe((record: any) => this.issue = record)
    );
  }
}
