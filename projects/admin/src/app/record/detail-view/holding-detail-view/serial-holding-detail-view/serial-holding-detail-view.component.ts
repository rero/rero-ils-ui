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
import { Component, inject, input, model, OnInit } from '@angular/core';
import { EsRecord } from '@rero/shared';
import { HoldingsSerialStore } from '../holdings-serial-store';

@Component({
    selector: 'admin-serial-holding-detail-view',
    templateUrl: './serial-holding-detail-view.component.html',
    providers: [HoldingsSerialStore],
    standalone: false
})
export class SerialHoldingDetailViewComponent implements OnInit {

  protected store = inject(HoldingsSerialStore);

  holding = input.required<EsRecord>();

  protected filter = model<string>('');

  /** OnInit hook */
  ngOnInit(): void {
    this.store.setHoldings(this.holding);
    this.store.setFilter(this.filter);
  }
}

