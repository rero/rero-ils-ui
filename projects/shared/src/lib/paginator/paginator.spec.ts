// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
