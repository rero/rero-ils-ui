// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { OpeningHours } from '@app/admin/classes/library';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-day-opening-hours',
    template: `
    <dl class="metadata ui:mx-2">
      <dt>{{ day().day | translate }}</dt>
      <dd>
        <div class="ui:flex ui:gap-x-3 ui:items-center">
        <i class="fa" [ngClass]="{
          'fa-times-circle-o text-error': !day().is_open,
          'fa-circle text-success': day().is_open
        }"></i>
        @if (day().is_open) {
            @for (time of day().times; track $index; let last = $last) {
              <span>{{ time.start_time }} - {{ time.end_time }}</span>
              @if (!last) {
                /
              }
            }
        } @else {
          <span class="text-error" translate>Closed</span>
        }
        </div>
      </dd>
    </dl>
  `,
    imports: [NgClass, TranslateDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayOpeningHoursComponent {
  day = input.required<OpeningHours>();
}
