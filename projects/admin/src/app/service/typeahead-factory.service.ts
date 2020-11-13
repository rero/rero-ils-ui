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
import { Injectable, InjectionToken, Injector } from '@angular/core';
import { ITypeahead } from '../class/typeahead/ITypeahead-interface';
import { UiRemoteTypeaheadService } from './ui-remote-typeahead.service';

// Pattern to find all typeahead into the dependency injection
export const typeaheadToken = new InjectionToken<ITypeahead[]>
  ('ITypeahead');

@Injectable({
  providedIn: 'root'
})
export class TypeaheadFactoryService {

  /**
   * Constructor
   * @param _injector - Injector
   * @param _uiRemoteTypeaheadService - UiRemoteTypeaheadService
   */
  constructor(
    private _injector: Injector,
    private _uiRemoteTypeaheadService: UiRemoteTypeaheadService
    ) { }

    /** Init */
  init() {
    const typeaheads = this._injector.get(typeaheadToken);
    typeaheads.map((typeahead: ITypeahead) => {
      this._uiRemoteTypeaheadService.addTypeahead(typeahead);
    });
  }
}
