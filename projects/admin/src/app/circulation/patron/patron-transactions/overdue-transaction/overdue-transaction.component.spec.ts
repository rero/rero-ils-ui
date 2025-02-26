import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Loan } from '../../../../classes/loans';
import { CirculationModule } from '../../../circulation.module';

import { OverdueTransactionComponent } from './overdue-transaction.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OverdueTransctionComponent', () => {
  let component: OverdueTransactionComponent;
  let fixture: ComponentFixture<OverdueTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [OverdueTransactionComponent],
    imports: [TranslateModule.forRoot(),
        CirculationModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueTransactionComponent);
    component = fixture.componentInstance;
    component.transaction = {
      fees: {
        total: 0,
        steps: []
      },
      loan: new Loan({
        document_pid: '201',
        end_date: '2020-11-26T16:19:04.000Z',
        item_pid: {
          type: 'item',
          value: '955'
        },
        organisation: {
          $ref: 'https://bib.rero.ch/api/organisations/1'
        },
        patron_pid: '11',
        pickup_location_pid: '11',
        pid: '45',
        start_date: '2021-01-27T16:19:03.555043+00:00',
        state: 'ITEM_ON_LOAN',
        transaction_date: '2021-01-27T16:19:03.555043+00:00',
        transaction_location_pid: '13',
      })
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
