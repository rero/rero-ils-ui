/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Entity } from '../class/entity';

@Component({
  selector: 'shared-entity-link',
  template: `
    <a
      *ngIf="!external; else externalLink"
      [class]="className"
      [routerLink]="routerLinkParams"
      [queryParams]="queryParams"
    >{{ linkName }}</a>
    <ng-template #externalLink>
    <a
      [class]="className"
      [attr.href]="externalHrefLink"
    >{{ linkName }}</a>
    </ng-template>
  `
})
export class EntityLinkComponent implements OnInit {

  /** Entity field metadata */
  @Input() entity: any;

  /** Resource field name */
  @Input() resourceName: string;

  /** Link class name */
  @Input() className: string;

  /** Router link parameters */
  @Input() routerLinkParams = ['/records', 'documents'];

  /** Make link external */
  @Input() external: boolean = false;

  /** Link label name */
  linkName: string;

  /** External link href */
  externalHrefLink: string;

  /** Query params */
  queryParams: object = {};

  /**
   * Constructor
   * @param translateService - TranslateService
   */
  constructor(private translateService: TranslateService) {}

  /** OnInit hook */
  ngOnInit(): void {
    const lang = this.translateService.currentLang;
    this.linkName = `authorized_access_point_${lang}` in this.entity
      ? this.entity[`authorized_access_point_${lang}`]
      : this.entity.authorized_access_point;
    if ('resource_type' in this.entity) {
      const pid = this.entity.pids[this.entity.resource_type];
      this.queryParams = {
        q: `${this.resourceName}.entity.pids.${this.entity.resource_type}:${pid}`,
        simple: '0',
      };
    } else {
      this.queryParams = {
        q: `${this.resourceName}.entity.authorized_access_point_${lang}:"${this.linkName}"`,
        simple: '0',
      }
    }
    if (this.external) {
      // This link is used to redirect to the jinja view of the entity.
      this.externalHrefLink = Entity.generateHrefLink(this.routerLinkParams, this.queryParams);
    }
  }
}
