// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Subject } from 'rxjs';

export class Paginator {

  /** Event on more */
  private more = new Subject<number>();

  /** Records count */
  private recordsCount = 0;

  /** Hidden info (after show more link) */
  private hiddenInfo: { singular: string, plurial: string } = undefined;

  /** Hidden records count */
  private hiddenCount = 0;

  /** More event */
  get more$() {
    return this.more.asObservable();
  }

  /**
   * Constructor
   * @param page - number (default: 1)
   * @param recordsPerPage - number (default: 10)
   */
  constructor(private page = 1, private recordsPerPage = 10) {}

  /**
   * Set Page
   * @param page - number
   * @return Paginator
   */
  setPage(page: number): Paginator {
    this.page = page;
    return this;
  }

  /**
   * Get Page
   * @return number
   */
  getPage(): number {
    return this.page;
  }

  /**
   * Set records per page
   * @param recordsPerPage - number
   * @return Paginator
   */
  setRecordsPerPage(recordsPerPage: number): Paginator {
    this.recordsPerPage = recordsPerPage;
    return this;
  }

  /**
   * Get records per page
   * @return number
   */
  getRecordsPerPage(): number {
    return this.recordsPerPage;
  }

  /**
   * Set records count
   * @param recordsCount - number
   * @return Paginator
   */
  setRecordsCount(recordsCount: number): Paginator {
    this.recordsCount = recordsCount;
    return this;
  }

  /**
   * Get records count
   * @return number
   */
  getRecordsCount(): number {
    return this.recordsCount;
  }

  /**
   * set hidden info
   * @param singular - string
   * @param plurial - string
   * @return Paginator
   */
  setHiddenInfo(singular: string, plurial: string): Paginator {
    this.hiddenInfo = { singular, plurial };
    return this;
  }

  /**
   * Get hidden info
   * @return string
   */
  getHiddenInfo(): string {
    if (this.hiddenInfo) {
      this.hiddenCount = this.recordsCount - (this.page * this.recordsPerPage);
      this.hiddenCount = Math.max(this.hiddenCount, 0)
      return (this.hiddenCount > 1)
        ? this.hiddenInfo.plurial
        : this.hiddenInfo.singular;
    }
  }

  /**
   * get hidden count
   * @return number
   */
  getHiddenCount(): number {
    return this.hiddenCount;
  }

  /**
   * Is show more
   * @return boolean
   */
  isShowMore(): boolean {
    return this.recordsCount > 0
      && ((this.page * this.recordsPerPage) < this.recordsCount);
  }

  /**
   * Next page
   * @param page - number
   */
  next(page?: number) {
    this.page = (!page) ? this.page + 1 : page;
    this.more.next(this.page);
  }
}
