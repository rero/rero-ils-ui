// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, effect, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { InputGroup } from '@openng/optimus-ui/inputgroup';
import { InputGroupAddon } from '@openng/optimus-ui/inputgroupaddon';
import { InputText } from '@openng/optimus-ui/inputtext';
import { EsRecord, PaginatorComponent, SafeUrlPipe } from '@rero/shared';

import { DefaultHoldingItemComponent } from '../default-holding-item/default-holding-item.component';
import { SerialHoldingItemComponent } from '../serial-holding-item/serial-holding-item.component';
import { ItemsStore } from '../store/items-store';

@Component({
  selector: 'admin-holding-content',
  providers: [ItemsStore],
  templateUrl: './holding-content.component.html',
  imports: [
    Bind,
    InputGroup,
    FormsModule,
    InputText,
    InputGroupAddon,
    SerialHoldingItemComponent,
    DefaultHoldingItemComponent,
    PaginatorComponent,
    TranslatePipe,
    SafeUrlPipe,
  ],
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
