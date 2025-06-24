/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiService, RecordModule } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { AccordionModule } from 'primeng/accordion';
import { InputNumberModule } from 'primeng/inputnumber';
import { TimelineModule } from 'primeng/timeline';
import { TreeTableModule } from 'primeng/treetable';
import { PreviewEmailModule } from '../shared/preview-email/preview-email.module';
import { AcquisitionRoutingModule } from './acquisition-routing.module';
import { AcqAccountApiService } from './api/acq-account-api.service';
import { AcqOrderApiService } from './api/acq-order-api.service';
import { AccountDetailViewComponent } from './components/account/account-detail-view/account-detail-view.component';
import { AccountListComponent } from './components/account/account-list/account-list.component';
import { AccountTransferComponent } from './components/account/account-transfer/account-transfer.component';
import { AcquisitionMainComponent } from './components/acquisition-main/acquisition-main.component';
import { AddressTypeComponent } from './components/address-type/address-type.component';
import { BudgetsBriefViewComponent } from './components/budget/budget-brief-view/budgets-brief-view.component';
import { BudgetDetailViewComponent } from './components/budget/budget-detail-view/budget-detail-view.component';
import { SelectAccountEditorWidgetComponent } from './components/editor/widget/select-account-editor-widget/select-account-editor-widget.component';
import { NotesComponent } from './components/notes/notes.component';
import { OrderBriefViewComponent } from './components/order/order-brief-view/order-brief-view.component';
import { OrderDetailViewComponent } from './components/order/order-detail-view/order-detail-view.component';
import { OrderLineComponent } from './components/order/order-detail-view/order-line/order-line.component';
import { OrderLinesComponent } from './components/order/order-detail-view/order-lines/order-lines.component';
import { OrderEmailFormComponent } from './components/order/order-email-form/order-email-form.component';
import { OrderSummaryComponent } from './components/order/order-summary/order-summary.component';
import { OrderReceipt } from './components/receipt/receipt-form/order-receipt';
import { OrderReceiptForm } from './components/receipt/receipt-form/order-receipt-form';
import { OrderReceiptViewComponent } from './components/receipt/receipt-form/order-receipt-view.component';
import { ReceiptListComponent } from './components/receipt/receipt-list/receipt-list.component';
import { ReceiptSummaryComponent } from './components/receipt/receipt-summary/receipt-summary.component';
import { VendorBriefViewComponent } from './components/vendors/vendor-brief-view.component';
import { VendorDetailViewComponent } from './components/vendors/vendor-detail-view/vendor-detail-view.component';
import { registerFormlyExtension } from './formly/extension';
import { FieldDocumentBriefViewTypeComponent } from './formly/type/field-document-brief-view.type';
import { FieldRefTypeComponent } from './formly/type/field-ref.type';
import { RepeatTypeComponent } from './formly/type/repeat-section.type';
import { InputNoLabelWrapperComponent } from './formly/wrapper/input-no-label.wrapper';
import { AccountAvailableAmountPipe } from './pipes/account-available-amount.pipe';
import { NegativeAmountPipe } from './pipes/negative-amount.pipe';
import { NoteBadgeColorPipe } from './pipes/note-badge-color.pipe';
import { ReceiptLineTotalAmountPipe } from './pipes/receipt-line-total-amount.pipe';
import { ReceptionDatesPipe } from './pipes/reception-dates.pipe';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ReceiptLineComponent } from './components/receipt/receipt-line/receipt-line.component';

@NgModule({
  declarations: [
    AccountAvailableAmountPipe,
    AccountDetailViewComponent,
    AccountListComponent,
    AccountTransferComponent,
    AcquisitionMainComponent,
    AddressTypeComponent,
    BudgetDetailViewComponent,
    BudgetsBriefViewComponent,
    FieldDocumentBriefViewTypeComponent,
    FieldRefTypeComponent,
    InputNoLabelWrapperComponent,
    NegativeAmountPipe,
    NoteBadgeColorPipe,
    NotesComponent,
    OrderBriefViewComponent,
    OrderDetailViewComponent,
    OrderEmailFormComponent,
    OrderLineComponent,
    OrderLinesComponent,
    OrderReceiptViewComponent,
    OrderSummaryComponent,
    ReceiptLineComponent,
    ReceiptLineTotalAmountPipe,
    ReceiptListComponent,
    ReceiptSummaryComponent,
    ReceptionDatesPipe,
    RepeatTypeComponent,
    SelectAccountEditorWidgetComponent,
    VendorBriefViewComponent,
    VendorDetailViewComponent,
  ],
  imports: [
    AccordionModule,
    AcquisitionRoutingModule,
    CommonModule,
    FormlyModule.forChild({
      types: [
        { name: 'repeat', component: RepeatTypeComponent },
        { name: 'field-document-brief-view', component: FieldDocumentBriefViewTypeComponent },
        { name: 'field-ref', component: FieldRefTypeComponent },
        { name: 'account-select', component: SelectAccountEditorWidgetComponent }
      ],
      wrappers: [
        { name: 'input-no-label', component: InputNoLabelWrapperComponent }
      ]
    }),
    FormsModule,
    PreviewEmailModule,
    ReactiveFormsModule,
    RecordModule,
    SharedModule,
    TimelineModule,
    TranslateModule,
    TreeTableModule,
    InputNumberModule,
    OverlayBadgeModule
  ],
  providers: [
    { provide: FORMLY_CONFIG, multi: true, useFactory: registerFormlyExtension, deps: [TranslateService] },
    OrderReceipt,
    { provide: OrderReceiptForm, deps: [AcqOrderApiService, AcqAccountApiService, ApiService, OrderReceipt] }
  ]
})
export class AcquisitionModule { }
