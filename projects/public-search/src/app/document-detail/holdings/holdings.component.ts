// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { I18nPluralPipe, NgClass } from '@angular/common';
import { computed, Component, inject, input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective, TranslatePipe, TranslateService } from "@ngx-translate/core";
import { AvailabilityComponent, DescriptionZoneComponent, GetTranslatedLabelPipe, HoldingsNoteType, NotesFilterPipe, AppStore } from '@rero/shared';
import { Nl2brPipe } from '@rero/ng-core';
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
    imports: [Message, Accordion, AccordionPanel, Ripple, AccordionHeader, AvailabilityComponent, DescriptionZoneComponent, GetTranslatedLabelPipe, Nl2brPipe, NotesFilterPipe, TranslateDirective, AccordionContent, ItemsComponent, HoldingsRequestComponent, NgClass, ButtonDirective, I18nPluralPipe, TranslatePipe, MultiSelect],
    providers: [HoldingsStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingsComponent implements OnInit {

  protected holdingsApiService = inject(HoldingsApiService);
  private translateService = inject(TranslateService);
  private appStore = inject(AppStore);

  protected store = inject(HoldingsStore);

  protected readonly isAuthenticated = computed(() => this.appStore.user()?.isAuthenticated ?? false);
  protected readonly isPatron = computed(() => this.appStore.user()?.hasRoles(['patron']) ?? false);
  protected get currentLang() { return this.translateService.currentLang; }

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
