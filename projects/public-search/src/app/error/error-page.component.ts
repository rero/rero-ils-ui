/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { map } from 'rxjs/operators';

export function _(str: string) {
  return marker(str);
}

@Component({
  selector: 'public-search-error-page',
  template: `
    <div class="alert alert-{{ messages[statusCode].level || 'danger' }}">
      <h1 class="alert-heading mb-4">{{ statusCode }} - {{ messages[statusCode].title }}</h1>
      <pre *ngFor="let text of messages[statusCode].description || []">{{ text }}</pre>
      <hr>
      <p>For any information please contact system administrator</p>
    </div>
  `
})

export class ErrorPageComponent implements OnInit {

  /** the status code to display. By default 404 : Page not found */
  statusCode = 404;
  /** All messages ablt to be managed by this component. Availables for each error are :
   *   - title : the error title
   *   - description : A human readable description of this error as Array<string>. Each array
   *                   element will be a separate line.
   *   - level: the boostrap alert look-and-feel level to use for the error. 'danger' by default.
   */
  messages = {
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
      desctiption: [_('Oops, Something went wrong !')]
    }
  };

  /**
   * Constructor
   * @param _route - ActivatedRoute
   */
  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.pipe(
      map(params => params.status_code || 404),  // check for status_code parameter from ActivatedRoute
      map(code => /^\d+$/.test(code) ? parseInt(code, 10) : 404),  // try to parse status code to integer
      map(code => code in this.messages ? code : 404)  // check if http code definition exists
    ).subscribe(code => this.statusCode = code );
  }
}
