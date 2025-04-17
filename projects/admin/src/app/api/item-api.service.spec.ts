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
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule, RecordService } from '@rero/ng-core';
import { IAvailability } from '@rero/shared';
import { of } from 'rxjs';
import { ItemApiService } from './item-api.service';
import { ITypeEmail } from '../shared/preview-email/IPreviewInterface';

describe('ItemApiService', () => {
  let service: ItemApiService;

  const record = {
    metadata: {
      pid: '1'
    }
  };

  const availability: IAvailability = {
    available: true,
    status: 'on_loan'
  }

  const item = {
    pid: 1,
    location: {
      $ref: '1'
    }
  };

  const statItem = {
    total: {
      checkout: 5
    },
    total_year: {
      checkout: 1
    }
  };

  const preview = {
    preview: 'lorem',
    recipient_suggestions: [
      {
        address: 'foo@bar.com',
        type: ['to']
      },
      {
        address: 'bar@foo.com',
        type: ['cc', 'reply_to']
      }
    ]
  };

  const emailTypes: ITypeEmail[] = [
    {
      type: 'to',
      address: 'foo@bar.com'
    }
  ];

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecord', 'update']);
  recordServiceSpy.getRecord.and.returnValue(of(record));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RecordModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(ItemApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a record ', () => {
    service.getItem('1').subscribe((result: any) => {
      expect(result.pid).toEqual('1');
    });
  });

  it('should return the item\'s updated location', () => {
    const itemUpdated = {...item};
    itemUpdated.location = { $ref: 'api/locations/2' };
    recordServiceSpy.update.and.returnValue(of(itemUpdated));
    service.updateLocation(item, '2').subscribe((result: any) => {
      expect(result).toEqual(itemUpdated);
    })
  });

  it('should return the availability of the item', () => {
    httpClientSpy.get.and.returnValue(of(availability));
    service.getAvailability('1')
      .subscribe((response: IAvailability) => expect(response).toEqual(availability));
  });

  it('should return statistics on an item', () => {
    httpClientSpy.get.and.returnValue(of(statItem));
    service.getStatsByItemPid('1')
      .subscribe((result: any) => expect(result).toEqual(statItem));
  });

  it('should return the preview on the item', () => {
    httpClientSpy.get.and.returnValue(of(preview));
    service.getPreviewByItemPid('1')
      .subscribe((result: any) => expect(result).toEqual(preview));
  });

  it('should add a claim at the end of the item', () => {
    httpClientSpy.post.and.returnValue(of(true));
    service.addClaimIssue('1', emailTypes)
      .subscribe((result: any) => expect(result).toBeTrue())
  });
});
