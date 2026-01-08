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
import { Component, computed, inject, input, Input, Signal } from '@angular/core';
import { IMenu } from '../types';
import { PatronProfileMenuStore } from '../store/patron-profile-menu-store';

@Component({
  selector: 'public-search-patron-profile-menu',
  templateUrl: './patron-profile-menu.component.html',
  standalone: false
})
export class PatronProfileMenuComponent {

  patronProfileMenuStore = inject(PatronProfileMenuStore);

  patronPid = input<string>();

  selectedOrganisation = computed<IMenu | null>(() => {
    const menu = this.patronProfileMenuStore.menu();
    return menu.find((menu: IMenu) => menu.value === this.patronPid()) || null;
  });

}
