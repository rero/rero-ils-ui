/*
 * RERO ILS UI
 * Copyright (C) 2020-2024-2025 RERO
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

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { _ } from "@ngx-translate/core";
import { map } from 'rxjs/operators';

@Component({
    selector: 'admin-error-page',
    template: `
    <section class="bg-white dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
              <span class="mb-4 text-7xl tracking-tight font-extrabold lg:text-8xl text-primary-600 dark:text-primary-500">
              {{ statusCode }}
              </span>
              <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                {{ messages[statusCode].title }}
              </p>
              <div class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                <ul class="list-none">
                  @for (text of messages[statusCode].description || []; track text) {
                    <li>{{ text }}</li>
                  }
                </ul>
              </div>
              <div class="mt-4">
                <p-button outlined [label]="'Back to dashboard'|translate" [routerLink]="['/']" />
              </div>
          </div>
      </div>
    </section>
  `,
    standalone: false
})

export class ErrorPageComponent implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute);

  /** the status code to display. By default 404 : Page not found */
  statusCode = 404;
  /** All messages alt to be managed by this component. Available for each error are :
   *   - title : the error title
   *   - description : A human readable description of this error as Array<string>. Each array
   *                   element will be a separate line.
   *   - level: the bootstrap alert look-and-feel level to use for the error. 'danger' by default.
   */
  messages = {
    400: {
      title: _('Bad Request'),
      description: [_('Malformed request syntax.')],
      level: 'warning'
    },
    401: {
      title: _('Unauthorized'),
      description: [_('Access denied due to invalid credentials.')],
      level: 'warning'
    },
    403: {
      title: _('Forbidden access'),
      description: [_('You don\'t have permission to access this page.')],
      level: 'warning'
    },
    404: {
      title: _('Page not found'),
      description: [_('Woops. Looks like this page doesn\'t exists')]
    },
    418: {
      title: _('I\'m a teapot'),
      description: [
        _('The requested entity body is short and stout'),
        _('Tip me over and pour me out')
      ],
      level: 'success'
    },
    500: {
      title: _('Internal server error'),
      description: [_('Oops, Something went wrong !')]
    }
  };

  ngOnInit() {
    this.route.params.pipe(
      map(params => params.status_code || 404),  // check for status_code parameter from ActivatedRoute
      map(code => /^\d+$/.test(code) ? parseInt(code, 10) : 404),  // try to parse status code to integer
      map(code => code in this.messages ? code : 404)  // check if http code definition exists
    ).subscribe(code => this.statusCode = code );
  }
}
