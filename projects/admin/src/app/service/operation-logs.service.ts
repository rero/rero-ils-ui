/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { inject, Injectable } from '@angular/core';
import { AppSettingsService } from '@rero/shared';

@Injectable({
  providedIn: 'root'
})
export class OperationLogsService {

  private appSettingsService: AppSettingsService = inject(AppSettingsService);

  /**
   * Is operation logs is visible
   * @param resourceName - string, name of resource
   * @return boolean
   */
  isLogVisible(resourceName: string): boolean {
    return resourceName in this._setting();
  }

  /**
   * Get resource key by resource name
   * @param resourceName - string, name of resource
   */
  getResourceKeyByResourceName(resourceName: string): string {
    const setting = this._setting();
    if (!(resourceName in setting)) {
      throw new Error('Operation logs: Missing resource key');
    }
    return setting[resourceName];
  }

  /**
   * Get Application operation logs settings
   * @return Object
   */
  private _setting(): any {
    return this.appSettingsService.settings.operationLogs;
  }
}
