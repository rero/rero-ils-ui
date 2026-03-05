/*
 * RERO ILS UI
 * Copyright (C) 2021-2026 RERO
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
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RecordService } from '@rero/ng-core';
import { EsRecord } from '@rero/shared';
import { catchError, map, of, switchMap } from 'rxjs';
import { PatronProfileMenuService } from '../patron-profile-menu.service';

@Component({
    selector: 'public-search-patron-profile-document',
    templateUrl: './patron-profile-document.component.html',
    standalone: false
})
export class PatronProfileDocumentComponent {

  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);
  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES =====================================================
  record = input.required<EsRecord>();
  showAdditionalInformation = input(false);
  isAnimated = input(true);

  /** Related document */
  document = toSignal(
    toObservable(this.record).pipe(
      switchMap(record => this.recordService
        .getRecord('documents', record.metadata.document.pid, 1, { Accept: 'application/rero+json, application/json' })
        .pipe(
          catchError(() => of({ metadata: {} })),
          map(doc => doc.metadata)
        )
      )
    )
  );

  // GETTER & SETTER ==========================================================
  /** Get current viewcode */
  get viewcode(): string {
    return this.patronProfileMenuService.currentPatron.organisation.code;
  }

  /** Get the formatted call numbers for the related item */
  callNumbers = computed(() => [
    this.record().metadata.item.call_number,
    this.record().metadata.item.second_call_number
  ].filter(Boolean).join(' | '));
}
