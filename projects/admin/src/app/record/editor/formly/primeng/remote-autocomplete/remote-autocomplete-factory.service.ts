// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { IRemoteAutocomplete } from './remote/i-remote-autocomplete';
import { RemoteAutocompleteService } from './remote-autocomplete.service';

export const remoteAutocompleteToken = new InjectionToken<IRemoteAutocomplete[]>('IRemoteAutocomplete');

@Injectable({
  providedIn: 'root'
})
export class RemoteAutocompleteFactoryService {

  private injector: Injector = inject(Injector);
  private remoteAutocompleteService = inject(RemoteAutocompleteService);

  init(): void {
    const remotes = this.injector.get(remoteAutocompleteToken);
    remotes.map((remote: IRemoteAutocomplete) => this.remoteAutocompleteService.addRemote(remote));
  }
}
