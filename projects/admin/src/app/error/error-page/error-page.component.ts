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
    <section class="ui:bg-white ui:dark:bg-gray-900">
      <div class="ui:py-8 ui:px-4 ui:mx-auto ui:max-w-screen-xl ui:lg:py-16 ui:lg:px-6">
          <div class="ui:mx-auto ui:max-w-screen-sm ui:text-center">
              <span class="ui:mb-4 ui:text-7xl ui:tracking-tight ui:font-extrabold ui:lg:text-8xl ui:text-primary-600 ui:dark:text-primary-500">
              {{ statusCode }}
              </span>
              <p class="ui:mb-4 ui:text-3xl ui:tracking-tight ui:font-bold ui:text-gray-900 ui:md:text-4xl ui:dark:text-white">
                {{ messages[statusCode].title }}
              </p>
              <div class="ui:mb-4 ui:text-lg ui:font-light ui:text-gray-500 ui:dark:text-gray-400">
                <ul class="ui:list-none">
                  @for (text of messages[statusCode].description || []; track text) {
                    <li>{{ text }}</li>
                  }
                </ul>
              </div>
              <div class="ui:mt-4">
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
