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

import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ItemApiService } from '@app/admin/api/item-api.service';
import { LocationService } from '@app/admin/service/location.service';
import { TranslateService } from '@ngx-translate/core';
import { Error, extractIdOnRef } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { MessageService, SelectItem, SelectItemGroup } from 'primeng/api';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'admin-item-switch-location',
  templateUrl: './item-switch-location.component.html',
  styleUrls: ['./item-switch-location.component.scss']
})
export class ItemSwitchLocationComponent implements OnInit {

  private messageService = inject(MessageService);

  // COMPONENT ATTRIBUTES =====================================================
  /** the item to manage */
  @Input() item: any = undefined;
  /** Emit the item when it changes (could use two way binding on item in parent component --> [(item)]='') */
  @Output() itemChange = new EventEmitter<any>();
  /** the limit above which the filter feature will be activate on target dropdown */
  @Input() filterLimit: number = 10;

  /** the transfer form group */
  form: UntypedFormGroup;
  /** options of the dropdown menu */
  options: SelectItemGroup[] = [];
  initialLocation: SelectItem[] = [];

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _formBuilder - UntypedFormBuilder
   * @param _itemApiService - ItemApiService
   * @param _locationService - LocationService
   * @param _translateService - TranslateService
   * @param _userService - UserService
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _itemApiService: ItemApiService,
    private _locationService: LocationService,
    private _translateService: TranslateService,
    private _userService: UserService,
  ) {
    this.form = this._formBuilder.group({
      target: [undefined, Validators.required],
    });
  }


  /** OnInit hook */
  ngOnInit(): void {
    const libraryPids = this._userService.user.patronLibrarian.libraries.map(lib => lib.pid);
    this._locationService
      .getLocationsByLibraries$(libraryPids)
      .pipe(
        map(locations => locations.map(loc => loc.metadata))
      )
      .subscribe(locations => {
        this._buildOptions(locations);
        const filteredLocations = locations.filter(loc => loc.pid === extractIdOnRef(this.item.location.$ref));
        if (filteredLocations) {
          const currentLocation = filteredLocations.pop();
          this.initialLocation = [{
            label: currentLocation.name,
            value: currentLocation.pid
          }];
        }
      });
  }

  // COMPONENT FUNCTIONS ======================================================

  /**
   * Determine if the filter feature of the target dropdown must be activated or not,
   * depending on the number of selectable item of the dropdown options.
   * @returns: True if the filter could be activated ; false if not.
   */
  isFilterActive(): boolean {
      return this.options.reduce((acc, library) => acc + library.items.length, 0) > this.filterLimit;
  }

  /** Handle form submission
   *    Send a REST API to update the item owning location. When API response is
   *    processed, emit the item with updated information.
   */
  submit(): void {
    this._itemApiService
      .updateLocation(this.item, this.form.value.target)
      .pipe(
        finalize(() => this.itemChange.emit(this.item))
      )
      .subscribe({
        next: (item: any) => this.item = item.metadata,
        error: (err: Error) => {
          this.messageService.add({
            severity: 'error',
            summary: this._translateService.instant('Locations'),
            detail: err.title,
            sticky: true,
            closable: true
          });
        }
      });
  }

  /** Handle form cancel click
   *    If user choose to cancel any changed, just emit the unchanged item.
   */
  cancel(): void {
    this.itemChange.emit(this.item);
  }


  // COMPONENT PRIVATE FUNCTIONS ==============================================
  /**
   * Build the dropdown options tree based on location data.
   * @param locationHits: the location hits from API response.
   */
  private _buildOptions(locationHits: Array<any>): void {

    function appendLibrary(item: SelectItemGroup, options: SelectItemGroup[]): void {
      if (item.value !== undefined){
        options.push(currentParent);
      }
    }

    let currentParent: SelectItemGroup = {label:undefined, value:undefined, items:[]};
    locationHits
      .sort(this._locationSort)
      .forEach(location => {
        if (currentParent.value !== location.library.pid) {
          appendLibrary(currentParent, this.options);
          currentParent = {
            label: `[${location.library.code}] ${location.library.name}`,
            value: location.library.pid,
            items: []
          }
        }
        currentParent.items.push({
          label: location.name,
          value: location.pid,
          disabled: location.pid === extractIdOnRef(this.item.location.$ref)
        });
      });
    appendLibrary(currentParent, this.options);
  }

  /**
   * Allow to sort an array of locations
   * @param a: the first location to compare
   * @param b: the second location to compare
   */
  private _locationSort(a: any, b: any): number {
    return (a.library.code === b.library.code)
        ? a.name.localeCompare(b.name)
        : a.library.code.localeCompare(b.library.code);
  }

}
