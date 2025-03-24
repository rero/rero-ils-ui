/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { map } from 'rxjs/operators';

export function _(str: string) {
  return marker(str);
}

@Component({
    selector: 'public-search-error-page',
    template: `
    <p-message [severity]="messages[statusCode].severity" showTransitionOptions="0ms">
      @let msg = messages[statusCode];
      <div class="ui:w-full">
        <h3>{{ msg.summary }}</h3>
        <p>{{ msg.detail }}</p>
        <em translate>For any information please contact system administrator.</em>
      </div>
    </p-message>
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
   *   - severity: the bootstrap alert look-and-feel level to use for the error. 'danger' by default.
   */
  messages = {
    401: {
      summary: _('Unauthorized'),
      detail: _('Access denied due to invalid credentials.'),
      severity: 'warn'
    },
    403: {
      summary: _('Forbidden access'),
      detail: _('You don\'t have permission to access this page.'),
      severity: 'warn'
    },
    404: {
      summary: _('Page not found'),
      detail: _('Woops. Looks like this page doesn\'t exists'),
      severity: 'info'
    },
    418: {
      summary: _('I\'m a teapot'),
      detail: [
        _('The requested entity body is short and stout'),
        _('Tip me over and pour me out')
      ].join(' '),
      severity: 'success'
    },
    500: {
      summary: _('Internal server error'),
      detail: _('Oops, Something went wrong !'),
      severity: 'danger'
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
