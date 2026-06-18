// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Injectable } from '@angular/core';
import { IRemoteAutocomplete } from './remote/i-remote-autocomplete';
import { IQueryOptions, ISuggestionItem, IRemoteAutocomplete as NgCoreIRemoteAutocomplete } from '@rero/ng-core';
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
