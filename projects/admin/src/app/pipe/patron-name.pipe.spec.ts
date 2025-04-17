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

import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { PatronService } from "../service/patron.service";
import { PatronNamePipe } from "./patron-name.pipe";

describe('PatronNamePipe', () => {
  let pipe: PatronNamePipe;
  let recordService: RecordService;

  const patron = {
    metadata: {
      pid: '1',
      first_name: 'John',
      last_name: 'Doe'
    }
  };

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecord']);
  recordServiceSpy.getRecord.and.returnValue(of(patron));

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        PatronNamePipe,
        PatronService,
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    pipe = TestBed.inject(PatronNamePipe);
    recordService = TestBed.inject(RecordService);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the full name of the patron', () => {
    pipe.transform('1')
    .subscribe((fullname: string) => expect(fullname).toEqual('Doe, John'));
  });
});
