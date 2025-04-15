/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
