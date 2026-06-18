// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, ChangeDetectionStrategy} from '@angular/core';
import { AppStore, OperationLogsDialogComponent } from '@rero/shared';
import { DetailComponent, DetailButtonComponent, ErrorComponent } from '@rero/ng-core';
import { Entity } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-local-page-detail',
    templateUrl: './local-page-detail.component.html',
    imports: [DetailButtonComponent, Bind, Button, OperationLogsDialogComponent, ErrorComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalPageDetailComponent extends DetailComponent {

  protected appStore = inject(AppStore);

  /**
   * Launch an expert search on the document view.
   * @param record - the record
   */
  search(record: any): void
  {
    this.router.navigate(
      ['/records', 'documents'],
      {
        queryParams: { q: Entity.generateSearchQuery(record.metadata.type, 'local', record.metadata.pid), simple: '0' },
        skipLocationChange: true
      },
    );
  }
}
