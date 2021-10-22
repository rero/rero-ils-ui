/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService, CoreModule } from '@rero/ng-core';
import { ToastrModule } from 'ngx-toastr';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { AcqOrderApiService } from '../../../api/acq-order-api.service';
import { OrderReceipt } from './order-receipt';
import { OrderReceiptForm } from './order-receipt-form';
import { OrderReceiptViewComponent } from './order-receipt-view.component';


describe('OrderReceiptViewComponent', () => {
  let component: OrderReceiptViewComponent;
  let fixture: ComponentFixture<OrderReceiptViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderReceiptViewComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        CoreModule
      ],
      providers: [
        OrderReceipt,
        { provide: OrderReceiptForm, deps: [AcqOrderApiService, AcqAccountApiService, ApiService, OrderReceipt] }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReceiptViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
