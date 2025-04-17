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
import { AcqNoteType } from "../classes/common";
import { NoteBadgeColorPipe } from "./note-badge-color.pipe";

describe('NoteBadgeColorPipe', () => {
  let pipe: NoteBadgeColorPipe;

  const acqNote = {
    type: AcqNoteType.RECEIPT_NOTE,
    content: 'Acquisition note'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NoteBadgeColorPipe
      ]
    });

    pipe = TestBed.inject(NoteBadgeColorPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the severity color', () => {
    [
      {key: AcqNoteType.RECEIPT_NOTE, badge: 'primary'},
      {key: AcqNoteType.STAFF_NOTE, badge: 'info'},
      {key: AcqNoteType.VENDOR_NOTE, badge: 'warning'}
    ].forEach((element) => {
      acqNote.type = element.key;
      expect(pipe.transform(acqNote)).toEqual(element.badge);
    });
  });
});
