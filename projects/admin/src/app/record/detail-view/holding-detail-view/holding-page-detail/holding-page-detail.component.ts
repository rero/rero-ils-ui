// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject } from '@angular/core';
import { DetailButtonComponent, DetailComponent, ErrorComponent } from '@rero/ng-core';
import { AppStore, OperationLogsDialogComponent } from '@rero/shared';

@Component({
  selector: 'admin-holding-page-detail',
  templateUrl: './holding-page-detail.component.html',
  imports: [DetailButtonComponent, OperationLogsDialogComponent, ErrorComponent],
})
export class HoldingPageDetailComponent extends DetailComponent {
  protected appStore = inject(AppStore);
}
