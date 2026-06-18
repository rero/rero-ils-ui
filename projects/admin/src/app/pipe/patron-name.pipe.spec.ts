// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ApiService, RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { PatronService } from "../service/patron.service";
import { PatronNamePipe } from "./patron-name.pipe";

describe('PatronNamePipe', () => {
  let pipe: PatronNamePipe;

  const patron = {
    metadata: {
      pid: '1',
      first_name: 'John',
      last_name: 'Doe'
    }
  };

  const recordServiceSpy = { getRecord: vi.fn() };
  recordServiceSpy.getRecord.mockReturnValue(of(patron));

  const httpClientSpy = { } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        PatronNamePipe,
        PatronService,
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ApiService, useValue: {} }
      ]
    });

    pipe = TestBed.inject(PatronNamePipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the full name of the patron', () => {
    pipe.transform('1')
    .subscribe((fullname: string) => expect(fullname).toEqual('Doe, John'));
  });
});
