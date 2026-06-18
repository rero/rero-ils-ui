// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, ChangeDetectionStrategy} from '@angular/core';
import { AppStore, OperationLogsDialogComponent } from '@rero/shared';
import { DetailComponent, DetailButtonComponent, ErrorComponent } from '@rero/ng-core';

@Component({
    selector: 'admin-holding-page-detail',
    templateUrl: './holding-page-detail.component.html',
    imports: [DetailButtonComponent, OperationLogsDialogComponent, ErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingPageDetailComponent extends DetailComponent {

  protected appStore = inject(AppStore);
}
