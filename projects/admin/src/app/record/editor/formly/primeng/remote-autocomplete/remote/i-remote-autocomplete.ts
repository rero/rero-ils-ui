// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { IQueryOptions, ISuggestionItem } from '@rero/ng-core';
import { Observable } from "rxjs";

export type IRemoteAutocomplete = {
  getName(): string;

  getSuggestions(query: string, queryOptions: IQueryOptions, currentPid: string | null): Observable<ISuggestionItem[]>;

  getValueAsHTML(queryOptions: IQueryOptions, item: ISuggestionItem): Observable<string>;
}
