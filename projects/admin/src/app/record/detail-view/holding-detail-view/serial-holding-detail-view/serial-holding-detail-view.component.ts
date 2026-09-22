// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, model, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EsRecord, PaginatorComponent } from '@rero/shared';
import { HoldingsSerialStore } from '../holdings-serial-store';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RecordMaskedComponent } from '../../record-masked/record-masked.component';
import { DocumentsBriefViewComponent } from '../../../brief-view/documents-brief-view/documents-brief-view.component';
import { HoldingSharedViewComponent } from '../../document-detail-view/holdings/holding-shared-view/holding-shared-view.component';
import { Bind } from 'primeng/bind';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Ripple } from 'primeng/ripple';
import { Button } from 'primeng/button';
import { ExpectedIssueComponent } from './expected-issue/expected-issue.component';
import { RouterLink } from '@angular/router';
import { InputGroup } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { ReceivedIssueComponent } from './received-issue/received-issue.component';
import { HoldingDetailComponent } from '../../document-detail-view/holdings/holding-detail/holding-detail.component';
import { LocalFieldComponent } from '../../local-field/local-field.component';
import { DocumentApiService } from '@app/admin/api/document-api.service';

@Component({
    selector: 'admin-serial-holding-detail-view',
    templateUrl: './serial-holding-detail-view.component.html',
    providers: [HoldingsSerialStore],
    imports: [TranslateDirective, RecordMaskedComponent, DocumentsBriefViewComponent, HoldingSharedViewComponent, Bind, Tabs, TabList, Ripple, Tab, TabPanels, TabPanel, Button, ExpectedIssueComponent, RouterLink, InputGroup, FormsModule, InputText, InputGroupAddon, ReceivedIssueComponent, PaginatorComponent, HoldingDetailComponent, LocalFieldComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
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

