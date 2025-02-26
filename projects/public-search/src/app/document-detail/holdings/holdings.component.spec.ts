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
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@rero/ng-core';
import { of } from 'rxjs';
import { HoldingsApiService } from '../../api/holdings-api.service';
import { QueryResponse } from '../../record';
import { IdAttributePipe, SharedModule } from '@rero/shared';
import { HoldingsComponent } from './holdings.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('HoldingsComponent', () => {
  let component: HoldingsComponent;
  let fixture: ComponentFixture<HoldingsComponent>;

  const records: QueryResponse = {
    total: {
      value: 10,
      relation: 'eq'
    },
    hits: [{
      metadata: {
        pid: 1
      }
    }]
  };

  const recordServiceSpy = jasmine.createSpyObj('HoldingsService', [
    'getHoldingsByDocumentPidAndViewcode'
  ]);
  recordServiceSpy.getHoldingsByDocumentPidAndViewcode.and.returnValue(of(records));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [HoldingsComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [TranslateModule.forRoot(),
        LoadingBarModule,
        CoreModule,
        SharedModule],
    providers: [
        IdAttributePipe,
        { provide: HoldingsApiService, useValue: recordServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingsComponent);
    component = fixture.componentInstance;
    component.documentpid = '1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the link more holdings', () => {
    component.holdingsTotal = 20;
    fixture.detectChanges();
    const showMore = fixture.nativeElement.querySelector('.show-more-holdings');
    expect(showMore.textContent.trim()).toEqual('Show more');
  });

  it('should don\'t display the link more holdings', () => {
    component.holdingsTotal = 4;
    fixture.detectChanges();
    const showMore = fixture.nativeElement.querySelector('.show-more-holdings');
    expect(showMore).toBeNull();
  });
});
