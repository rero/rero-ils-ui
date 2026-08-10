// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Params, RouterLink } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { Entity } from '../classes/entity';
import { EntityLinkEntity } from './model/entity-link-model';

@Component({
    selector: 'shared-entity-link',
    template: `
    @if (!external()) {
      <a
        [class]="className()"
        [routerLink]="routerLinkParams()"
        [queryParams]="queryParams()"
      >{{ linkName() }}</a>
    } @else {
      <a
        [class]="className()"
        [attr.href]="externalHrefLink()"
      >{{ linkName() }}</a>
    }
  `,
    imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityLinkComponent {

  private translateService: TranslateService = inject(TranslateService);

  /** Entity field metadata */
  readonly entity = input<EntityLinkEntity | undefined>(undefined);

  /** Resource field name */
  readonly resourceName = input<string>(undefined);

  /** Link class name */
  readonly className = input<string>(undefined);

  /** Router link parameters */
  readonly routerLinkParams = input(['/records', 'documents']);

  /** Make link external */
  readonly external = input(false);

  /** Current interface language */
  private readonly language = toSignal(
    this.translateService.onLangChange.pipe(map((event: LangChangeEvent) => event.lang)),
    { initialValue: this.translateService.getCurrentLang() }
  );

  /**
   * Link label, in the current interface language when the entity provides it.
   * Derived from the `entity` input and not computed once: this component is rendered
   * inside `@for` blocks tracked by index, so navigating to another record only rebinds
   * the input, without recreating the component.
   */
  readonly linkName: Signal<string> = computed(() => {
    const entity: EntityLinkEntity = this.entity() ?? {};
    const accessPoint = `authorized_access_point_${this.language()}`;
    return accessPoint in entity ? entity[accessPoint] : entity.authorized_access_point;
  });

  /** Query params of the search this link points to */
  readonly queryParams: Signal<Params> = computed(() => {
    const entity: EntityLinkEntity = this.entity() ?? {};
    const query = 'resource_type' in entity
      ? `${this.resourceName()}.entity.pids.${entity.resource_type}:${entity.pids[entity.resource_type]}`
      : `${this.resourceName()}.entity.authorized_access_point_${this.language()}:"${this.linkName()}"`;
    return { q: query, simple: '0' };
  });

  /** External link href, used to redirect to the jinja view of the entity */
  readonly externalHrefLink: Signal<string> = computed(() =>
    Entity.generateHrefLink(this.routerLinkParams(), this.queryParams())
  );
}
