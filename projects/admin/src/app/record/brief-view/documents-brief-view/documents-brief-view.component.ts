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
import { Component, inject, Input } from '@angular/core';
import { DocumentApiService } from '@app/admin/api/document-api.service';
import { ResultItem } from '@rero/ng-core';

@Component({
  selector: 'admin-documents-brief-view',
  templateUrl: './documents-brief-view.component.html',
  styles: []
})
export class DocumentsBriefViewComponent implements ResultItem {

  public documentApiService: DocumentApiService = inject(DocumentApiService);

  /** Set record */
  @Input() set record(record) {
    this._record = record;
    this.processProvisionActivityPublications();
  }

  @Input() type: string;

  @Input() detailUrl: { link: string, external: boolean };

  /** Provision activities */
  provisionActivityPublications: any[] = [];

  /** Record */
  private _record: any;

  /** Get current record */
  get record(): any {
    return this._record;
  }

  /** process provision activity publications */
  private processProvisionActivityPublications() {
    const { provisionActivity } = this.record.metadata;
    if (undefined === provisionActivity) {
      return;
    }
    provisionActivity.map((provision: any) => {
      if (provision.type === 'bf:Publication' && '_text' in provision) {
        provision._text.map((text: any) => this.provisionActivityPublications.push(text));
      }
    });
  }
}
