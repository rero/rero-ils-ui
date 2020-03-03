import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

export function _(str) {
  return marker(str);
}

@Component({
  selector: 'admin-error-page',
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

  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.pipe(
      map(params => params.status_code || 404),  // check for status_code parameter from ActivatedRoute
      map(code => /^\d+$/.test(code) ? parseInt(code, 10) : 404),  // try to parse status code to integer
      map(code => code in this.messages ? code : 404)  // check if http code definition exists
    ).subscribe(code => this.statusCode = code );
  }
}
