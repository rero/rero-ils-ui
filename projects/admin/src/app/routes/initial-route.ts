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
import { IRoute } from '@rero/ng-core';
import { FrontpageComponent } from '../widgets/frontpage/frontpage.component';

export class InitialRoute implements IRoute {

  /** Route name */
  readonly name = 'initial-route';

  /** Priority */
  readonly priority = 255;

  /**
   * Get Configuration
   * @return array
   */
  getConfiguration() {
    return [
      {
        path: '',
        component: FrontpageComponent
      },
      {
        path: 'circulation',
        loadChildren: () => import('../circulation/circulation.module').then(m => m.CirculationModule)
      }
    ];
  }
}
