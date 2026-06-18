// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
