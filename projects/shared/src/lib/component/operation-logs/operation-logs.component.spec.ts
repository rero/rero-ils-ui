/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgCoreTranslateService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
class FakeLoader implements TranslateLoader {
  getTranslation(_lang: string): Observable<any> { return of({}); }
}
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { AppStore } from '../../store/app.store';
import { OperationLogsComponent } from './operation-logs.component';

describe('OperationLogsComponent', () => {
  let component: OperationLogsComponent;
  let fixture: ComponentFixture<OperationLogsComponent>;

  const records = [
    {
      medatadata: {
        date: '2021-01-10 12:00:00',
        operation: 'create',
        user_name: 'system'
      }
    }
  ];

  const appStoreSpy = {
    getResourceKeyByResourceName: vi.fn().mockReturnValue('doc')
  };

  const operationLogsApiServiceSpy = {
    getLogs: vi.fn().mockReturnValue(of({
      aggregations: [],
      hits: { total: { value: 1 }, hits: records },
      links: [],
      total: { value: 1 }
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: FakeLoader } }),
        DynamicDialogModule,
        TableModule,
        ButtonModule,
        OperationLogsComponent
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'en-US' },
        { provide: NgCoreTranslateService, useValue: { instant: vi.fn((x: string) => x) } },
        { provide: AppStore, useValue: appStoreSpy },
        { provide: OperationLogsApiService, useValue: operationLogsApiServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        DynamicDialogRef,
        DynamicDialogConfig
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationLogsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a native element', () => {
    expect(fixture.nativeElement).toBeDefined();
  });
});
