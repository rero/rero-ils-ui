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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'public-search-document-availability',
  templateUrl: './document-availability.component.html'
})
export class DocumentAvailabilityComponent implements OnInit {

  static readonly AVAILABILITY_LOADING = 0;
  static readonly AVAILABILITY_AVAILABLE = 1;
  static readonly AVAILABILITY_NOT_AVAILABLE = 2;

  /** Document record */
  @Input() document: any;

  /** Document item(s) availability */
  private _availability = DocumentAvailabilityComponent.AVAILABILITY_LOADING;

  /** http client options */
  private _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  /** Get document item(s) availability */
  get available() {
    return this._availability;
  }

  /** Availability status */
  get availabilityStatus() {
    return {
      loading: DocumentAvailabilityComponent.AVAILABILITY_LOADING,
      available: DocumentAvailabilityComponent.AVAILABILITY_AVAILABLE,
      unavailable: DocumentAvailabilityComponent.AVAILABILITY_NOT_AVAILABLE
    };
  }

  /**
   * Constructor
   * @param _activatedRoute - ActivatedRoute
   * @param _documentAvailabilityService - DocumentAvailabilityService
   */
  constructor(
    private _httpClient: HttpClient,
    private _activatedRoute: ActivatedRoute
  ) { }

  /** Init */
  ngOnInit() {
    const routeSnapshot = this._activatedRoute.snapshot;
    const viewcode = routeSnapshot.pathFromRoot[1].url[0].path;
    let organisationFilter = [];
    let libraryFilter = [];
    if (routeSnapshot.queryParams.organisation) {
      if (typeof routeSnapshot.queryParams.organisation === 'string') {
        organisationFilter.push(routeSnapshot.queryParams.organisation);
      } else {
        organisationFilter = routeSnapshot.queryParams.organisation;
      }
    }
    if (routeSnapshot.queryParams.library) {
      if (typeof routeSnapshot.queryParams.library === 'string') {
        libraryFilter.push(routeSnapshot.queryParams.library);
      } else {
        libraryFilter = routeSnapshot.queryParams.library;
      }
    }

    let query = `/api/availabilty/${this.document.metadata.pid}`;
    const params = [];
    if (organisationFilter.length > 0) {
      params.push(`organisation=${organisationFilter.join(',')}`);
    }
    if (libraryFilter.length > 0) {
      params.push(`library=${libraryFilter.join(',')}`);
    }
    if (viewcode) {
      params.push(`viewcode=${viewcode}`);
    }
    if (params.length > 0) {
      query += `?${params.join('&')}`;
    }
    return this._httpClient.get<Availability>(query, this._httpOptions).pipe(
      map(result => result.availability ?
        DocumentAvailabilityComponent.AVAILABILITY_AVAILABLE :
        DocumentAvailabilityComponent.AVAILABILITY_NOT_AVAILABLE
      )
    ).subscribe(result => this._availability = result);
  }
}

/** Availability interface */
interface Availability {
  availability: boolean;
}
