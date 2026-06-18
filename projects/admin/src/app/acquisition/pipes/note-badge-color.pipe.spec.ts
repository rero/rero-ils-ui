// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
