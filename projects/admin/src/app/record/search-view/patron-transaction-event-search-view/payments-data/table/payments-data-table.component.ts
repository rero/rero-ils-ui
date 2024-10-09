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
import { Component, inject, Input } from '@angular/core';
import { OrganisationService } from '../../../../../service/organisation.service';
import { PaymentData } from '../../interfaces';

@Component({
  selector: 'admin-payments-data-table',
  templateUrl: './payments-data-table.component.html',
  styleUrls: ['./payments-data-table.component.scss']
})
export class PaymentsDataTableComponent {

  private organisationService: OrganisationService = inject(OrganisationService);

  // COMPONENT ATTRIBUTES =====================================================
  @Input() protected data: PaymentData;

  // GETTER & SETTER ==========================================================
  /** Organisation currency */
  get org_currency() {
    return this.organisationService.organisation.default_currency;
  }
}
