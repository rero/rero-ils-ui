/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, computed, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RecordService, UpperCaseFirstPipe } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { map, of, switchMap } from 'rxjs';
import { Library } from '../../../classes/library';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { LocationComponent } from './location/location.component';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { DayOpeningHoursComponent } from './day-opening-hours/day-opening-hours.component';
import { ExceptionDateComponent } from './exception-date/exception-date.component';
import { Divider } from 'primeng/divider';
import { Fieldset } from 'primeng/fieldset';
import { Tag } from 'primeng/tag';
import { CountryCodeTranslatePipe } from '../../../pipe/country-code-translate.pipe';
import { Badge } from 'primeng/badge';

@Component({
    selector: 'admin-library-detail-view',
    templateUrl: './library-detail-view.component.html',
    imports: [TranslateDirective, Bind, Accordion, AccordionPanel, Ripple, AccordionHeader, Button, RouterLink, AccordionContent, LocationComponent, NgClass, DayOpeningHoursComponent, ExceptionDateComponent, Divider, NgTemplateOutlet, Fieldset, Tag, UpperCaseFirstPipe, TranslatePipe, CountryCodeTranslatePipe, Badge],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryDetailViewComponent {

  private recordService: RecordService = inject(RecordService);
  private appStore = inject(AppStore);

  readonly record = input<any>();
  readonly type = input<string>('');

  readonly library = computed(() => {
    const r = this.record();
    return r ? new Library(r.metadata) : null;
  });

  readonly isUserCanAddLocation = computed(() =>
    this.appStore.currentLibraryPid() === this.record()?.metadata?.pid
  );

  private readonly _fetchedLocations = toSignal(
    toObservable(this.record).pipe(
      switchMap(r => {
        const pid = r?.metadata?.pid;
        if (!pid) return of([]);
        return this.recordService.getRecords('locations', {
          query: `library.pid:${pid}`, page: 1,
          itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE, sort: 'name'
        }).pipe(map((res: any) => res.hits.hits || []));
      })
    ),
    { initialValue: [] }
  );

  readonly locations = signal<any[]>([]);

  constructor() {
    effect(() => this.locations.set(this._fetchedLocations()));
  }

  deleteLocation(deletedLocationPid: string): void {
    this.locations.update(list => list.filter((location: any) => deletedLocationPid !== location.metadata.pid));
  }
}
