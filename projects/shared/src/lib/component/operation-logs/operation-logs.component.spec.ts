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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { OperationLogsService } from '../../service/operation-logs.service';
import { OperationLogsComponent } from './operation-logs.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [OperationLogsComponent],
    imports: [TranslateModule.forRoot()],
    providers: [
        { provide: OperationLogsService, useValue: operationLogsServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationLogsComponent);
    component = fixture.componentInstance;
    component.records = records;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display operation history title', () => {
    const data = fixture.nativeElement.querySelector('h5');
    expect(data.textContent).toContain('Operation history');
  });
});
