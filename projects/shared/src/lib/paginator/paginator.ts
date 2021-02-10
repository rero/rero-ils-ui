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
import { Subject } from 'rxjs';

export class Paginator {

  /** Event on more */
  private _more = new Subject<number>();

  /** Records count */
  private _recordsCount = 0;

  /** Hidden info (after show more link) */
  private _hiddenInfo: { singular: string, plurial: string } = undefined;

  /** Hidden records count */
  private _hiddenCount = 0;

  /** More event */
  get more$() {
    return this._more.asObservable();
  }

  /**
   * Constructor
   * @param _page - number (default: 1)
   * @param _recordsPerPage - number (default: 10)
   */
  constructor(private _page: number = 1, private _recordsPerPage: number = 10) {}

  /**
   * Set Page
   * @param page - number
   * @return Paginator
   */
  setPage(page: number): Paginator {
    this._page = page;
    return this;
  }

  /**
   * Get Page
   * @return number
   */
  getPage(): number {
    return this._page;
  }

  /**
   * Set records per page
   * @param recordsPerPage - number
   * @return Paginator
   */
  setRecordsPerPage(recordsPerPage: number): Paginator {
    this._recordsPerPage = recordsPerPage;
    return this;
  }

  /**
   * Get records per page
   * @return number
   */
  getRecordsPerPage(): number {
    return this._recordsPerPage;
  }

  /**
   * Set records count
   * @param recordsCount - number
   * @return Paginator
   */
  setRecordsCount(recordsCount: number): Paginator {
    this._recordsCount = recordsCount;
    return this;
  }

  /**
   * Get records count
   * @return number
   */
  getRecordsCount(): number {
    return this._recordsCount;
  }

  /**
   * set hidden info
   * @param singular - string
   * @param plurial - string
   * @return Paginator
   */
  setHiddenInfo(singular: string, plurial: string): Paginator {
    this._hiddenInfo = { singular, plurial };
    return this;
  }

  /**
   * Get hidden info
   * @return string
   */
  getHiddenInfo(): string {
    if (this._hiddenInfo) {
      this._hiddenCount = this._recordsCount - (this._page * this._recordsPerPage);
      if (this._hiddenCount < 0) { this._hiddenCount = 0; }
      return (this._hiddenCount > 1)
        ? this._hiddenInfo.plurial
        : this._hiddenInfo.singular;
    }
  }

  /**
   * get hidden count
   * @return number
   */
  getHiddenCount(): number {
    return this._hiddenCount;
  }

  /**
   * Is show more
   * @return boolean
   */
  isShowMore(): boolean {
    return this._recordsCount > 0
      && ((this._page * this._recordsPerPage) < this._recordsCount);
  }

  /**
   * Next page
   * @param page - number
   */
  next(page?: number) {
    this._page = (!page) ? this._page + 1 : page;
    this._more.next(this._page);
  }
}
