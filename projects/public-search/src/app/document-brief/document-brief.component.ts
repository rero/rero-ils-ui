/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService as LocalRecordService } from '../record.service';

@Component({
  selector: 'public-search-document-brief',
  templateUrl: './document-brief.component.html',
  styleUrls: ['./document-brief.component.scss']
})
export class DocumentBriefComponent {
  public coverUrl: string;
  private pathArray = window.location.pathname.split('/');
  private _record: any;

  @Input() detailUrl: string;
  @Input() viewcode = this.pathArray[1];
  @Input() set record(value) {
    if (value !== undefined) {
      this._record = value;
      this.coverUrl = `/static/images/icon_${value.metadata.type}.png`;
      if (value.metadata.cover_art) {
        this.coverUrl = value.metadata.cover_art;
      } else if (value.metadata.identifiedBy) {
        let isbn;
        for (const identifier of value.metadata.identifiedBy) {
          if (identifier.type === 'bf:Isbn') {
            isbn = identifier.value;
          }
        }
        if (isbn) {
          this.getCover(isbn);
        }
      }
    }
  }

  get record() {
    return this._record;
  }

  /** process provision activity publications */
  get provisionActivityPublications() {
    const provisionActivity = this._record.metadata.provisionActivity;
    const publications = [];
    if (undefined === provisionActivity) {
      return publications;
    }
    provisionActivity.map((provision: any) => {
      if (provision.type === 'bf:Publication' && '_text' in provision) {
        provision._text.map((text: any) => publications.push(text));
      }
    });
    return publications;
  }

  constructor(
    private translate: TranslateService,
    private localRecordService: LocalRecordService
  ) {  }

    /**
     * Get author name
     */
  authorName(author) {
    const nameIndex = `name_${this.translate.currentLang}`;
    let nameLng = author[nameIndex];
    if (!nameLng) {
      nameLng = author.name;
    }
    return nameLng;
  }

    /**
     * Load cover image
     */
  getCover(isbn: string) {
    this.localRecordService.getCover(isbn).subscribe(result => {
      if (result.success) {
        this.coverUrl = result.image;
      }
    });
  }
}
