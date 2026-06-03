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
import { TestBed } from '@angular/core/testing';
import { OperationLogsService } from './operation-logs.service';
import { AppStore } from '../store/app.store';

describe('OperationLogsService', () => {
  let service: OperationLogsService;
  let settings: any;

  beforeEach(() => {
    settings = {
      operationLogs: {
        documents: 'Documents'
      }
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AppStore, useValue: { settings: vi.fn(() => settings) } }
      ]
    });
    service = TestBed.inject(OperationLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a boolean for log operation visibility', () => {
    expect(service.isLogVisible('documents')).toBe(true);
    expect(service.isLogVisible('items')).toBe(false);
  });

  it('Should return an exception if the resource does not exist', () => {
    expect(() => service.getResourceKeyByResourceName('foo'))
      .toThrow(new Error('Operation logs: Missing resource key'));
  });

  it('Should return operation log configuration', () => {
    expect(service.getResourceKeyByResourceName('documents')).toEqual('Documents');
  });
});
