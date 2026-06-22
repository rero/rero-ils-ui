/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
 * Copyright (C) 2019-2023 UCLouvain
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