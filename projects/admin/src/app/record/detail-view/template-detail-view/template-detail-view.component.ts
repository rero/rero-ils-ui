/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetRecordPipe, Nl2brPipe } from '@rero/ng-core';
import { TranslateDirective } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'admin-template-detail-view',
    templateUrl: './template-detail-view.component.html',
    imports: [TranslateDirective, AsyncPipe, GetRecordPipe, Nl2brPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDetailViewComponent {

  private route: ActivatedRoute = inject(ActivatedRoute);

  readonly record = input<any>();
  readonly type = input<string>('');
}
