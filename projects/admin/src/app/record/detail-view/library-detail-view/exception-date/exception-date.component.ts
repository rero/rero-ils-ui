// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ExceptionDates, Library } from '@app/admin/classes/library';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';

@Component({
    selector: 'admin-exception-date',
    templateUrl: './exception-date.component.html',
    imports: [NgClass, TranslatePipe, DateTranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionDateComponent {
  exception = input.required<ExceptionDates>();

  isOver(exception: ExceptionDates): boolean {
    return Library.isExceptionDateOver(exception);
  }
}
