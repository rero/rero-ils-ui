// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { _, TranslateDirective } from '@ngx-translate/core';

@Component({
  selector: 'admin-organisation-detail-view',
  imports: [TranslateDirective],
  templateUrl: './organisation-detail-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationDetailViewComponent {
  readonly record = input.required<any>();
  readonly type = input.required<string>();

  /** Homepage blocks display order, with their translated labels. */
  readonly blockOrder = [
    { key: 'center', label: _('Center block') },
    { key: 'left', label: _('Left block') },
    { key: 'right', label: _('Right block') },
  ] as const;
}
