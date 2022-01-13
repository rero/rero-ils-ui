/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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

/**
 * Format a `Date` object using the YYYY-MM-DD (timezone agnostic).
 * @param date: the date to parse.
 * @returns: the formatted date as a string.
 */
function _formatDate(date: Date): string {
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });
  return year + '-' + month + '-' + day;
}

/** Get boundary dates of the previous month.
 *     The dates will be formatted using the YYYY-MM-DD format.
 *  @returns: an object containing boundary date limits as strings.
 */
export function lastMonthDates(): {from: string, to: string} {
  const currentDate = new Date()
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth()-1, 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  return {
    from: _formatDate(startDate),
    to: _formatDate(endDate)
  }
}

/** Get boundary dates of the previous month.
 *     The dates will be formatted using the YYYY-MM-DD format.
 *  @returns: an object containing boundary date limits as strings.
 */
export function lastYearDates(): {from: string, to: string} {
  const currentDate = new Date()
  const lastYear = currentDate.getFullYear() -1;
  const startDate = new Date(lastYear , 0, 1);  // January is 0
  const endDate = new Date(lastYear, 11, 31);  // December is 11
  return {
    from: _formatDate(startDate),
    to: _formatDate(endDate)
  }
}


/** Get boundary dates of the previous month.
 *     The dates will be formatted using the YYYY-MM-DD format.
 *  @returns: an object containing boundary date limits as strings.
 */
export function currentYearDates(): {from: string, to: string} {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear();
  const startDate = new Date(currentYear , 0, 1);  // January is 0
  const endDate = new Date(currentYear, 11, 31);  // December is 11
  return {
    from: _formatDate(startDate),
    to: _formatDate(endDate)
  }
}
