// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, Signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Tag } from '@openng/optimus-ui/tag';

import { Match, RawIdentifier, RawMatch } from './model/remote-topic-model';

@Component({
  selector: 'admin-remote-topic-detail-view',
  templateUrl: './remote-topic-detail-view.component.html',
  imports: [Bind, Tag, NgTemplateOutlet, TranslatePipe],
})
export class RemoteTopicDetailViewComponent {
  /** Record metadata */
  record = input<any>();

  /** Record source */
  source = input<string>();

  /**
   * Matches derived from the `record` input, so that navigating to another remote
   * entity — which only rebinds the input, without recreating this component —
   * refreshes them.
   */
  readonly exactMatch: Signal<Match[]> = computed(() => this.identifiedByUriFilter(this.record()?.exactMatch));
  readonly closeMatch: Signal<Match[]> = computed(() => this.identifiedByUriFilter(this.record()?.closeMatch));

  /**
   * Keep the access point, the source and the first URI of each match.
   * @param match - the raw matches of the record, may be undefined
   * @returns the matches formatted for display, empty when there is none
   */
  private identifiedByUriFilter(match: RawMatch[]): Match[] {
    return (match ?? []).map((m: RawMatch) => {
      const element: Match = {
        authorized_access_point: m.authorized_access_point,
        source: m.source,
      };
      const uris = m.identifiedBy?.filter((id: RawIdentifier) => id.type === 'uri') || [];
      if (uris.length > 0) {
        element.uri = uris.shift().value;
      }

      return element;
    });
  }
}
