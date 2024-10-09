/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { PatronTransactionApiService } from '@app/admin/api/patron-transaction-api.service';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { tap } from 'rxjs';

@Component({
  selector: 'admin-item-fees',
  templateUrl: './item-fees.component.html'
})
export class ItemFeesComponent implements OnInit {

  private patronTransactionApiService: PatronTransactionApiService = inject(PatronTransactionApiService);
  private organisationService: OrganisationService = inject(OrganisationService);

  /** Item pid */
  @Input() itemPid: string;

  /** Fees */
  fees: any[] = [];

  /** Total fees */
  total: number = 0;

  /**
   * Get the current organisation
   * @return Organisation
   */
  get organisation() {
    return this.organisationService.organisation;
  }

  /** OnInit hook */
  ngOnInit(): void {
      this.patronTransactionApiService.getActiveFeesByItemPid(this.itemPid)
        .pipe(tap((fees: any) => fees.map((fee: any) => this.total += fee.metadata.total_amount)))
        .subscribe((fees: any) => this.fees = fees);
  }
}
