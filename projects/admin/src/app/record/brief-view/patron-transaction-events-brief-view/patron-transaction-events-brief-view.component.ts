/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2022 UCLouvain
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
import { Component, inject, Input, OnInit } from '@angular/core';
import { ResultItem } from '@rero/ng-core';
import { PatronTransaction, PatronTransactionEvent, PatronTransactionEventType } from '@app/admin/classes/patron-transaction';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { Organisation } from '@app/admin/classes/core';
import { PatronTransactionsService } from '../../../service/patron-transactions.service';

@Component({
  selector: 'admin-patron-transaction-events-brief-view',
  templateUrl: './patron-transaction-events-brief-view.component.html',
  styleUrls: ['./patron-transaction-events-brief-view.component.scss']
})
export class PatronTransactionEventsBriefViewComponent implements ResultItem, OnInit {

  private organisationService: OrganisationService = inject(OrganisationService);
  private patronTransactionService: PatronTransactionsService = inject(PatronTransactionsService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Information to build the URL on the record detail view. */
  @Input() detailUrl: { link: string; external: boolean };
  /** The record to perform. */
  @Input() record: any;
  /** The type of the record. */
  @Input() type: string;

  /** is all data are loaded */
  loaded = false;
  /** transaction object representation from record */
  event: PatronTransactionEvent;
  /** Parent parent transaction */
  parent: PatronTransaction;
  /** current organisation */
  organisation: Organisation;
  /** reference to PatronTransactionEventType */
  eventTypes = PatronTransactionEventType;

  /** OnInit hook */
  ngOnInit(): void {
    this.organisation = this.organisationService.organisation;
    this.event = new PatronTransactionEvent(this.record.metadata);
    this.patronTransactionService
      .getPatronTransaction(this.event.parent.pid)
      .subscribe((parent: PatronTransaction) => {
        this.parent = parent;
        this.loaded = true;
      });
  }

}
