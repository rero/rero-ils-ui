// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DateTranslatePipe, Nl2brPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-collection-brief',
    template: `
    <div class="ui:flex ui:flex-col ui:gap-1">
      <h5>
        <i class="fa fa-circle ui:mr-1" [ngClass]="{'text-success': record().metadata.published, 'text-error': !record().metadata.published}" aria-hidden="true"></i>
        <a id="collection-link" [routerLink]="[detailUrl().link]">{{ record().metadata.title }}</a>
        @if (record().metadata.collection_id) {
          ({{ record().metadata.collection_id }})
        }
      </h5>
        @if (record().metadata.teachers) {
          <div id="collection-teacher">
            @for (teacher of record().metadata.teachers; track $index; let last = $last) {
              {{ teacher.name }} {{ last ? '' : ', ' }}
            }
          </div>
        }
        @if (record().metadata.description) {
          <div
            id="collection-start-end-date"
            [innerHtml]="record().metadata.description | nl2br"
          ></div>
        }
        <div>
        {{ record().metadata.start_date | dateTranslate: 'mediumDate' }}
        - {{ record().metadata.end_date | dateTranslate: 'mediumDate' }}
        </div>
    </div>
  `,
    imports: [NgClass, RouterLink, DateTranslatePipe, Nl2brPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionBriefViewComponent {

  record = input<any>();

  type = input<string>();

  detailUrl = input<{ link: string, external: boolean }>();
}
