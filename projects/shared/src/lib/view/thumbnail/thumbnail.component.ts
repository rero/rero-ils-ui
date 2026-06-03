/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
 * Copyright (C) 2019-2023 UCLouvain
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
    selector: 'shared-thumbnail',
    templateUrl: './thumbnail.component.html',
    imports: [NgClass, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThumbnailComponent {

  /** Record to display */
  readonly record = input<{ metadata: { type: { main_type: string; subtype?: string }[]; electronicLocator?: { content?: string; type: string; url: string }[] } }>();

  /** Style for image container */
  readonly styleClass = input('ui:w-24');

  readonly coverUrl = computed(() => {
    const record = this.record();
    if (!record?.metadata) return undefined;
    const cover = record.metadata.electronicLocator?.find(
      (e: { content?: string; type: string; url: string }) =>
        e.content === 'coverImage' && e.type === 'relatedResource'
    );
    return cover?.url ?? `/static/images/icon_${record.metadata.type[0].main_type}.svg`;
  });

}
