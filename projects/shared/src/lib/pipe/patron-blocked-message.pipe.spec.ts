// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { PatronBlockedMessagePipe } from './patron-blocked-message.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const blockedMessage = 'Blocked message note';

class Patron {
  patron: {
    blocked: boolean,
    blocked_note: string;
  }
}

const output = 'This patron is currently blocked. Reason: ' + blockedMessage;

describe('PatronBlockedMessagePipe', () => {
  let pipe: PatronBlockedMessagePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatronBlockedMessagePipe,
        TranslateService
      ],
      imports: [
        TranslateModule.forRoot()
      ]
    });
    pipe = TestBed.inject(PatronBlockedMessagePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should not return the blocking message', () => {
    const patron = new Patron();
    patron.patron = { blocked: false, blocked_note: blockedMessage };
    expect(pipe.transform(patron)).toBeNull();
  });

  it('should return the blocking message', () => {
    const patron = new Patron();
    patron.patron = { blocked: true, blocked_note: blockedMessage };
    expect(pipe.transform(patron)).toEqual(output);
  });
});
