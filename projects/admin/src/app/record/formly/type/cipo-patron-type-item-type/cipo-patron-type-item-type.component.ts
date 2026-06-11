/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CirculationPolicyApiService } from '@app/admin/api/circulation-policy-api.service';
import { ItemTypeApiService } from '@app/admin/api/item-type-api.service';
import { PatronTypeApiService } from '@app/admin/api/patron-type-api.service';
import { FieldArrayType } from '@ngx-formly/core';
import { ApiService } from '@rero/ng-core';
import { forkJoin } from 'rxjs';
import { HitRecord, Settings, SettingsRow } from './class/settings';
import { TableModule } from 'primeng/table';

export type Setting = {
  item_type: { $ref: string };
  patron_type: { $ref: string };
};

type LibraryRef = {
  $ref?: string;
  [key: string]: unknown;
};

@Component({
  selector: 'admin-cipo-patron-type-item-type',
  templateUrl: './cipo-patron-type-item-type.component.html',
  imports: [TableModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CipoPatronTypeItemTypeComponent extends FieldArrayType implements OnInit {

  private patronTypeApiService = inject(PatronTypeApiService);
  private itemTypeApiService = inject(ItemTypeApiService);
  private circulationPolicyApiService = inject(CirculationPolicyApiService);
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  // COMPONENT ATTRIBUTES =====================================================
  /** Patron types */
  patronTypes = signal<HitRecord[]>([]);
  /** Settings */
  settings = signal<SettingsRow[]>([]);

  /** Item types / Circulation category */
  private itemTypes: HitRecord[] = [];
  /** Already known circulation policies */
  private circPolicies: HitRecord[] = [];
  /** Previous appliedTo libraries */
  private prevSelectedLibraries: string[] = [];

  /** OnInit hook */
  ngOnInit(): void {
    const appliedLibraries: LibraryRef[] = this.field.parent!.model.libraries || [];
    this.prevSelectedLibraries = this._getLibrariesRef(appliedLibraries);

    forkJoin([
      this.patronTypeApiService.getAll(),
      this.itemTypeApiService.getAll(),
      this.circulationPolicyApiService.getAll(this.field.parent!.model.pid)
    ])
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(([patronTypes, itemTypes, circPolicies]) => {
      this.patronTypes.set(patronTypes as HitRecord[]);
      this.itemTypes = itemTypes as HitRecord[];
      this.circPolicies = circPolicies as HitRecord[];
      this._loadSettings();
    });

    // Detect form changes: if user selects "library level" cipo, rebuild the
    // settings table according to the selected libraries.
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changes: { libraries?: LibraryRef[] }) => {
        const formLibraries = Object.hasOwn(changes, 'libraries')
          ? this._getLibrariesRef(changes.libraries!)
          : [];
        if (JSON.stringify(formLibraries) !== JSON.stringify(this.prevSelectedLibraries)) {
          this.prevSelectedLibraries = formLibraries;
          this._loadSettings();
        }
      });
  }

  // PUBLIC FUNCTIONS =========================================================
  /**
   * Manage click on a setting checkbox
   * @param checked - is the checkbox checked
   * @param itemTypePid - the corresponding item type pid
   * @param patronTypePid - the corresponding patron type pid
   */
  onClick(checked: boolean, itemTypePid: string, patronTypePid: string): void {
    const settingsControl = this.form.get('settings');
    if (!settingsControl) {
      return;
    }
    const value = this._setting(itemTypePid, patronTypePid);
    if (checked) {
      this.add(settingsControl.value.length, value);
    } else {
      const index = (settingsControl.value as Setting[]).findIndex(
        e => JSON.stringify(e) === JSON.stringify(value)
      );
      this.remove(index);
    }
  }

  // PRIVATE FUNCTIONS =========================================================
  /**
   * Create a setting object
   * @param itemTypePid - the item type pid
   * @param patronTypePid - the patron type pid
   * @return the corresponding `Setting` structure
   */
  private _setting(itemTypePid: string, patronTypePid: string): Setting {
    return {
      item_type: { $ref: this.apiService.getRefEndpoint('item_types', itemTypePid) },
      patron_type: { $ref: this.apiService.getRefEndpoint('patron_types', patronTypePid) }
    };
  }

  /** Build and update the settings signal */
  private _loadSettings(): void {
    const structure = new Settings(this.apiService)
      .setCirculationPolicy(this.form.value)
      .createStructure(this.itemTypes, this.patronTypes(), this.circPolicies, this.prevSelectedLibraries)
      .getStructure();
    this.settings.set(structure);
  }

  /** Extract $ref strings from an array of library objects */
  private _getLibrariesRef(libraries: LibraryRef[]): string[] {
    return Array.from(new Set(
      libraries.map(library => library.$ref).filter((ref): ref is string => Boolean(ref))
    ));
  }
}
