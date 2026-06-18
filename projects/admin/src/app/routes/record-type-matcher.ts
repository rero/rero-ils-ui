// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
