/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { NotesFilterPipe } from './notes-filter.pipe';

describe('NotesFilterPipe', () => {

  let pipe: NotesFilterPipe;

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
