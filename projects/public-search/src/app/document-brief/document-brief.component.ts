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
import { Component, inject, Input } from '@angular/core';
import { DocumentApiService } from '../api/document-api.service';

@Component({
    selector: 'public-search-document-brief',
    templateUrl: './document-brief.component.html',
    standalone: false
})
export class DocumentBriefComponent {

  public coverUrl: string;
  private pathArray = window.location.pathname.split('/');
  public documentApiService: DocumentApiService = inject(DocumentApiService);
  private _record: any;

  @Input() detailUrl: { link: string, external: boolean };
  @Input() viewcode = this.pathArray[1];
  @Input() set record(value) {
    if (value !== undefined) {
      this._record = value;
    }
  }

  get record() {
    return this._record;
  }

  /** process provision activity publications */
  get provisionActivityPublications() {
    const { provisionActivity } = this._record.metadata;
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
}
