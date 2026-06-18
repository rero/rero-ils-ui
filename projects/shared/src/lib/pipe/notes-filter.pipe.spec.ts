// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { NotesFilterPipe } from './notes-filter.pipe';

describe('NotesFilterPipe', () => {
  let pipe: NotesFilterPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotesFilterPipe
      ]
    });

    pipe = TestBed.inject(NotesFilterPipe);
  });

  const notes = [
    { type: 'general_note', content: 'note general' },
    { type: 'other_note', content: 'note general' }
  ];

  const resultNotes = [
    { type: 'general_note', content: 'note general' }
  ];

  const authorizedType = [
    'general_note'
  ];

  beforeEach(() => {
    pipe = new NotesFilterPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter the notes', () => {
    expect(pipe.transform(notes, authorizedType)).toEqual(resultNotes);
  });
});
