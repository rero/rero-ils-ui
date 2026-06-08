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
