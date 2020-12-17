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
import { ErrorPageComponent } from '../error/error-page/error-page.component';

export class ErrorRoute implements IRoute {

  /** Route name */
  readonly name = 'error-route';

  /** Priority */
  readonly priority = -255;

  /**
   * Get Configuration
   * @return array
   */
  getConfiguration() {
    return [
      {
        path: 'errors/:status_code',
        component: ErrorPageComponent
      },
      {
        path: '**',
        component: ErrorPageComponent
      }
    ];
  }
}
