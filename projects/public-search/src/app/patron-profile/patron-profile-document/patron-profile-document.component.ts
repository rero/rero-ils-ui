// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { TagModule } from '@openng/optimus-ui/tag';
import { ContributionComponent, EsRecord, MainTitlePipe } from '@rero/shared';
import { catchError, map, of, switchMap } from 'rxjs';

import { DocumentApiService } from '../../api/document-api.service';
import { PatronProfileStore } from '../store/patron-profile.store';

@Component({
  selector: 'public-search-patron-profile-document',
  templateUrl: './patron-profile-document.component.html',
  imports: [TranslatePipe, ContributionComponent, MainTitlePipe, TagModule],
})
export class PatronProfileDocumentComponent {
  private store = inject(PatronProfileStore);
  private documentApiService = inject(DocumentApiService);

  // COMPONENT ATTRIBUTES =====================================================
  record = input.required<EsRecord>();
  showAdditionalInformation = input(false);
  isAnimated = input(true);

  /** Related document */
  document = toSignal(
    toObservable(this.record).pipe(
      switchMap((record) =>
        this.documentApiService.getDocument(record.metadata.document.pid).pipe(
          catchError(() => of({ metadata: {} })),
          map((doc) => doc.metadata),
        ),
      ),
    ),
  );

  // GETTER & SETTER ==========================================================
  /** Get current viewcode */
  get viewcode(): string {
    return this.store.currentPatron()?.organisation.code ?? '';
  }

  /** Get the formatted call numbers for the related item */
  callNumbers = computed(() =>
    [this.record().metadata.item.call_number, this.record().metadata.item.second_call_number]
      .filter(Boolean)
      .join(' | '),
  );
}
