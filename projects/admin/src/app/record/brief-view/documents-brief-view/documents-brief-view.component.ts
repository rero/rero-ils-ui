/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { Component, Input } from '@angular/core';
import { DocumentApiService } from '@app/admin/api/document-api.service';
import { ResultItem } from '@rero/ng-core';

@Component({
  selector: 'admin-documents-brief-view',
  templateUrl: './documents-brief-view.component.html',
  styles: []
})
export class DocumentsBriefViewComponent implements ResultItem {

  @Input()
  record: any;

  @Input()
  type: string;

  @Input()
  detailUrl: { link: string, external: boolean };

  /** process provision activity publications */
  get provisionActivityPublications() {
    const provisionActivity = this.record.metadata.provisionActivity;
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

  /**
   * Constructor
   * @param documentApiService - DocumentApiService
   */
  constructor(public documentApiService: DocumentApiService) {}

  /**
   * Contribution type parameter
   * @param contribution - object
   * @return string - type of agent
   */
  contributionTypeParam(contribution: any) {
    switch (contribution.type) {
      case 'bf:Person':
        return 'persons';
      case 'bf:Organisation':
        return 'corporate-bodies';
      default:
        return 'missing-contribution-type';
    }
  }
}
