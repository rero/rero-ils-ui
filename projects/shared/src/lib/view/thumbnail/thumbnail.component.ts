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
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
    selector: 'shared-thumbnail',
    templateUrl: './thumbnail.component.html',
    standalone: false
})
export class ThumbnailComponent implements OnInit {

  protected httpClient: HttpClient = inject(HttpClient);

  /** Cover url */
  coverUrl: string;

  /** ISBN of the record */
  isbn: string;

  /** is a svg image */
  svgImage = true;

  /** Record to display */
  @Input() record: any;

  /** Style for image container */
  @Input() styleClass = 'ui:w-24';

  /**
   * Get cover url
   * @returns string - url of the cover if cover exists.
   */
  getCoverUrl() {
    this.httpClient.get<any>(`/api/document/cover/${this.isbn}`).pipe(
      catchError(e => {
        if (e.status === 404) {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (result !== null && result.success) {
        this.coverUrl = result.image;
        this.svgImage = false;
      }
    });
  }

  /**
   * On init hook
   * Set default cover image, or get cover image if exists.
   */
  ngOnInit() {
    if (this.record && this.record.metadata) {
      this.coverUrl = `/static/images/icon_${this.record.metadata.type[0].main_type}.svg`;
      const cover = this.record.metadata.electronicLocator?.filter((e: any) => e.content === 'coverImage' && e.type=== 'relatedResource');
      if (this.record.metadata.electronicLocator && cover.length > 0) {
        this.coverUrl = cover[0].url;
        this.svgImage = false;
      } else if (this.record.metadata.identifiedBy) {
        for (const identifier of this.record.metadata.identifiedBy) {
          if (identifier.type === 'bf:Isbn') {
            this.isbn = identifier.value;
          }
        }
        if (this.isbn) {
          this.getCoverUrl();
        }
      }
    }
  }
}
