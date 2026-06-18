// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SafeUrlPipe } from '@rero/shared';

@Component({
    selector: 'admin-related-resource',
    templateUrl: './related-resource.component.html',
    imports: [TranslatePipe, SafeUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelatedResourceComponent {

  electronicLocator = input<any>();

  /**
   * Format public note for display
   * @param electronicLocator: electronic locator to filter
   */
  get publicNotes(): any {
    if (this.electronicLocator().publicNote) {
      return this.electronicLocator().publicNote.join(', ');
    }
  }
}
