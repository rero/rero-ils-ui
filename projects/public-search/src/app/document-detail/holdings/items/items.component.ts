/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { Component, inject, Input, model, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { deepComputed } from '@ngrx/signals';
import { TranslateDirective, TranslatePipe } from "@ngx-translate/core";
import { EsRecord, PaginatorComponent, PaginatorConfig } from '@rero/shared';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ItemComponent } from '../../item/item.component';
import { ItemsStore } from '../../store/items-store';

@Component({
    selector: 'public-search-items',
    templateUrl: './items.component.html',
    imports: [
      ItemComponent,
      TranslatePipe,
      TranslateDirective,
      InputTextModule,
      InputGroupModule,
      InputGroupAddonModule,
      FormsModule,
      PaginatorComponent
    ],
    providers: [ItemsStore]
})
export class ItemsComponent implements OnInit {

  protected store = inject(ItemsStore);

  protected filter = model<string>('');

  protected paginatorConfig: Signal<PaginatorConfig> = deepComputed(() => ({
    first: this.store.paginator.first(),
    rows: this.store.paginator.rows(),
    total: this.store.total()
  }));

  // COMPONENT ATTRIBUTES =====================================================
  /** Holding */
  @Input() holding: EsRecord;
  /** View code */
  @Input() viewcode: string;

  constructor() {
    this.store.setFilter(this.filter);
  }

  ngOnInit(): void {
    this.store.setHoldingsAndViewCode(this.holding, this.viewcode);
    this.store.load();
  }
}
