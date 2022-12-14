/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
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

import { Component, Input } from '@angular/core';
import { PatronTransaction, PatronTransactionEvent } from '../../../classes/patron-transaction';

@Component({
  selector: 'admin-patron-transaction-event-default',
  templateUrl: './patron-transaction-event-default.component.html',
  styleUrls: ['./patron-transaction-events-brief-view.component.scss']
})
export class PatronTransactionEventDefaultComponent {

  @Input() event: PatronTransactionEvent;
  @Input() parent: PatronTransaction;

}
