/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { Component, inject, input, model, OnInit, ChangeDetectionStrategy} from '@angular/core';
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
import { AsyncPipe } from '@angular/common';
import { GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-serial-holding-detail-view',
    templateUrl: './serial-holding-detail-view.component.html',
    providers: [HoldingsSerialStore],
    imports: [TranslateDirective, RecordMaskedComponent, DocumentsBriefViewComponent, HoldingSharedViewComponent, Bind, Tabs, TabList, Ripple, Tab, TabPanels, TabPanel, Button, ExpectedIssueComponent, RouterLink, InputGroup, FormsModule, InputText, InputGroupAddon, ReceivedIssueComponent, PaginatorComponent, HoldingDetailComponent, LocalFieldComponent, AsyncPipe, TranslatePipe, GetRecordPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SerialHoldingDetailViewComponent implements OnInit {

  protected store = inject(HoldingsSerialStore);

  holding = input.required<EsRecord>();

  protected filter = model<string>('');

  /** OnInit hook */
  ngOnInit(): void {
    this.store.setHoldings(this.holding);
    this.store.setFilter(this.filter);
  }
}

