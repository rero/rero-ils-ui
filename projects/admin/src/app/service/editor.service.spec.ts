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
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { EditorService } from './editor.service';

describe('EditorService', () => {
  const record = {
    metadata: {
      pid: 1,
      title: 'my title'
    }
  };
  let editorService: EditorService;

  const recordServiceSpy = jasmine.createSpyObj(
    'recordService', ['getRecord']
  );
  recordServiceSpy.getRecord.and.returnValue(of(record));

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      TranslateModule.forRoot()
    ],
    providers: [
      { provide: RecordService, useValue: recordServiceSpy },
    ]
  }));

  beforeEach(() => {
    editorService = TestBed.get(EditorService);
  });

  it('should be created', () => {
    expect(editorService).toBeTruthy();
  });
});
