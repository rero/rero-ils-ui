// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { NgClass } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MenuItem } from '@openng/optimus-ui/api';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@openng/optimus-ui/tabs';
import { AppStore, DocumentDescriptionComponent, FilesComponent } from '@rero/shared';

import { DocumentApiService } from '../../api/document-api.service';
import { HoldingsComponent } from '../holdings/holdings.component';
import { ElectronicHoldingsComponent } from './holdings/electronic-holdings/electronic-holdings.component';

@Component({
  selector: 'public-search-document-detail-vew',
  templateUrl: './document-detail-view.component.html',
  imports: [
    TranslatePipe,
    LoadingBarModule,
    Tabs,
    TabList,
    Ripple,
    Tab,
    TabPanels,
    TabPanel,
    FilesComponent,
    DocumentDescriptionComponent,
    HoldingsComponent,
    ElectronicHoldingsComponent,
    NgClass,
  ],
})
export class DocumentDetailViewComponent implements OnInit {
  private appStore = inject(AppStore);
  private documentApiService = inject(DocumentApiService);
  private translateService: TranslateService = inject(TranslateService);

  viewcode = input.required<string>();
  documentpid = input.required<string>();
  showinfo = input('false');

  exportItems: MenuItem[] = [];

  /** Document to display. */
  protected readonly documentResource = rxResource({
    params: () => this.documentpid(),
    stream: ({ params: pid }) => this.documentApiService.getDocument(pid),
  });

  /** OnInit hook */
  ngOnInit(): void {
    // Set view code to app settings
    this.appStore.setCurrentViewCode(this.viewcode());
    this.exportItems = [
      {
        icon: 'fa-regular fa-file-code',
        label: this.translateService.instant('JSON Data'),
        url: `/api/documents/${this.documentpid()}?format=json`,
      },
      {
        icon: 'fa-regular fa-file-lines',
        label: this.translateService.instant('RIS (Zotero...)'),
        url: `/api/documents/${this.documentpid()}?format=ris`,
      },
    ];
  }
}
