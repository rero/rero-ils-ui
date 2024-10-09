/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Entity } from '@rero/shared';
import { IEntityRelated } from './entities-related.interface';

@Component({
  selector: 'admin-entities-related',
  templateUrl: './entities-related.component.html'
})
export class EntitiesRelatedComponent implements OnInit {

  private translateService: TranslateService = inject(TranslateService);

  /** Record metadata */
  @Input() record: any;

  /** Entities processed */
  entities: {[key: string]: IEntityRelated[]} = {};

  /** OnInit hook */
  ngOnInit(): void {
    const language = this.translateService.currentLang;
    const { metadata } = this.record;
    Entity.FIELDS_WITH_REF.forEach((field: string) => {
      if (field in metadata && metadata[field].length > 0) {
        metadata[field].forEach((entity: any) => {
          if (entity.entity.resource_type) {
            if (!Object.keys(this.entities).includes(field)) {
              this.entities[field] = [];
            }
            this.entities[field].push({
              authorized_access_point: entity.entity[`authorized_access_point_${language}`],
              pid: entity.entity.pid,
              resource_type: entity.entity.resource_type,
              type: entity.entity.type,
              icon: Entity.getIcon(entity.entity.type)
            });
          }
        });
      }
    });
  }
}
