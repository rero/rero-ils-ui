/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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

import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, OnInit, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemApiService } from '@app/admin/api/item-api.service';
import { LocationService } from '@app/admin/service/location.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Error, extractIdOnRef, HttpPendingService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'admin-item-switch-location',
  templateUrl: './item-switch-location.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, Bind, Card, Select, Button, TranslatePipe],
})
export class ItemSwitchLocationComponent implements OnInit {

  private formBuilder: UntypedFormBuilder = inject(UntypedFormBuilder);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private itemApiService: ItemApiService = inject(ItemApiService);
  private locationService: LocationService = inject(LocationService);
  private translateService: TranslateService = inject(TranslateService);
  private appStore = inject(AppStore);
  private messageService: MessageService = inject(MessageService);
  readonly httpPending = inject(HttpPendingService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Optional item — if not provided, loaded from route params (standalone mode) */
  item = input<ItemMetadata | undefined>(undefined);
  /** Emits the updated item to the parent (embedded mode only) */
  itemChange = output<ItemMetadata>();
  /** Limit above which filter is activated on the target dropdown */
  filterLimit = input(10);

  /** Writable copy of item, tracks the input signal and allows internal mutation */
  // TODO: replace cloneDeep with structuredClone when lodash-es is removed
  editableItem = linkedSignal<ItemMetadata | undefined>(() => {
    const item = this.item();
    return item ? cloneDeep(item) : item;
  });
  /** Options of the dropdown menu */
  options = signal<SelectItemGroup[]>([]);
  /** Name of the initial location */
  initialLocationName = signal('');

  /** Transfer form */
  form: UntypedFormGroup = this.formBuilder.group({
    target: [undefined, Validators.required],
  });

  /** Whether to activate the filter feature on the target dropdown */
  isFilterActive = computed(() =>
    this.options().reduce((acc, library) => acc + library.items.length, 0) > this.filterLimit()
  );

  // COMPONENT LIFECYCLE ======================================================

  ngOnInit(): void {
    if (this.item() === undefined) {
      // Standalone mode: load item from route, then init locations
      this.activeRoute.paramMap
        .pipe(switchMap(params => this.itemApiService.getItem(params.get('pid')!)))
        .subscribe(record => {
          this.editableItem.set(cloneDeep(record));
          this._initLocations();
        });
    } else {
      // Embedded mode: item already available
      this._initLocations();
    }
  }

  // COMPONENT FUNCTIONS ======================================================

  /** Handle form submission */
  submit(): void {
    if (this.httpPending.isPending()) { return; }
    this.itemApiService
      .updateLocation(this.editableItem(), this.form.value.target)
      .subscribe({
        next: (result: any) => {
          this.editableItem.set(cloneDeep(result.metadata));
          this._afterUpdate(result.metadata);
        },
        error: (err: Error) => this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Locations'),
          detail: err.title,
          sticky: true,
          closable: true
        })
      });
  }

  /** Handle cancel: emit or redirect without changes */
  cancel(): void {
    this._afterUpdate(this.editableItem()!);
  }

  // COMPONENT PRIVATE FUNCTIONS ==============================================

  /**
   * After a successful update or cancel:
   * - embedded mode → emit itemChange to parent
   * - standalone mode → navigate to the related document
   */
  private _afterUpdate(item: ItemMetadata): void {
    if (this.item() !== undefined) {
      this.itemChange.emit(item);
    } else {
      this.router.navigate(['/', 'records', 'documents', 'detail', extractIdOnRef(item.document.$ref)]);
    }
  }

  /** Load pickup locations and build dropdown options */
  private _initLocations(): void {
    const user = this.appStore.user();
    if (!user) { return; }
    const libraryPids = user.patronLibrarian?.libraries?.map(lib => lib.pid) ?? [];
    this.locationService
      .getLocationsByLibraries$(libraryPids)
      .pipe(map(locations => locations.map(loc => loc.metadata)))
      .subscribe(locations => {
        this.options.set(this._buildOptions(locations));
        this.initialLocationName.set(
          locations
            .filter(loc => loc.pid === extractIdOnRef(this.editableItem()!.location.$ref))
            .pop()?.name ?? ''
        );
      });
  }

  /**
   * Build the grouped dropdown options from location data.
   * @param locationHits: flat list of location metadata from API
   */
  private _buildOptions(locationHits: any[]): SelectItemGroup[] {
    const options: SelectItemGroup[] = [];

    const appendLibrary = (group: SelectItemGroup): void => {
      if (group.value !== undefined) {
        options.push(group);
      }
    };

    let currentParent: SelectItemGroup = { label: '', value: undefined, items: [] };
    locationHits
      .sort(this._locationSort)
      .forEach(location => {
        if (currentParent.value !== location.library.pid) {
          appendLibrary(currentParent);
          currentParent = {
            label: `[${location.library.code}] ${location.library.name}`,
            value: location.library.pid,
            items: []
          };
        }
        currentParent.items.push({
          label: location.name,
          value: location.pid,
          disabled: location.pid === extractIdOnRef(this.editableItem()!.location.$ref)
        });
      });
    appendLibrary(currentParent);
    return options;
  }

  /**
   * Comparator to sort locations by library code then location name.
   */
  private _locationSort(a: any, b: any): number {
    return (a.library.code === b.library.code)
      ? a.name.localeCompare(b.name)
      : a.library.code.localeCompare(b.library.code);
  }
}

type ItemMetadata = {
  barcode: string;
  location: { $ref: string };
  document: { $ref: string };
  [key: string]: unknown;
};
