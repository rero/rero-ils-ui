// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { TruncateTextPipe, GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-templates-brief-view',
    template: `
  <h5>
    <div class="ui:flex ui:gap-3 ui:items-center">
      <a [routerLink]="[detailUrl().link]">{{ record().metadata.name }}</a>
      @if (record().metadata.visibility === 'private') {
        <i [title]="'private'|translate" class="fa fa-lock ui:text-muted-color" aria-hidden="true"></i>
      }
    </div>
  </h5>
    <ul class="ui:list-none">
      @if (record().metadata.description) {
        <li>
          {{ record().metadata.description | truncateText: 8 }}
        </li>
      }
      @if ($any(record().metadata.creator.pid | getRecord: 'patrons' | async); as creator) {
        <li>
          {{ creator.metadata.first_name }} {{ creator.metadata.last_name }}
        </li>
      }
      @if (record().metadata.template_type) {
        <li translate>
          {{ record().metadata.template_type }}
        </li>
      }
    </ul>
  `,
    imports: [RouterLink, TranslateDirective, AsyncPipe, TruncateTextPipe, TranslatePipe, GetRecordPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesBriefViewComponent {

  /** Record data */
  record = input<any>();

  /** Resource type */
  type = input<string>();

  /** Detail URL to navigate to detail view */
  detailUrl = input<{ link: string, external: boolean }>();
}
