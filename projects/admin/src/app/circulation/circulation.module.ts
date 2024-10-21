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
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { RecordModule } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { TabMenuModule } from 'primeng/tabmenu';
import { TagModule } from 'primeng/tag';
import { JournalVolumePipe } from 'projects/public-search/src/app/pipe/journal-volume.pipe';
import { CheckinActionComponent } from './checkin/checkin-action/checkin-action.component';
import { CheckinComponent } from './checkin/checkin.component';
import { CirculationRoutingModule } from './circulation-routing.module';
import { ItemComponent } from './item/item.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { MainRequestComponent } from './main-request/main-request.component';
import { RequestedItemComponent } from './main-request/requested-item/requested-item.component';
import { RequestedItemsListComponent } from './main-request/requested-items-list/requested-items-list.component';
import { CancelRequestButtonComponent } from './patron/cancel-request-button.component';
import { CardComponent } from './patron/card/card.component';
import { ChangePasswordFormComponent } from './patron/change-password-form/change-password-form.component';
import { HistoryLogLibraryComponent } from './patron/history/history-log-library/history-log-library.component';
import { HistoryLogComponent } from './patron/history/history-log/history-log.component';
import { HistoryComponent } from './patron/history/history.component';
import { IllRequestItemComponent } from './patron/ill-request/ill-request-item/ill-request-item.component';
import { IllRequestComponent } from './patron/ill-request/ill-request.component';
import { CirculationSettingsComponent } from './patron/loan/circulation-settings/circulation-settings.component';
import { FixedDateFormComponent } from './patron/loan/fixed-date-form/fixed-date-form.component';
import { LoanComponent } from './patron/loan/loan.component';
import { MainComponent } from './patron/main/main.component';
import { OverdueTransactionComponent } from './patron/patron-transactions/overdue-transaction/overdue-transaction.component';
import { PatronFeeComponent } from './patron/patron-transactions/patron-fee/patron-fee.component';
import {
  PatronTransactionEventFormComponent
} from './patron/patron-transactions/patron-transaction-event-form/patron-transaction-event-form.component';
import { PatronTransactionEventComponent } from './patron/patron-transactions/patron-transaction-event/patron-transaction-event.component';
import {
  DefaultTransactionDetailComponent
} from './patron/patron-transactions/patron-transaction/default-transaction-detail/default-transaction-detail.component';
import {
  OverdueTransactionDetailComponent
} from './patron/patron-transactions/patron-transaction/overdue-transaction-detail/overdue-transaction-detail.component';
import { PatronTransactionComponent } from './patron/patron-transactions/patron-transaction/patron-transaction.component';
import { PatronTransactionsComponent } from './patron/patron-transactions/patron-transactions.component';
import { PendingItemComponent } from './patron/pending/pending-item/pending-item.component';
import { PendingComponent } from './patron/pending/pending.component';
import { PickupItemComponent } from './patron/pickup/pickup-item/pickup-item.component';
import { PickupComponent } from './patron/pickup/pickup.component';
import { ProfileComponent } from './patron/profile/profile.component';
import { GetLoanCipoPipe } from './pipe/get-loan-cipo.pipe';

@NgModule({
    declarations: [
        MainComponent,
        MainRequestComponent,
        RequestedItemsListComponent,
        CardComponent,
        ItemsListComponent,
        LoanComponent,
        CheckinComponent,
        ItemComponent,
        ProfileComponent,
        PendingComponent,
        PendingItemComponent,
        PickupComponent,
        PickupItemComponent,
        PatronTransactionsComponent,
        PatronTransactionComponent,
        PatronTransactionEventComponent,
        PatronTransactionEventFormComponent,
        OverdueTransactionComponent,
        DefaultTransactionDetailComponent,
        OverdueTransactionDetailComponent,
        PatronTransactionEventFormComponent,
        HistoryComponent,
        RequestedItemComponent,
        ChangePasswordFormComponent,
        FixedDateFormComponent,
        OverdueTransactionComponent,
        HistoryLogComponent,
        HistoryLogLibraryComponent,
        GetLoanCipoPipe,
        CheckinActionComponent,
        PatronFeeComponent,
        CancelRequestButtonComponent,
        IllRequestComponent,
        IllRequestItemComponent,
        JournalVolumePipe,
        CirculationSettingsComponent
    ],
    imports: [
        CirculationRoutingModule,
        CommonModule,
        FormsModule,
        FormlyModule,
        ReactiveFormsModule,
        RecordModule,
        SharedModule,
        MenuModule,
        DynamicDialogModule,
        TagModule,
        ButtonModule,
        TabMenuModule,
        RippleModule
    ],
    providers: [
      CurrencyPipe
    ]
})
export class CirculationModule { }
