// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { _ } from '@ngx-translate/core';
import { DetailButtonComponent, DetailComponent, ErrorComponent } from '@rero/ng-core';
import { AppStore, OperationLogsDialogComponent, sortOptionType } from '@rero/shared';

@Component({
  selector: 'admin-patron-detail',
  imports: [DetailButtonComponent, OperationLogsDialogComponent, ErrorComponent],
  templateUrl: './patron-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatronDetailComponent extends DetailComponent {

  protected appStore = inject(AppStore);

  protected sortCriteria = signal<string>('operation_date_mostrecent');

  protected sortOptions = signal<sortOptionType[]>([
    { value: 'operation_date_mostrecent', label: _('Date (newest)'), icon: 'fa fa-sort-amount-desc' },
    { value: 'operation_date_created', label: _('Date (oldest)'), icon: 'fa fa-sort-amount-asc' }
  ]);
}
