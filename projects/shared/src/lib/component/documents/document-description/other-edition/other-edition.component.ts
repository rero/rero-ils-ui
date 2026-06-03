/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DescriptionZoneComponent } from '../description-zone/description-zone.component';
import { AsyncPipe } from '@angular/common';
import { GetRecordPipe } from '@rero/ng-core';
import { MainTitleRelationPipe } from '../../../../pipe/main-title-relation.pipe';

@Component({
    selector: 'shared-other-edition',
    templateUrl: './other-edition.component.html',
    imports: [RouterLink, DescriptionZoneComponent, AsyncPipe, GetRecordPipe, MainTitleRelationPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherEditionComponent {

  /** Field label */
  readonly fieldLabel = input<string>(undefined);

  /** Field data */
  readonly field = input<any>(undefined);

  /** Inline display mode */
  readonly inline = input(false);

  /** View code for public URL */
  readonly viewcode = input<string>(null);

  /** Is public view */
  readonly isPublicView = input(false);
}
