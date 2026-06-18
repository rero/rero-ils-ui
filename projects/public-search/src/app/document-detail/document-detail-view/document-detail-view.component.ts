// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TranslateDirective, TranslateService } from '@ngx-translate/core';
import { AppStore, DocumentDescriptionComponent, FilesComponent } from '@rero/shared';
import { GetRecordPipe } from '@rero/ng-core';
import { MenuItem } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { HoldingsComponent } from '../holdings/holdings.component';
import { ElectronicHoldingsComponent } from './holdings/electronic-holdings/electronic-holdings.component';

@Component({
    selector: 'public-search-document-detail-vew',
    templateUrl: './document-detail-view.component.html',
    imports: [LoadingBarModule, Tabs, TabList, Ripple, Tab, TranslateDirective, TabPanels, TabPanel, GetRecordPipe, FilesComponent, DocumentDescriptionComponent, HoldingsComponent, ElectronicHoldingsComponent, NgClass, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentDetailViewComponent implements OnInit {
  private appStore = inject(AppStore);
  private translateService: TranslateService = inject(TranslateService);

  viewcode = input<string>();
  documentpid = input<string>();
  showinfo = input('false');

  document = null;
  exportItems: MenuItem[];

  /** OnInit hook */
  ngOnInit(): void {
    // Set view code to app settings
    this.appStore.setCurrentViewCode(this.viewcode());
    this.exportItems = [
      {
        icon: "fa fa-file-code-o",
        label: this.translateService.instant("JSON Data"),
        url: `/api/documents/${this.documentpid()}?format=json`
      },
      {
        icon: "fa fa-file-text-o",
        label: this.translateService.instant("RIS (Zotero...)"),
        url: `/api/documents/${this.documentpid()}?format=ris`
      }
    ];
  }
}
