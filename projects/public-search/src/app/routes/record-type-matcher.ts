// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
