/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
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
import { UrlMatcher, UrlSegment } from "@angular/router";

export function recordTypeMatcher(type: string): UrlMatcher {
  return (url: UrlSegment[]) => {
    if (url.length >= 3 && url[1].path === 'search' && url[2].path === type) {
      return {
        consumed: url,
        posParams: { viewcode: url[0], type: new UrlSegment(type, {}) },
      };
    }
    return null;
  };
}
