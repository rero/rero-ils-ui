/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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

import { TestBed } from "@angular/core/testing";
import { ResourcesFilesService } from "./resources-files.service";
import { HttpClient } from "@angular/common/http";
import { ApiService, File, RecordService } from "@rero/ng-core";
import { apiResponse, UserService } from "@rero/shared";
import { of } from "rxjs";
import { cloneDeep } from 'lodash-es';

describe('ResourcesFilesService', () => {
  let service: ResourcesFilesService;

  const response = {
    "hits": {
      "hits": [
        {
          "id": "6az65-5bf71",
          "created": "2025-04-09T13:12:06.013939+00:00",
          "updated": "2025-04-09T13:12:06.207588+00:00",
          "links": {
            "self": "https://127.0.0.1:5000/api/records/6az65-5bf71"
          },
          "revision_id": 2,
          "metadata": {
            "library": {
              "pid": "4",
              "type": "lib"
            },
            "document": {
              "pid": "258",
              "type": "doc"
            },
            "n_files": 2,
            "file_size": 192904
          }
        }
      ],
      "total": 1
    },
    "sortBy": "newest",
    "links": {
      "self": "https://127.0.0.1:5000/api/records?page=1&size=25&sort=newest"
    }
  }

  const file: File = {
    updated: '2025-04-23',
    size: '1000234',
    mimetype: 'image/jpeg',
    version_id: 'di3',
    is_head: false,
    created: '2025-04-23',
    tags: ['image'],
    delete_marker: false,
    links: {
        self: '/link/images'
    },
    checksum: 'A123456FDE12',
    key: 'file_key',
    showInfo: true,
    showChildren: false,
    metadata: {
      label: 'file_key'
    }
  };

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['delete', 'get', 'post', 'put']);

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = {
    currentLibrary: '1'
  }


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResourcesFilesService,
        ApiService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    service = TestBed.inject(ResourcesFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the parent', () => {
    const parentTransform = {
      metadata: {
        library: {
          $ref: '/api/libraries/4'
        },
        document: {
          $ref: '/api/documents/258'
        },
        n_files: 2,
        file_size: 192904
      }
    };
    const responseCopy = {...response};
    const parentWith$ref = {...responseCopy.hits.hits[0], ...parentTransform};
    // console.log('response', response);
    httpClientSpy.get.and.returnValue(of({...response}));
    service.currentParentRecord$.subscribe((result: any) => {
      if (result) {
        expect(result).toEqual(parentWith$ref);
      }
    });
    service.getParentRecord('1')
      .subscribe((result: any) => expect(result).toEqual(parentWith$ref));
  });

  it('should create a new parent and return the record.', () => {
    const parentTransform = {
      metadata: {
        library: {
          $ref: '/api/libraries/4'
        },
        document: {
          $ref: '/api/documents/260'
        },
        n_files: 2,
        file_size: 192904
      }
    };
    const responseCopy = {...response};
    const parentWith$ref = {...responseCopy.hits.hits[0], ...parentTransform};
    httpClientSpy.post.and.returnValue(of(parentWith$ref));
    service.currentParentRecord$.subscribe((result: any) => {
      if (result) {
        expect(result).toEqual(parentWith$ref);
      }
    });
    service.createParentRecord('1')
      .subscribe((result: any) => expect(result).toEqual(parentWith$ref));
  });

  it('should update the parent', () => {
    const responseCopy = {...response.hits.hits[0]};
    httpClientSpy.put.and.returnValue(of(responseCopy));
    service.updateParentRecordMetadata('1', {})
      .subscribe((result: any) => expect(result).toEqual(responseCopy))
  });

  it('should return a list of files', () => {
    const response = {
      entries: [
        {
          key: 'file_key',
          metadata: null,
          is_head: false
        }
      ]
    }
    const result = {...response};
    result.entries[0].is_head = true;
    result.entries[0].metadata = { label: 'file_key' }
    httpClientSpy.get.and.returnValue(of(response));
    service.list('1')
      .subscribe((result: any) => expect(result).toEqual(result));
  });

  it('should return a new file', () => {
    httpClientSpy.post.and.returnValue(of(file));
    httpClientSpy.put.and.returnValue(of(file));
    service.create('1', 'file_key', { label: 'file label'})
      .subscribe((result: any) => expect(result).toEqual(file));
  });

  it('should delete a file', () => {
    const response = {
      entries: [
        {
          key: 'file_key',
          metadata: null,
          is_head: false
        }
      ]
    }
    httpClientSpy.delete.and.returnValue(of({}));
    httpClientSpy.get.and.returnValue(of(response));
    service.delete('1', 'file_key').subscribe((result: any) => expect(result).toBeTrue());

    const responseBis = {
      entries: [
        {
          metadata: {
            type: 'thumbnail',
          },
          key: 'file_key',
          is_head: false
        }
      ]
    }
    httpClientSpy.get.and.returnValue(of(responseBis));
    service.currentParentRecord$.subscribe((result: any) => {
      expect(result).toEqual(null);
    });
    service.delete('1', 'file_key').subscribe((result: any) => expect(result).toEqual({}));
  });
});
