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
import { I18nPluralPipe, NgClass } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslateDirective, TranslatePipe, TranslateService } from "@ngx-translate/core";
import { CoreModule } from '@rero/ng-core';
import { HoldingsNoteType, SharedModule, UserService } from '@rero/shared';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ButtonDirective } from 'primeng/button';
import { Message } from 'primeng/message';
import { Ripple } from 'primeng/ripple';
import { HoldingsApiService } from '../../api/holdings-api.service';
import { HoldingsRequestComponent } from '../request/holdings-request.component';
import { HoldingsStore } from '../store/holdings-store';
import { ItemsComponent } from './items/items.component';
import { MultiSelect } from 'primeng/multiselect';

@Component({
    selector: 'public-search-holdings',
    templateUrl: './holdings.component.html',
    imports: [Message, Accordion, AccordionPanel, Ripple, AccordionHeader, SharedModule, TranslateDirective, AccordionContent, ItemsComponent, HoldingsRequestComponent, NgClass, ButtonDirective, I18nPluralPipe, TranslatePipe, CoreModule, MultiSelect],
    providers: [HoldingsStore]
})
export class HoldingsComponent implements OnInit {

  protected holdingsApiService = inject(HoldingsApiService);
  protected translateService = inject(TranslateService);
  protected userService = inject(UserService);

  protected store = inject(HoldingsStore);

  // COMPONENTS ATTRIBUTES ====================================================
  /** View code */
  @Input() viewcode: string;
  @Input() documentPid: string;

  noteAuthorizedTypes: string[] = [HoldingsNoteType.GENERAL, HoldingsNoteType.ACCESS];

  /** OnInit hook */
  ngOnInit(): void {
    this.store.setDocumentPidAndViewCode(this.documentPid, this.viewcode);
    this.store.load();
  }
}
