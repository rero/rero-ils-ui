// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TranslateDirective, TranslateService } from '@ngx-translate/core';
import { AppStore, DocumentDescriptionComponent, FilesComponent } from '@rero/shared';
import { MenuItem } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { HoldingsComponent } from '../holdings/holdings.component';
import { ElectronicHoldingsComponent } from './holdings/electronic-holdings/electronic-holdings.component';
import { DocumentApiService } from '../../api/document-api.service';

@Component({
    selector: 'public-search-document-detail-vew',
    templateUrl: './document-detail-view.component.html',
    imports: [LoadingBarModule, Tabs, TabList, Ripple, Tab, TranslateDirective, TabPanels, TabPanel, FilesComponent, DocumentDescriptionComponent, HoldingsComponent, ElectronicHoldingsComponent, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush
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
        icon: "fa-regular fa-file-code",
        label: this.translateService.instant("JSON Data"),
        url: `/api/documents/${this.documentpid()}?format=json`
      },
      {
        icon: "fa-regular fa-file-lines",
        label: this.translateService.instant("RIS (Zotero...)"),
        url: `/api/documents/${this.documentpid()}?format=ris`
      }
    ];
  }
}
