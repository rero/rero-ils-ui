// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Nl2brPipe } from '@rero/ng-core';
import { UrlActivePipe } from '@rero/shared';

@Component({
    selector: 'admin-remote-entities-person-detail-view',
    templateUrl: './remote-entities-person-detail-view.component.html',
    imports: [TranslateDirective, TranslatePipe, Nl2brPipe, UrlActivePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteEntitiesPersonDetailViewComponent {

  /** record metadata */
  record = input<any>();

  /** record source */
  source = input<string>();

  /** Disabled source link */
  disabledSourceLink = ['rero'];

  /**
   * Disabled link
   * @param source - string
   * @returns boolean
   */
  disabledLink(source: string) {
    return !this.disabledSourceLink.includes(source);
  }
}
