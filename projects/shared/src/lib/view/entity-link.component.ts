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
import { Component, inject, OnDestroy, OnInit, input, ChangeDetectionStrategy} from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Entity } from '../classes/entity';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'shared-entity-link',
    template: `
    @if (!external()) {
      <a
        [class]="className()"
        [routerLink]="routerLinkParams()"
        [queryParams]="queryParams"
      >{{ linkName }}</a>
    } @else {
      <a
        [class]="className()"
        [attr.href]="externalHrefLink"
      >{{ linkName }}</a>
    }
  `,
    imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityLinkComponent implements OnInit, OnDestroy {

  private translateService: TranslateService = inject(TranslateService);

  /** Entity field metadata */
  readonly entity = input<any>(undefined);

  /** Resource field name */
  readonly resourceName = input<string>(undefined);

  /** Link class name */
  readonly className = input<string>(undefined);

  /** Router link parameters */
  readonly routerLinkParams = input(['/records', 'documents']);

  /** Make link external */
  readonly external = input(false);

  /** Link label name */
  linkName: string;

  /** External link href */
  externalHrefLink: string;

  /** Query params */
  queryParams: object = {};

  subscriptions: Subscription = new Subscription();

  /** OnInit hook */
  ngOnInit(): void {
    this.subscriptions.add(
      this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.translateEntity(event.lang);
      })
    );
    this.translateEntity(this.translateService.getCurrentLang());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private translateEntity(lang: string): void{
    const entity = this.entity();
    this.linkName = `authorized_access_point_${lang}` in entity
      ? entity[`authorized_access_point_${lang}`]
      : entity.authorized_access_point;
    const entityValue = this.entity();
    if ('resource_type' in entityValue) {
      const pid = entityValue.pids[entityValue.resource_type];
      this.queryParams = {
        q: `${this.resourceName()}.entity.pids.${entityValue.resource_type}:${pid}`,
        simple: '0',
      };
    } else {
      this.queryParams = {
        q: `${this.resourceName()}.entity.authorized_access_point_${lang}:"${this.linkName}"`,
        simple: '0',
      }
    }
    if (this.external()) {
      // This link is used to redirect to the jinja view of the entity.
      this.externalHrefLink = Entity.generateHrefLink(this.routerLinkParams(), this.queryParams);
    }
  }
}
