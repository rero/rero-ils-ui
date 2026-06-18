// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-remote-entities-organisation-detail-view',
    templateUrl: './remote-entities-organisation-detail-view.component.html',
    imports: [TranslateDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteEntitiesOrganisationDetailViewComponent {

  /** Record metadata */
  record = input<any>();

  /** Record source */
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
