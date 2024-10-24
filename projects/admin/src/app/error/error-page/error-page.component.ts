/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-error-page',
  template: `
    <div class="alert alert-{{ messages[statusCode].level || 'danger' }}">
      <h1 class="alert-heading mb-4">{{ statusCode }} - {{ messages[statusCode].title }}</h1>
      @for (text of messages[statusCode].description || []; track text) {
        <pre>{{ text }}</pre>
      }
      <hr>
      <p>For any information please contact system administrator</p>
    </div>
  `
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
