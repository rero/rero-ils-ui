// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, model, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateDirective, TranslatePipe } from "@ngx-translate/core";
import { EsRecord, PaginatorComponent } from '@rero/shared';
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
    providers: [ItemsStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent implements OnInit {

  protected store = inject(ItemsStore);

  protected filter = model<string>('');

  // COMPONENT ATTRIBUTES =====================================================
  /** Holding */
  holding = input<EsRecord>();
  /** View code */
  viewcode = input<string>();

  constructor() {
    this.store.setFilter(this.filter);
  }

  ngOnInit(): void {
    this.store.setHoldingsAndViewCode(this.holding(), this.viewcode());
    this.store.load();
  }
}
