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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { OperationLogsService } from '../../service/operation-logs.service';
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

  const operationLogsServiceSpy = jasmine.createSpyObj('OperationLogsService', ['_setting', 'getResourceKeyByResourceName']);
  operationLogsServiceSpy._setting.and.returnValue({
    documents: 'doc',
    holdings: 'hold',
    items: 'item'
  });
  operationLogsServiceSpy.getResourceKeyByResourceName.and.returnValue('doc');

  const operationLogsApiServiceSpy = jasmine.createSpyObj('OperationLogsApiService', ['getLogs']);
  operationLogsApiServiceSpy.getLogs.and.returnValue(of({
    aggregations: [],
    hits: {
      total: {
        value: 1
      },
      hits: records
    },
    links: [],
    total: {
      value: 1
    }
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationLogsComponent],
      imports: [
        TranslateModule.forRoot(),
        DynamicDialogModule,
        TableModule,
        ButtonModule
      ],
      providers: [
          { provide: OperationLogsService, useValue: operationLogsServiceSpy },
          { provide: OperationLogsApiService, useValue: operationLogsApiServiceSpy },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          DynamicDialogRef,
          DynamicDialogConfig
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the log table', () => {
    const htmlElement: HTMLElement = fixture.nativeElement;
    expect(htmlElement).toBeDefined();
  });
});
