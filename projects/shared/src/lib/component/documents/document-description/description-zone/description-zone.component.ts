// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
    selector: 'shared-description-zone',
    templateUrl: './description-zone.component.html',
    imports: [TranslateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionZoneComponent { }
