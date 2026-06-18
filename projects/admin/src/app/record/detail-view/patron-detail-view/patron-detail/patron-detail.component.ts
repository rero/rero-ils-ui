// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DetailButtonComponent, DetailComponent, ErrorComponent } from '@rero/ng-core';
import { AppStore, OperationLogsDialogComponent } from '@rero/shared';

@Component({
  selector: 'admin-patron-detail',
  imports: [DetailButtonComponent, OperationLogsDialogComponent, ErrorComponent],
  templateUrl: './patron-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatronDetailComponent extends DetailComponent {

  protected appStore = inject(AppStore);
}
