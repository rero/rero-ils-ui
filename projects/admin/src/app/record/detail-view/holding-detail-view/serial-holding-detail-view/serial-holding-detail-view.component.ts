// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, model, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DocumentApiService } from '@app/admin/api/document-api.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { InputGroup } from '@openng/optimus-ui/inputgroup';
import { InputGroupAddon } from '@openng/optimus-ui/inputgroupaddon';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@openng/optimus-ui/tabs';
import { EsRecord, PaginatorComponent } from '@rero/shared';

import { DocumentsBriefViewComponent } from '../../../brief-view/documents-brief-view/documents-brief-view.component';
import { HoldingDetailComponent } from '../../document-detail-view/holdings/holding-detail/holding-detail.component';
import { HoldingSharedViewComponent } from '../../document-detail-view/holdings/holding-shared-view/holding-shared-view.component';
import { LocalFieldComponent } from '../../local-field/local-field.component';
import { RecordMaskedComponent } from '../../record-masked/record-masked.component';
import { HoldingsSerialStore } from '../holdings-serial-store';
import { ExpectedIssueComponent } from './expected-issue/expected-issue.component';
import { ReceivedIssueComponent } from './received-issue/received-issue.component';

@Component({
  selector: 'admin-serial-holding-detail-view',
  templateUrl: './serial-holding-detail-view.component.html',
  providers: [HoldingsSerialStore],
  imports: [
    RecordMaskedComponent,
    DocumentsBriefViewComponent,
    HoldingSharedViewComponent,
    Bind,
    Tabs,
    TabList,
    Ripple,
    Tab,
    TabPanels,
    TabPanel,
    Button,
    ExpectedIssueComponent,
    RouterLink,
    InputGroup,
    FormsModule,
    InputText,
    InputGroupAddon,
    ReceivedIssueComponent,
    PaginatorComponent,
    HoldingDetailComponent,
    LocalFieldComponent,
    TranslatePipe,
  ],
})
export class SerialHoldingDetailViewComponent implements OnInit {
  protected store = inject(HoldingsSerialStore);
  private documentApiService = inject(DocumentApiService);

  holding = input.required<EsRecord>();

  protected filter = model<string>('');

  /** Host document of the holding.*/
  protected readonly documentResource = rxResource({
    params: () => this.holding().metadata.document.pid,
    stream: ({ params: pid }) => this.documentApiService.getDocument(pid),
  });

  /** OnInit hook */
  ngOnInit(): void {
    this.store.setHoldings(this.holding);
    this.store.setFilter(this.filter);
  }
}
