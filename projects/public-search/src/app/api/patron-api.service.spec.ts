// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Message, PatronApiService } from './patron-api.service';

describe('PatronApiService', () => {
  let service: PatronApiService;

  const messages = [
    {
      content: 'This person will be in vacations.',
      type: 'warning'
    }
  ];

  const httpClientSpy = { get: vi.fn() };
  httpClientSpy.get.mockReturnValue(of(messages));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(PatronApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user messages', () => {
    service.getMessages('4')
      .subscribe((response: Message[]) => expect(response).toEqual(messages));
  });
});
