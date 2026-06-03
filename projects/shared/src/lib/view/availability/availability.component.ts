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
import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { IAvailability } from '../../interface/i-availability';
import { IAvailabilityService } from '../../service/i-availability.service';
import { NgClass } from '@angular/common';
import { DateTranslatePipe } from '@rero/ng-core';
import { GetTranslatedLabelPipe } from '../../pipe/get-translated-label.pipe';
import { combineLatest, filter, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'shared-availability',
  templateUrl: './availability.component.html',
  imports: [NgClass, DateTranslatePipe, TranslatePipe, GetTranslatedLabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilityComponent {

  private readonly translateService = inject(TranslateService);

  /** Record Type */
  readonly recordType = input.required<string>();

  /** Record pid */
  readonly record = input.required<any>();

  /** Resource api service */
  readonly apiService = input.required<IAvailabilityService>();

  /** View code */
  readonly viewcode = input<string | null>(null);

  readonly class = input('ui:justify-top');

  /** Current language as a reactive signal */
  readonly language = toSignal(
    this.translateService.onLangChange.pipe(
      map(e => e.lang),
      startWith(this.translateService.getCurrentLang())
    ),
    { requireSync: true }
  );

  /** Availability data as a reactive signal, re-fetched when inputs change */
  readonly availability = toSignal<IAvailability>(
    combineLatest([
      toObservable(this.apiService),
      toObservable(this.record),
      toObservable(this.viewcode),
    ]).pipe(
      filter(([service, record]) => service != null && record?.metadata?.pid != null),
      switchMap(([service, record, viewcode]) =>
        service!.getAvailability(record.metadata.pid, viewcode ?? undefined)
      )
    )
  );
}
