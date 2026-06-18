// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, effect, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SerialHoldingDetailViewComponent } from './serial-holding-detail-view/serial-holding-detail-view.component';

@Component({
    selector: 'admin-holding-detail-view',
    templateUrl: './holding-detail-view.component.html',
    imports: [SerialHoldingDetailViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingDetailViewComponent {

  private router: Router = inject(Router);

  readonly record = input<any>();
  readonly type = input<string>('');

  constructor() {
    effect(() => {
      const r = this.record();
      // TODO: At this time, only 'serial' holding should be displayed. Then redirect user to the document detail view
      if (r && r.metadata.holdings_type !== 'serial') {
        this.router.navigate(['/errors/403'], { skipLocationChange: true });
      }
    });
  }
}
