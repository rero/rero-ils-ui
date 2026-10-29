// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { DetailButtonComponent, DetailComponent, ErrorComponent } from '@rero/ng-core';
import { AppStore, Entity, OperationLogsDialogComponent } from '@rero/shared';

@Component({
  selector: 'admin-local-page-detail',
  templateUrl: './local-page-detail.component.html',
  imports: [DetailButtonComponent, Bind, Button, OperationLogsDialogComponent, ErrorComponent, TranslatePipe],
})
export class LocalPageDetailComponent extends DetailComponent {
  protected appStore = inject(AppStore);

  /**
   * Launch an expert search on the document view.
   * @param record - the record
   */
  search(record: any): void {
    this.router.navigate(['/records', 'documents'], {
      queryParams: { q: Entity.generateSearchQuery(record.metadata.type, 'local', record.metadata.pid), simple: '0' },
      skipLocationChange: true,
    });
  }
}
