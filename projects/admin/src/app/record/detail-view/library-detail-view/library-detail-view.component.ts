/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { UpperCaseFirstPipe } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Badge } from 'primeng/badge';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Fieldset } from 'primeng/fieldset';
import { Ripple } from 'primeng/ripple';
import { Tag } from 'primeng/tag';
import { Library } from '../../../classes/library';
import { CountryCodeTranslatePipe } from '../../../pipe/country-code-translate.pipe';
import { LibraryStore } from '../../custom-editor/libraries/library.store';
import { DayOpeningHoursComponent } from './day-opening-hours/day-opening-hours.component';
import { ExceptionDateComponent } from './exception-date/exception-date.component';
import { LocationComponent } from './location/location.component';

@Component({
    selector: 'admin-library-detail-view',
    templateUrl: './library-detail-view.component.html',
    providers: [LibraryStore],
    imports: [TranslateDirective, Bind, Accordion, AccordionPanel, Ripple, AccordionHeader, Button, RouterLink, AccordionContent, LocationComponent, NgClass, DayOpeningHoursComponent, ExceptionDateComponent, Divider, NgTemplateOutlet, Fieldset, Tag, UpperCaseFirstPipe, TranslatePipe, CountryCodeTranslatePipe, Badge],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryDetailViewComponent {

  private appStore = inject(AppStore);
  protected readonly libraryStore = inject(LibraryStore);

  readonly record = input<any>();
  readonly type = input<string>('');

  readonly library = computed(() => {
    const r = this.record();
    return r ? new Library(r.metadata) : null;
  });

  readonly isUserCanAddLocation = computed(() =>
    this.appStore.currentLibraryPid() === this.record()?.metadata?.pid
  );

  readonly locations = this.libraryStore.locations;

  constructor() {
    // Load locations whenever the record pid changes.
    effect(() => {
      const pid = this.record()?.metadata?.pid;
      if (pid) {
        this.libraryStore.loadLocations(pid);
      }
    });
  }

  deleteLocation(deletedLocationPid: string): void {
    this.libraryStore.deleteLocation(deletedLocationPid);
  }
}
