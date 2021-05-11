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
import { NotificationTypePipe } from './notificationType.pipe';

describe('NotificationPipe', () => {
  it('create an instance', () => {
    const pipe = new NotificationTypePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return true if key is available on patron type', () => {
    const pipe = new NotificationTypePipe();
    expect(pipe.transform('availability', 'patron')).toBeTruthy();
  });

  it('should return true if key is available on library type', () => {
    const pipe = new NotificationTypePipe();
    expect(pipe.transform('booking', 'library')).toBeTruthy();
  });

  it('should return false if key is not available on type', () => {
    const pipe = new NotificationTypePipe();
    expect(pipe.transform('availability', 'library')).toBeFalsy();
  });
});
