/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { UrlMatcher, UrlSegment } from '@angular/router';

/**
 * Returns an Angular UrlMatcher that matches /records/<type> and exposes
 * `type` as a positional param so child routes (RecordSearchPageComponent)
 * can read it via paramMap.
 */
export function recordTypeMatcher(type: string): UrlMatcher {
  return (url: UrlSegment[]) => {
if (url.length >= 2 && url[0].path === 'records' && url[1].path === type) {
      return {
        consumed: [url[0], url[1]],
        posParams: { type: new UrlSegment(type, {}) },
      };
    }
    return null;
  };
}
