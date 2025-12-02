/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
import { Component, effect, inject, input, model } from '@angular/core';
import { EsRecord } from '@rero/shared';
import { ItemsStore } from '../store/items-store';

@Component({
  selector: 'admin-holding-content',
  providers: [ItemsStore],
  standalone: false,
  templateUrl: './holding-content.component.html'
})
export class HoldingContentComponent {

  protected store = inject(ItemsStore);

  holding = input.required<EsRecord>();
  isCurrentOrganisation = input.required<boolean>();

  protected filter = model<string>('');

  constructor() {
    this.store.setFilter(this.filter);
    effect(() => this.store.setHoldings(this.holding()));
  }
}
