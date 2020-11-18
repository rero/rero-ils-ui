/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'shared-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements OnInit {

  /** Cover url */
  coverUrl: string;

  /** ISBN of the record */
  isbn: string;

  /** Css classes for the image */
  imageCssClass = 'img-responsive img-thumbnail border border-light';

  /** Style for image container */
  figureStyle = 'thumb-detail';

  /** Record to display */
  @Input() record: any;

  /** Should the thumbnail be small ? */
  @Input() isSmall = false;

  /**
   * Constructor
   * @param _httpClient - HttpClient
   */
  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Get cover url
   * @returns string - url of the cover if cover exists.
   */
  getCoverUrl() {
    this._httpClient.get<any>(`/api/cover/${this.isbn}`).pipe(
      catchError(e => {
        if (e.status === 404) {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (result.success) {
        this.coverUrl = result.image;
      }
    });
  }

  /**
   * On init hook
   * Set default cover image, or get cover image if exists.
   */
  ngOnInit() {
    if (this.record && this.record.metadata) {
      this.coverUrl = `/static/images/icon_${this.record.metadata.type}.png`;
      if (this.record.metadata.cover_art) {
        this.coverUrl = this.record.metadata.cover_art;
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
      if (this.isSmall) {
        this.figureStyle = 'thumb-brief';
      }
    }
  }
}
