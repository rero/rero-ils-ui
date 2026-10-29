// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, computed, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { DialogService } from '@openng/optimus-ui/dynamicdialog';
import { RecordSearchStore } from '@rero/ng-core';

import { DocumentAdvancedSearchFormComponent } from './document-advanced-search-form/document-advanced-search-form.component';

@Component({
  selector: 'admin-document-advanced-search',
  template: `
    @if (!isSimple()) {
      <p-button
        [label]="'Build advanced query' | translate"
        outlined
        icon="fa-solid fa-magnifying-glass"
        iconPos="right"
        (onClick)="openModalBox()" />
    }
  `,
  imports: [Bind, Button, TranslatePipe],
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
