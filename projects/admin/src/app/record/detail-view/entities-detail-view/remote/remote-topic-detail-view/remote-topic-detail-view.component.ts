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

import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'admin-remote-topic-detail-view',
    templateUrl: './remote-topic-detail-view.component.html',
    standalone: false
})
export class RemoteTopicDetailViewComponent implements OnInit{

  /** Record metadata */
  @Input() record: any;

  /** Record source */
  @Input() source: string;

  exactMatch = [];
  closeMatch = [];

  ngOnInit(): void {
    this.exactMatch = this.identifiedByUriFilter(this.record.exactMatch);
    this.closeMatch = this.identifiedByUriFilter(this.record.closeMatch);
  }
  identifiedByUriFilter(match: any[]): any[] {
    return match?.map((m: any) => {
      const element = {
        authorized_access_point: m.authorized_access_point,
        source: m.source
      };
      const uris = m.identifiedBy?.filter((id: any) => id.type === 'uri') || [];
      if (uris.length > 0) {
        element['uri'] = uris.shift().value;
      }

      return element;
    });
  }
}
