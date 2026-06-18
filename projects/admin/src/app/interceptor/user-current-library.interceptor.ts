// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppStore } from '@rero/shared';

export function userCurrentLibraryInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
   const appStore = inject(AppStore);

    const libraryPid = appStore.currentLibraryPid();
    if (libraryPid) {
      const request = req.clone({
        setParams: {
          'current_library': libraryPid
        }
      });
      return next(request);
    }
    return next(req);
}
