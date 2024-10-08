/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { Injectable } from '@angular/core';
import { IRemoteAutocomplete } from './remote/i-remote-autocomplete';
import { IQueryOptions, ISuggestionItem, IRemoteAutocomplete as NgCoreIRemoteAutocomplete } from '@rero/prime/remote-autocomplete/remote-autocomplete.interface';
import { Observable } from 'rxjs';

export class IRemotes {
  [key: string]: IRemoteAutocomplete;
}

@Injectable({
  providedIn: 'root'
})
export class RemoteAutocompleteService implements NgCoreIRemoteAutocomplete {

  private remotes: IRemotes = {};

  addRemote(remote: IRemoteAutocomplete): void {
    if (!(remote.getName() in this.remotes)) {
      this.remotes[remote.getName()] = remote;
    }
  }

  getSuggestions(query: string, queryOptions: IQueryOptions, currentPid: string): Observable<ISuggestionItem[]> {
    if (!(queryOptions.type in this.remotes)) {
      throw new Error(`The ${queryOptions.type} Remote autocomplete not defined`);
    }

    return this.remotes[queryOptions.type].getSuggestions(query, queryOptions, currentPid);
  }

  getValueAsHTML(queryOptions: IQueryOptions, item: ISuggestionItem): Observable<string> {
    if (!(queryOptions.type in this.remotes)) {
      throw new Error(`The ${queryOptions.type} Remote autocomplete not defined`);
    }

    return this.remotes[queryOptions.type].getValueAsHTML(queryOptions, item);
  }
}
