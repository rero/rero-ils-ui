/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021 UCLouvain
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

import { Component, inject, OnInit } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable } from 'rxjs';
import { OrganisationService } from '../../../../service/organisation.service';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { IAcqAccount } from '../../../classes/account';

@Component({
  selector: 'admin-acquisition-account-detail-view',
  templateUrl: './account-detail-view.component.html',
  styleUrls: ['./account-detail-view.component.scss']
})
export class AccountDetailViewComponent implements OnInit, DetailRecord {

  private acqAccountApiService: AcqAccountApiService = inject(AcqAccountApiService);
  private organisationService: OrganisationService = inject(OrganisationService);

  // COMPONENT ATTRIBUTES =======================================================
  /** Observable resolving record data */
  record$: Observable<any>;
  /** metadata from ES - much more complete than DB stored record */
  esRecord$: Observable<IAcqAccount>;
  /** Resource type */
  type: string;

  // GETTER & SETTER ============================================================
  /** Get the current budget pid for the organisation */
  get organisation(): any {
    return this.organisationService.organisation;
  }

  /** OnInit hook */
  ngOnInit(): void {
    this.record$.subscribe((data: any) => {
      this.esRecord$ = this.acqAccountApiService.getAccount(data.metadata.pid);
    });
  }
}
