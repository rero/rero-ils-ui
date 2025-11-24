/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Component, computed, inject, input, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RecordService } from '@rero/ng-core';
import { catchError, map, of, switchMap } from 'rxjs';
import { PatronProfileMenuStore } from '../store/patron-profile-menu-store';
import { DocumentMetadata, LoanRecord as LoanRecordType } from '../types';

@Component({
  selector: 'public-search-patron-profile-document',
  templateUrl: './patron-profile-document.component.html',
  standalone: false,
})
export class PatronProfileDocumentComponent {
  private patronProfileMenuStore = inject(PatronProfileMenuStore);
  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES =====================================================
  showAdditionalInformation = input<boolean>(false);
  loan = input.required<LoanRecordType>();

  document: Signal<DocumentMetadata>;

  viewcode: string;

  /** Get the formatted call numbers for the related item */
  callNumbers = computed(() =>
    [this.loan().metadata.item.call_number, this.loan().metadata.item.second_call_number].filter(Boolean).join(' | ')
  );

  constructor() {
    const patron = this.patronProfileMenuStore.currentPatron();
    this.viewcode = patron ? patron.organisation.code : '';

    this.document = toSignal(this.getDocumentSignal(), {
      initialValue: undefined,
    });
  }

  /** Récupère le document lié au prêt, avec gestion d'erreur et validation */
  private getDocumentSignal() {
    return toObservable(this.loan).pipe(
      switchMap((loan) => {
        const pid = loan?.metadata?.document?.pid;
        if (!pid) return of(undefined);
        return this.recordService.getRecord('documents', pid, 1, {
          Accept: 'application/rero+json, application/json',
        });
      }),
      map((hit: { metadata?: DocumentMetadata } | undefined) => hit?.metadata),
      catchError(() => of(undefined))
    );
  }
}
