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

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { AppSettingsService } from '@rero/shared';
import { MefTypeahead } from './mef-typeahead';

@Injectable({
  providedIn: 'root'
})
export class MefPersonTypeahead extends MefTypeahead {
  constructor(
    protected _recordService: RecordService,
    protected _translateService: TranslateService,
    protected _appSettingsService: AppSettingsService
  ) {
    super(
      _recordService,
      _translateService,
      _appSettingsService
    );
    this.name = 'mef-persons';
    this.type = 'Person';
  }
}
