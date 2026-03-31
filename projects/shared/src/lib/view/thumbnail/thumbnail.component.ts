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
import { Component, Input, OnInit } from '@angular/core';


@Component({
    selector: 'shared-thumbnail',
    templateUrl: './thumbnail.component.html',
    standalone: false
})
export class ThumbnailComponent implements OnInit {

  /** Cover url */
  coverUrl: string;

  /** is a svg image */
  svgImage = true;

  /** Record to display */
  @Input() record: any;

  /** Style for image container */
  @Input() styleClass = 'ui:w-24';

  /**
   * On init hook
   * Set default cover image, or get cover image if exists.
   */
  ngOnInit() {
    if (this.record && this.record.metadata) {
      this.coverUrl = `/static/images/icon_${this.record.metadata.type[0].main_type}.svg`;
      const cover = this.record.metadata.electronicLocator?.find(
        (e: { content?: string; type: string; url: string }) => e.content === 'coverImage' && e.type === 'relatedResource'
      );
      if (cover) {
        this.coverUrl = cover.url;
        this.svgImage = false;
      }
    }
  }
}
