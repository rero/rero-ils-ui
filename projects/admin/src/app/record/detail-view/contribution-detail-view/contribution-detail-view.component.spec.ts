/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { SharedModule } from '@rero/shared';
import { ContributionDetailViewComponent } from './contribution-detail-view.component';


describe('ContributionDetailViewComponent', () => {
  let component: ContributionDetailViewComponent;
  let fixture: ComponentFixture<ContributionDetailViewComponent>;

  const emptyRecords = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 0
      },
      hits: []
    },
    links: {}
  };
  const recordTestingServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords']);
  recordTestingServiceSpy.getRecords.and.returnValue(of(emptyRecords));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContributionDetailViewComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        SharedModule
      ],
      providers: [
        { provide: RecordService, useValue: recordTestingServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributionDetailViewComponent);
    component = fixture.componentInstance;
    component.record$ = new Observable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
