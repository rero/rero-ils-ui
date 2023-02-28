/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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

import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { RecordSearchPageComponent, RouteInterface } from "@rero/ng-core";
import { of } from "rxjs";
import { StatisticsBriefViewComponent } from '../record/brief-view/statistics-brief-view-component';
import { BaseRoute } from "./base-route";

export class StatisticsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'stats';

  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent },
      ],
      data: {
        adminMode: () => of({ can: false, message: '' }),
        types: [
          {
            key: this.name,
            label: _('Statistics'),
            editorSettings: {
              longMode: true,
            },
            component: StatisticsBriefViewComponent
          }
        ]
      }
    };
  }
}
