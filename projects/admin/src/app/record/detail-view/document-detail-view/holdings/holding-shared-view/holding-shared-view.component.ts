// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Nl2brPipe } from '@rero/ng-core';

@Component({
  selector: 'admin-holding-shared-view',
  templateUrl: './holding-shared-view.component.html',
  styles: ['dl.metadata > dd { font-weight: normal; }'],
  imports: [TranslatePipe, Nl2brPipe],
})
export class HoldingSharedViewComponent {
  /** the holding record */
  holding = input<any>();
}
