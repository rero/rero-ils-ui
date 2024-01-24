/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule, RecordService } from '@rero/ng-core';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { FieldRefTypeComponent } from './field-ref.type';

describe('CanAccessGuard', () => {
  let recordService: RecordService;

  const result = {
    hits: {
      hits: [{
        metadata: {
          pid: 1,
          title: []
        }
      }
    ],
      total: 1
    }
  };

  const recordServiceSpy = jasmine.createSpyObj('Recordservice', ['getRecords', 'totalHits']);
  recordServiceSpy.totalHits.and.returnValue(1);


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy }
      ]

    });
    recordService = TestBed.inject(RecordService);
  });

  it('should be created', () => {
    recordServiceSpy.getRecords.and.returnValue(of(result));
    expect(new FieldRefTypeComponent(recordService)).toBeTruthy();
  });

  it('should return the title', () => {
    const record = cloneDeep(result);
    record.hits.hits[0].metadata.title = [{
      _text: 'Pêcheur & Chasseur Suisses.',
      mainTitle: [
        {
          value: 'Pêcheur & Chasseur Suisses.'
        }
      ],
      type: 'bf:Title'
    }];
    recordServiceSpy.getRecords.and.returnValue(of(record));
    const fieldType = new FieldRefTypeComponent(recordService);
    fieldType.field = {
      model: {
        document: 1
      },
      props: {
      resource: 'documents',
      resourceKey: 'document',
      resourceField: 'title.0._text'
    }};
    fieldType.ngOnInit();
    expect(fieldType.value).toEqual('Pêcheur & Chasseur Suisses.');
  });

  it('should not return the title', () => {
    const record = cloneDeep(result);
    record.hits.hits[0].metadata.title = [{
      mainTitle: [
        {
          value: 'Pêcheur & Chasseur Suisses.'
        }
      ],
      type: 'bf:AbbreviatedTitle'
    }];
    recordServiceSpy.getRecords.and.returnValue(of(record));
    const fieldType = new FieldRefTypeComponent(recordService);
    fieldType.field = {
      model: {
        document: 1
      },
      props: {
      resource: 'documents',
      resourceKey: 'document',
      resourceField: 'title.0._text'
    }};
    fieldType.ngOnInit();
    expect(fieldType.value).toBeUndefined();
  });

  it('should return the title with type bf:Title', () => {
    const record = cloneDeep(result);
    record.hits.hits[0].metadata.title = [
      {
        _text: 'Pêcheur et Chasseur Suisses : nature-information',
        mainTitle: [
          {
            value: 'Pêcheur et Chasseur Suisses'
          }
        ],
        subTitle: [
          {
            value: 'nature-information'
          }
        ],
        type: 'bf:Title'
      }
    ];
    recordServiceSpy.getRecords.and.returnValue(of(record));
    const fieldType = new FieldRefTypeComponent(recordService);
    fieldType.field = {
      model: {
        document: 1
      },
      props: {
      resource: 'documents',
      resourceKey: 'document',
      resourceField: 'title.0._text',
      resourceSelect: {
        field: 'type',
        value: 'bf:Title'
      }
    }};
    fieldType.ngOnInit();
    expect(fieldType.value).toEqual('Pêcheur et Chasseur Suisses : nature-information');
  });
});
