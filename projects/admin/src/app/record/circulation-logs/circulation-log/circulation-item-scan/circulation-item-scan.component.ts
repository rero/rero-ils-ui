// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { CirculationLogComponent } from '../circulation-log.component';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-circulation-item-scan',
    templateUrl: './circulation-item-scan.component.html',
    imports: [CirculationLogComponent, Bind, Tag, TranslateDirective, AsyncPipe, TranslatePipe, GetRecordPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirculationItemScanComponent {

  /** Operation log record */
  record = input<any>();
  /** Is the log should be highlighted */
  isHighlight = input(false);
  /** Is the transaction must be separated from sibling elements */
  separator = input(false);
}
