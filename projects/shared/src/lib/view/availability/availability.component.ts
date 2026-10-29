// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';
import { combineLatest, filter, map, startWith, switchMap } from 'rxjs';

import { IAvailability } from '../../interface/i-availability';
import { GetTranslatedLabelPipe } from '../../pipe/get-translated-label.pipe';
import { IAvailabilityService } from '../../service/i-availability.service';

@Component({
  selector: 'shared-availability',
  templateUrl: './availability.component.html',
  imports: [NgClass, DateTranslatePipe, TranslatePipe, GetTranslatedLabelPipe],
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
      map((e) => e.lang),
      startWith(this.translateService.getCurrentLang()),
    ),
    { requireSync: true },
  );

  /** Availability data as a reactive signal, re-fetched when inputs change */
  readonly availability = toSignal<IAvailability>(
    combineLatest([toObservable(this.apiService), toObservable(this.record), toObservable(this.viewcode)]).pipe(
      filter(([service, record]) => service != null && record?.metadata?.pid != null),
      switchMap(([service, record, viewcode]) => service!.getAvailability(record.metadata.pid, viewcode ?? undefined)),
    ),
  );
}
