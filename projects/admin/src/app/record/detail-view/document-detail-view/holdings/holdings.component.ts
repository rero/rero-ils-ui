// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, effect, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from '@openng/optimus-ui/accordion';
import { Bind } from '@openng/optimus-ui/bind';
import { MultiSelect } from '@openng/optimus-ui/multiselect';
import { Ripple } from '@openng/optimus-ui/ripple';
import { EsRecord } from '@rero/shared';

import { HoldingContentComponent } from './holding-content/holding-content.component';
import { HoldingHeaderComponent } from './holding-header/holding-header.component';
import { MenuActionsComponent } from './menu-actions/menu-actions.component';
import { HoldingsStore } from './store/holdings-store';

@Component({
  selector: 'admin-holdings',
  templateUrl: './holdings.component.html',
  styles: `
    .p-accordionheader {
      user-select: text !important;
    }
  `,
  providers: [HoldingsStore],
  imports: [
    MenuActionsComponent,
    Bind,
    FormsModule,
    MultiSelect,
    Accordion,
    AccordionPanel,
    Ripple,
    AccordionHeader,
    HoldingHeaderComponent,
    AccordionContent,
    HoldingContentComponent,
    TranslatePipe,
  ],
})
export class HoldingsComponent {
  protected store = inject(HoldingsStore);

  protected document = input.required<EsRecord>();

  constructor() {
    effect(() => this.store.setDocument(this.document()));
  }
}
