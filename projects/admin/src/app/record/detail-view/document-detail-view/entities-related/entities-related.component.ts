// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, computed, inject, input, Signal, ChangeDetectionStrategy} from '@angular/core';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Entity } from '@rero/shared';
import { IEntityRelated, RawRelatedEntity } from './entities-related.interface';
import { RouterLink } from '@angular/router';
import { KeyValuePipe } from '@angular/common';
import { UpperCaseFirstPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-entities-related',
    templateUrl: './entities-related.component.html',
    imports: [RouterLink, TranslateDirective, KeyValuePipe, UpperCaseFirstPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntitiesRelatedComponent {

  private translateService: TranslateService = inject(TranslateService);

  /** Record metadata */
  record = input<any>();

  /**
   * Entities processed.
   * Derived from the `record` input, so that navigating to a linked document —
   * which only rebinds the input, without recreating this component — refreshes the list.
   */
  readonly entities: Signal<Record<string, IEntityRelated[]>> = computed(() => {
    const language = this.translateService.getCurrentLang();
    const metadata = this.record()?.metadata ?? {};
    const entities: Record<string, IEntityRelated[]> = {};
    Entity.FIELDS_WITH_REF.forEach((field: string) => {
      if (field in metadata && metadata[field].length > 0) {
        metadata[field].forEach(({ entity }: RawRelatedEntity) => {
          if (entity.resource_type) {
            entities[field] ??= [];
            entities[field].push({
              authorized_access_point: entity[`authorized_access_point_${language}`],
              pid: entity.pid,
              resource_type: entity.resource_type,
              type: entity.type,
              icon: Entity.getIcon(entity.type)
            });
          }
        });
      }
    });
    return entities;
  });
}
