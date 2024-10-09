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
