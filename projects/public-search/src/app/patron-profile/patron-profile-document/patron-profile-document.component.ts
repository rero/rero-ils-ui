// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, computed, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslateDirective } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { ContributionComponent, EsRecord, MainTitlePipe } from '@rero/shared';
import { TagModule } from 'primeng/tag';
import { catchError, map, of, switchMap } from 'rxjs';
import { PatronProfileStore } from '../store/patron-profile.store';

@Component({
    selector: 'public-search-patron-profile-document',
    templateUrl: './patron-profile-document.component.html',
    imports: [TranslateDirective, ContributionComponent, MainTitlePipe, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileDocumentComponent {

  private store = inject(PatronProfileStore);
  private recordService = inject(RecordService);

  // COMPONENT ATTRIBUTES =====================================================
  record = input.required<EsRecord>();
  showAdditionalInformation = input(false);
  isAnimated = input(true);

  /** Related document */
  document = toSignal(
    toObservable(this.record).pipe(
      switchMap(record => this.recordService
        .getRecord('documents', record.metadata.document.pid, { resolve: 1, headers: { Accept: 'application/rero+json, application/json' } })
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
    return this.store.currentPatron()?.organisation.code ?? '';
  }

  /** Get the formatted call numbers for the related item */
  callNumbers = computed(() => [
    this.record().metadata.item.call_number,
    this.record().metadata.item.second_call_number
  ].filter(Boolean).join(' | '));
}
