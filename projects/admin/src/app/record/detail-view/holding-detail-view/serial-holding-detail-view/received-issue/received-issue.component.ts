// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass, NgPlural, NgPluralCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HoldingsService } from '@app/admin/service/holdings.service';
import { IssueService } from '@app/admin/service/issue.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';
import { AppStore, EsRecord, InheritedCallNumberComponent, IssueItemStatus, OpenCloseButtonComponent } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { HoldingsSerialStore } from '../../holdings-serial-store';

@Component({
    selector: 'admin-received-issue',
    templateUrl: './received-issue.component.html',
    providers: [IssueService],
    imports: [NgClass, OpenCloseButtonComponent, RouterLink, Bind, Tag, InheritedCallNumberComponent, TranslateDirective, NgPlural, NgPluralCase, Button, Tooltip, TranslatePipe, DateTranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceivedIssueComponent implements OnInit, OnDestroy {

  protected store = inject(HoldingsSerialStore);

  private holdingService: HoldingsService = inject(HoldingsService);
  private translateService: TranslateService = inject(TranslateService);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private issueService: IssueService = inject(IssueService);
  private appStore = inject(AppStore);

  // COMPONENT ATTRIBUTES =====================================================
  /** the issue to display */
  issue = input<any>();

  /** the parent holding */
  holding = input<any>();

  /** Allow claims */
  isClaimAllowed = false;
  /** is the issue detail is collapsed or not */
  isCollapsed = true;
  /** IssueItemStatus reference */
  issueItemStatusRef = IssueItemStatus;
  /** Record permissions */
  readonly recordPermissions = signal<any>({});

  private subscription = new Subscription();

  // GETTER & SETTER ==========================================================

  /**
   * Get the icon title to user related to icon
   * @return the string to use into the HTML title attribute
   */
  get iconTitle(): string {
    return (this.issue().metadata._masked)
      ? this.translateService.instant('Masked')
      : this.translateService.instant(this.issue().metadata.issue.status);
  }

  /** @return last claim date */
  get claimLastDate(): string {
    return this.issue().metadata.issue.claims.dates
      .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime())[0];
  }

  // COMPONENT FUNCTIONS ======================================================

  /** OnInit hook */
  ngOnInit(): void {
    this.recordPermissionService
      .getPermission('items', this.issue().metadata.pid)
      .subscribe(permission => this.recordPermissions.set(this.recordPermissionService.membership(
        this.appStore.currentLibraryPid(),
        this.issue().metadata.library.pid,
        permission
      )));
    this.isClaimAllowed = this.issueService.isClaimAllowed(this.issue().metadata.issue.status);
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  /**
   * Get the best possible status icon to display for this issue
   * @param: realStatus: is we need to get the real status icon or not
   * @return: a string representing the classes to use to render the icon
   */
  getIcon(realState = false): string {
    return (this.issue().metadata._masked && !realState)
      ? 'fa-eye-slash text-error'
      : this.holdingService.getIcon(this.issue().metadata.issue.status);
  }

  /**
   * Display message if the record cannot be deleted
   * @param issue: The corresponding item (with permissions properties)
   * @return the delete info message use hover the delete button
   */
  deleteInfoMessage(): string {
    return (this.recordPermissions()?.delete?.reasons)
      ? this.recordPermissionService.generateTooltipMessage(this.recordPermissions().delete.reasons, 'delete')
      : '';
  }

  /** Open claim dialog */
  openClaimEmailDialog(): void {
    const ref: DynamicDialogRef = this.issueService.openClaimEmailDialog(this.issue());
    this.subscription.add(
      ref.onClose.subscribe((record: EsRecord) => {
        if (record) {
          this.store.updateItem(record);
        }
      })
    );
  }
}
