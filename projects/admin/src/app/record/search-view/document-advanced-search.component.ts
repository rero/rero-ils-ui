/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RecordSearchStore } from '@rero/ng-core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { DocumentAdvancedSearchFormComponent } from './document-advanced-search-form/document-advanced-search-form.component';

@Component({
  selector: 'admin-document-advanced-search',
  template: `
    @if (!isSimple()) {
      <p-button
        [label]="'Build advanced query' | translate"
        outlined
        icon="fa fa-search"
        iconPos="right"
        (onClick)="openModalBox()"
      />
    }
  `,
  imports: [Bind, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentAdvancedSearchComponent {

  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  private store = inject(RecordSearchStore);

  protected isSimple = computed(() => !this.store.hasFilter('simple', '0'));

  openModalBox(): void {
    const ref = this.dialogService.open(DocumentAdvancedSearchFormComponent, {
      modal: true,
      width: '60vw',
      closable: true,
      position: 'top',
      header: this.translateService.instant('Build advanced query'),
    });
    if (ref) {
      ref.onClose.subscribe((queryString?: string) => {
        if (queryString) {
          this.store.updateQuery(queryString);
        }
      });
    }
  }
}
