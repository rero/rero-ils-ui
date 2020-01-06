/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RecordModule } from '@rero/ng-core';
import { BsDropdownModule } from 'ngx-bootstrap';
import { CheckoutComponent } from './checkout/checkout.component';
import { CirculationRoutingModule } from './circulation-routing.module';
import { ItemsListComponent } from './items-list/items-list.component';
import { MainRequestComponent } from './main-request/main-request.component';
import { CardComponent } from './patron/card/card.component';
import { LoanComponent } from './patron/loan/loan.component';
import { MainComponent } from './patron/main/main.component';
import { RequestedItemsListComponent } from './requested-items-list/requested-items-list.component';


@NgModule({
  declarations: [
    MainComponent,
    MainRequestComponent,
    RequestedItemsListComponent,
    CardComponent,
    ItemsListComponent,
    LoanComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    CirculationRoutingModule,
    BsDropdownModule.forRoot(),
    RecordModule
  ]
})
export class CirculationModule { }
