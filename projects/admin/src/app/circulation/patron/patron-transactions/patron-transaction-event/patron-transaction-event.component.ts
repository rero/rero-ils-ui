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
import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { PatronTransactionEvent, PatronTransactionEventType } from '@app/admin/classes/patron-transaction';

@Component({
  selector: 'admin-patron-transaction-event',
  templateUrl: './patron-transaction-event.component.html'
})
export class PatronTransactionEventComponent {

  private organisationService: OrganisationService = inject(OrganisationService);
  private translateService: TranslateService = inject(TranslateService);

  /** the event ot display */
  @Input() event: PatronTransactionEvent;

  /** is the transaction event is collapsed */
  isCollapsed = true;

  /** store a reference to enum to use in html template */
  patronTransactionEventType = PatronTransactionEventType;

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this.organisationService.organisation;
  }

  /**
   * Get the best possible label of the transaction event
   * @return label to display as string
   */
  get label(): string {
    return (this.event.subtype)
      ? `${this.translateService.instant(this.event.type.toString())} [${this.translateService.instant(this.event.subtype)}]`
      : this.translateService.instant(this.event.type.toString());
  }
}
