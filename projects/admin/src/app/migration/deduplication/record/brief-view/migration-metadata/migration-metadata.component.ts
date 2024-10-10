/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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

import { Component, computed, inject, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MainTitlePipe } from '@rero/shared';

@Component({
  selector: 'admin-migration-metadata',
  templateUrl: './migration-metadata.component.html',
  styleUrl: './migration-metadata.component.scss',
})
export class MigrationMetadataBriefComponent {
  // services
  protected translateService: TranslateService = inject(TranslateService);
  // pipes
  protected mainTitlePipe: MainTitlePipe = inject(MainTitlePipe);

  // current record
  record = input<any>();

  // current candidate
  candidate = input<any>();

  // data to load in the table
  data = computed(() => this.getData());

  /**
   * Get the date for the primeng table.
   * @returns the list of object for each column and row.
   */
  getData(): any[] {
    // record data
    const data = this.record()?.metadata?.conversion?.json;

    // candidates data
    const c_data = this?.candidate()?.json;

    // detailed scores
    const scores = this?.candidate()?.detailed_score;
    return [
      {
        field: this.record().id ?? '',
        link: {
          router: ['/migrations', 'records', 'format', 'migration_data', 'detail', this.record().id],
          params: { migration: this.record().metadata.migration_id },
        },
        c_field: c_data?.pid ?? '',
        c_link: {
          router: c_data?.pid ? ['/records', 'documents', 'detail', c_data?.pid] : null,
        },
        label: 'pid',
      },
      {
        field: data?.type ? data.type.map((v) => this.translateService.instant(v.main_type)).join('; ') : '',
        c_field: c_data?.type ? c_data.type.map((v) => this.translateService.instant(v.main_type)).join('; ') : '',
        label: 'type',
        score: scores?.main_type ?? '',
      },
      {
        field: data?.title ? this.mainTitlePipe.transform(data.title) : '',
        c_field: c_data?.title ? this.mainTitlePipe.transform(c_data.title) : '',
        label: 'title',
      },
      {
        field: data?.sort_title ?? '',
        c_field: c_data?.sort_title ?? '',
        label: 'scoring title',
        score: scores?.title ?? '',
      },
      {
        field: data?.sort_date_old ?? '',
        c_field: c_data?.sort_date_old ?? '',
        label: 'publication date',
        score: scores?.publication_date ?? '',
      },
      {
        field: data?.provisionActivity ? data.provisionActivity[0]._text[0].value : '',
        c_field: c_data?.provisionActivity ? c_data.provisionActivity[0]._text[0].value : '',
        label: 'provision activity',
        score: scores?.provision_activity ?? '',
      },
      {
        field: data?.responsibilityStatement
          ? data.responsibilityStatement.map((resp) => resp.map((data) => data.value)).join('<br/>')
          : '',
        c_field: c_data?.responsibilityStatement
          ? c_data.responsibilityStatement.map((resp) => resp.map((data) => data.value)).join('<br/>')
          : '',
        label: 'responsibility statement',
        score: scores?.reponsibility_statement ?? '',
      },
      {
        field: data?.identifiedBy
          ? data.identifiedBy
              .map((id) => `${id.type}: ${id.value}`)
              .sort()
              .join('<br/>')
          : '',
        c_field: c_data?.identifiedBy
          ? c_data.identifiedBy
              .map((id) => `${id.type}: ${id.value}`)
              .sort()
              .join('<br/>')
          : '',
        label: 'identifiers',
        score: scores?.identifier ?? '',
      },
    ];
  }
}
