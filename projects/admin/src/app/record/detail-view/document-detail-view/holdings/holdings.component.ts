// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { EsRecord } from '@rero/shared';
import { HoldingsStore } from './store/holdings-store';
import { MenuActionsComponent } from './menu-actions/menu-actions.component';
import { Bind } from 'primeng/bind';
import { MultiSelect } from 'primeng/multiselect';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { HoldingHeaderComponent } from './holding-header/holding-header.component';
import { HoldingContentComponent } from './holding-content/holding-content.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-holdings',
    templateUrl: './holdings.component.html',
    styles: `.p-accordionheader { user-select: text !important; }`,
    providers: [HoldingsStore],
    imports: [MenuActionsComponent, Bind, MultiSelect, Accordion, AccordionPanel, Ripple, AccordionHeader, HoldingHeaderComponent, AccordionContent, HoldingContentComponent, TranslateDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingsComponent implements OnInit {

  protected store = inject(HoldingsStore);

  protected document = input.required<EsRecord>();

  ngOnInit(): void {
    this.store.setDocument(this.document());
  }
}
