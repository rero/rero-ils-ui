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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ItemApiService } from '@app/admin/api/item-api.service';
import { extractIdOnRef } from '@rero/ng-core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'admin-item-switch-location-standalone',
  templateUrl: './item-switch-location-standalone.component.html'
})
export class ItemSwitchLocationStandaloneComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** the managed item */
  item: any | undefined = undefined;


  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _activeRoute - ActivatedRoute
   * @param _itemService - ItemApiService
   * @param _router - Router
   */
  constructor(
    private _activeRoute: ActivatedRoute,
    private _itemService: ItemApiService,
    private _router: Router
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    this._activeRoute.paramMap
      .pipe(switchMap((params: ParamMap) => this._itemService.getItem(params.get('pid'))))
      .subscribe((record: any) => this.item = record)
  }


  // COMPONENT FUNCTIONS ======================================================
  /** Fired when the item is updated */
  updatedItem(item: any): void {
    this.item = item;
    this._redirect();
  }

  // COMPONENT PRIVATE FUNCTIONS ==============================================
  /** redirect the application to the document detailed page related to the item */
  private _redirect(): void {
    this._router.navigate(['/', 'records', 'documents', 'detail', extractIdOnRef(this.item.document.$ref)]);
  }

}
