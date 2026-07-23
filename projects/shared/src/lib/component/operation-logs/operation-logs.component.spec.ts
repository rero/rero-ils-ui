// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DateTranslatePipe, NgCoreTranslateService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
class FakeLoader implements TranslateLoader {
  getTranslation(_lang: string): Observable<any> { return of({}); }
}
@Pipe({
  name: 'dateTranslate'
})
class MockDateTranslatePipe implements PipeTransform {
  transform(value: string): string { return value; }
}
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { AppStore } from '../../store/app.store';
import { OperationLogsComponent } from './operation-logs.component';

describe('OperationLogsComponent', () => {
  let component: OperationLogsComponent;
  let fixture: ComponentFixture<OperationLogsComponent>;
  let appStoreSpy: any;
  let operationLogsApiServiceSpy: any;
  let dynamicDialogConfig: { data: any };

  const records = [
    {
      metadata: {
        date: '2021-01-10 12:00:00',
        operation: 'create',
        user_name: 'system'
      }
    }
  ];

  beforeEach(async () => {
    appStoreSpy = {
      getResourceKeyByResourceName: vi.fn().mockReturnValue('doc')
    };
    operationLogsApiServiceSpy = {
      getLogs: vi.fn().mockReturnValue(of({
        aggregations: [],
        hits: { total: { value: 1 }, hits: records },
        links: [],
        total: { value: 1 }
      }))
    };
    dynamicDialogConfig = {
      data: {
        resourceType: 'documents',
        resourcePid: '1'
      }
    };
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
        {
          provide: DynamicDialogConfig,
          useValue: dynamicDialogConfig
        }
    ]
    })
    .overrideComponent(OperationLogsComponent, {
      remove: { imports: [DateTranslatePipe] },
      add: { imports: [MockDateTranslatePipe] }
    })
    .compileComponents();
  });

  const createComponent = () => {
    fixture = TestBed.createComponent(OperationLogsComponent);
    component = fixture.componentInstance;
  };

  it('should create', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('should have a native element', () => {
    createComponent();

    expect(fixture.nativeElement).toBeDefined();
  });

  it('should load the first page of resource operation logs', async () => {
    createComponent();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(operationLogsApiServiceSpy.getLogs).toHaveBeenCalledWith('doc', '1', 1, 10, 'mostrecent');
    expect(component.records()).toEqual(records);
    expect(component.recordTotals()).toBe(1);
  });

  it('should use configured sort criteria and options', async () => {
    dynamicDialogConfig.data.sortCriteria = 'operation_date_mostrecent';
    dynamicDialogConfig.data.sortOptions = [
      { value: 'operation_date_mostrecent', label: 'Date (newest)', icon: 'fa fa-sort-amount-desc' },
      { value: 'operation_date_created', label: 'Date (oldest)', icon: 'fa fa-sort-amount-asc' }
    ];

    createComponent();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.sortCriteria()).toBe('operation_date_mostrecent');
    expect(component.sortOptions()).toEqual(dynamicDialogConfig.data.sortOptions);
    expect(operationLogsApiServiceSpy.getLogs).toHaveBeenCalledWith('doc', '1', 1, 10, 'operation_date_mostrecent');
  });

  it('should hide the paginator when operation logs fit on one page', async () => {
    createComponent();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('shared-paginator')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('p-paginator').style.display).toBe('none');
  });

  it('should display the paginator when operation logs exceed one page', async () => {
    operationLogsApiServiceSpy.getLogs.mockReturnValueOnce(of({
      aggregations: [],
      hits: { total: { value: 11 }, hits: records },
      links: [],
      total: { value: 11 }
    }));

    createComponent();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('shared-paginator')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('p-paginator').style.display).not.toBe('none');
  });

  it('should replace records on page change', async () => {
    const nextRecords = [
      {
        metadata: {
          date: '2021-01-09 12:00:00',
          operation: 'update',
          user_name: 'system'
        }
      }
    ];
    createComponent();
    fixture.detectChanges();
    await fixture.whenStable();
    TestBed.tick();
    fixture.detectChanges();
    await fixture.whenStable();
    operationLogsApiServiceSpy.getLogs.mockClear();
    operationLogsApiServiceSpy.getLogs.mockReturnValueOnce(of({
      aggregations: [],
      hits: { total: { value: 11 }, hits: nextRecords },
      links: [],
      total: { value: 11 }
    }));
    component.pageChange({ page: 1, first: 10, rows: 10, pageCount: 2 });
    expect(component.pager().page).toBe(2);
    TestBed.tick();
    await fixture.whenStable();

    expect(operationLogsApiServiceSpy.getLogs).toHaveBeenLastCalledWith('doc', '1', 2, 10, 'mostrecent');
    expect(component.records()).toEqual(nextRecords);
    expect(component.recordTotals()).toBe(11);
  });

  it('should reset to the first page and load oldest records on sort change', async () => {
    const oldestRecords = [
      {
        metadata: {
          date: '2021-01-01 12:00:00',
          operation: 'create',
          user_name: 'system'
        }
      }
    ];
    createComponent();
    fixture.detectChanges();
    await fixture.whenStable();
    operationLogsApiServiceSpy.getLogs.mockReturnValueOnce(of({
      aggregations: [],
      hits: { total: { value: 11 }, hits: oldestRecords },
      links: [],
      total: { value: 11 }
    }));
    component.pageChange({ page: 1, first: 10, rows: 10, pageCount: 2 });
    TestBed.tick();
    fixture.detectChanges();
    await fixture.whenStable();
    operationLogsApiServiceSpy.getLogs.mockReturnValueOnce(of({
      aggregations: [],
      hits: { total: { value: 11 }, hits: oldestRecords },
      links: [],
      total: { value: 11 }
    }));

    component.sortChange({ originalEvent: undefined, value: 'created' });
    TestBed.tick();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.sortCriteria()).toBe('created');
    expect(component.pager().page).toBe(1);
    expect(component.pager().first).toBe(1);
    expect(operationLogsApiServiceSpy.getLogs).toHaveBeenLastCalledWith('doc', '1', 1, 10, 'created');
    expect(component.records()).toEqual(oldestRecords);
  });

  it('should support empty results', async () => {
    operationLogsApiServiceSpy.getLogs.mockReturnValueOnce(of({
      aggregations: [],
      hits: { total: { value: 0 }, hits: [] },
      links: [],
      total: { value: 0 }
    }));

    createComponent();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.records()).toEqual([]);
    expect(component.recordTotals()).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('No operation log found.');
  });
});
