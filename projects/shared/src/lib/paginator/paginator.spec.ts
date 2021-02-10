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
import { Paginator } from './paginator';

describe('Test', () => {
  let paginator: Paginator;

  it('should create an instance', () => {
    expect(new Paginator()).toBeTruthy();
  });

  beforeEach(() => {
    paginator = new Paginator();
  });

  it('should return the default values', () => {
    paginator = new Paginator(2, 14);
    expect(paginator.getPage()).toEqual(2);
    expect(paginator.getRecordsPerPage()).toEqual(14);
  });

  it('should return the current page', () => {
    paginator.setPage(3);
    expect(paginator.getPage()).toEqual(3);
  });

  it('should return the records per page', () => {
    paginator.setRecordsPerPage(20);
    expect(paginator.getRecordsPerPage()).toEqual(20);
  });

  it('should return the records count', () => {
    paginator.setRecordsCount(8);
    expect(paginator.getRecordsCount()).toEqual(8);
  });

  it('should return the hidden info (singular)', () => {
    paginator
      .setRecordsCount(10)
      .setRecordsPerPage(9);
    paginator.setHiddenInfo('singular', 'plurial');
    expect(paginator.getHiddenInfo()).toEqual('singular');
    expect(paginator.getHiddenCount()).toEqual(1);
  });

  it('should return the hidden info (plurial)', () => {
    paginator
      .setRecordsCount(10)
      .setRecordsPerPage(5);
    paginator.setHiddenInfo('singular', 'plurial');
    expect(paginator.getHiddenInfo()).toEqual('plurial');
    expect(paginator.getHiddenCount()).toEqual(5);
  });

  it('should return true for displaying the "show-more" link', () => {
    paginator
      .setRecordsCount(20);
    expect(paginator.isShowMore()).toBeTruthy();
  });

  it('should return false for displaying the "show-more" link', () => {
    paginator
      .setRecordsCount(5);
    expect(paginator.isShowMore()).toBeFalsy();
  });

  it('should return the current page on the event', () => {
    paginator.more$.subscribe((page) => {
      expect(page).toEqual(2);
    });
    paginator.next();
  });

  it('should return the page 4 on the event', () => {
    paginator.more$.subscribe((page) => {
      expect(page).toEqual(4);
    });
    paginator.next(4);
  });

});
