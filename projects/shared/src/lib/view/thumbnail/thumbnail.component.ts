// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'shared-thumbnail',
  templateUrl: './thumbnail.component.html',
  imports: [NgClass, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThumbnailComponent {
  /** Record to display */
  readonly record = input.required<{
    metadata: {
      type: { main_type: string; subtype?: string }[];
      electronicLocator?: { content?: string; type: string; url: string }[];
    };
  }>();

  /** Style for image container */
  readonly styleClass = input('ui:w-24');

  readonly coverUrl = computed(() => {
    const record = this.record();
    if (!record.metadata) return undefined;
    const cover = record.metadata.electronicLocator?.find(
      (e: { content?: string; type: string; url: string }) =>
        e.content === 'coverImage' && e.type === 'relatedResource',
    );
    return cover?.url ?? `/static/images/icon_${record.metadata.type[0].main_type}.svg`;
  });
}
