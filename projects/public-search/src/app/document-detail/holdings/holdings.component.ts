// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { I18nPluralPipe, NgClass } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from '@openng/optimus-ui/accordion';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { Message } from '@openng/optimus-ui/message';
import { MultiSelect } from '@openng/optimus-ui/multiselect';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Nl2brPipe } from '@rero/ng-core';
import {
  AppStore,
  AvailabilityComponent,
  DescriptionZoneComponent,
  GetTranslatedLabelPipe,
  HoldingsNoteType,
  NotesFilterPipe,
} from '@rero/shared';

import { HoldingsApiService } from '../../api/holdings-api.service';
import { HoldingsRequestComponent } from '../request/holdings-request.component';
import { HoldingsStore } from '../store/holdings-store';
import { ItemsComponent } from './items/items.component';

@Component({
  selector: 'public-search-holdings',
  templateUrl: './holdings.component.html',
  imports: [
    Message,
    Accordion,
    AccordionPanel,
    Ripple,
    AccordionHeader,
    AvailabilityComponent,
    DescriptionZoneComponent,
    GetTranslatedLabelPipe,
    Nl2brPipe,
    NotesFilterPipe,
    AccordionContent,
    ItemsComponent,
    HoldingsRequestComponent,
    NgClass,
    ButtonDirective,
    I18nPluralPipe,
    TranslatePipe,
    MultiSelect,
  ],
  providers: [HoldingsStore],
})
export class HoldingsComponent implements OnInit {
  protected holdingsApiService = inject(HoldingsApiService);
  private translateService = inject(TranslateService);
  private appStore = inject(AppStore);

  protected store = inject(HoldingsStore);

  protected readonly isAuthenticated = computed(() => this.appStore.user()?.isAuthenticated ?? false);
  protected readonly isPatron = computed(() => this.appStore.user()?.hasRoles(['patron']) ?? false);
  protected get currentLang() {
    return this.translateService.getCurrentLang();
  }

  // COMPONENTS ATTRIBUTES ====================================================
  /** View code */
  viewcode = input<string>();
  documentPid = input<string>();

  noteAuthorizedTypes: string[] = [HoldingsNoteType.GENERAL, HoldingsNoteType.ACCESS];

  /** OnInit hook */
  ngOnInit(): void {
    this.store.setDocumentPidAndViewCode(this.documentPid(), this.viewcode());
    this.store.load();
  }
}
