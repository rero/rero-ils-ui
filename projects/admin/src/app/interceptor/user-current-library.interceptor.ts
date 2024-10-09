/*
 * RERO ILS UI
 * Copyright (C) 2023-2024 RERO
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
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserService } from '@rero/shared';
import { Observable } from 'rxjs';

@Injectable()
export class UserCurrentLibraryInterceptor implements HttpInterceptor {

  private userService: UserService = inject(UserService);

  /**
   * Intercept http request
   * Add current library of the logged user.
   * @param request - HttpRequest
   * @param next - HttpHandler
   * @returns Handle of request
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.userService.user && this.userService.user.currentLibrary) {
      request = request.clone({
        setParams: {
          'current_library': String(this.userService.user.currentLibrary)
        }
      });
    }
    return next.handle(request);
  }
}
