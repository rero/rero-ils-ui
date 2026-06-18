// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, inputBinding, Signal, Type, ViewChild, ViewContainerRef, input } from '@angular/core';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { TranslatePipe } from '@ngx-translate/core';
import { Entity, EntityType } from '../../../classes/entity';
import { ExtractSourceFieldPipe } from '../../../pipe/extract-source-field.pipe';
import { BriefViewTag, BriefViewComponent } from '../../core/brief-view/brief-view.component';
import { EntityBriefViewRemoteOrganisationComponent } from './entity-brief-view.organisation';
import { EntityBriefViewRemotePersonComponent } from './entity-brief-view.person';
import { ReroTemplateDirective } from '../../../directive/rero-template.directive';

@Component({
  selector: 'shared-entity-brief-view',
  providers: [ExtractSourceFieldPipe],
  template: `
    <shared-brief-view [title]="entityTitle()" [link]="routerLink()" [tags]="tags()">
      <ng-template rTemplate="icon">
        <i class="fa fa-2x" [class]="entityIcon()" [title]="record().metadata.type | translate"></i>
      </ng-template>
      <ng-template rTemplate="content">
        <ng-container #contentTemplate></ng-container>
      </ng-template>
      <ng-template rTemplate="tags" let-tags>
        <div class="ui:flex ui:gap-1">
          @for (tag of tags; track $index) {
            <p-tag [severity]="tag.label === 'remote' ? 'warn' : 'secondary'" [value]="tag.label" />
          }
        </div>
      </ng-template>
    </shared-brief-view>
  `,
  imports: [BriefViewComponent, ReroTemplateDirective, Bind, Tag, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityBriefViewComponent implements AfterViewInit {

  protected extractedSourceFieldPipe: ExtractSourceFieldPipe = inject(ExtractSourceFieldPipe);

  readonly record = input<any>(undefined);
  readonly type = input<string | undefined>(undefined);
  readonly detailUrl = input<{ link: string; external: boolean } | undefined>(undefined);

  @ViewChild('contentTemplate', { static: false, read: ViewContainerRef }) private entityContent!: ViewContainerRef;

  entityIcon: Signal<string> = computed(() => Entity.getIcon(this.record()?.metadata?.type));

  routerLink: Signal<string[] | string | null> = computed(() => {
    const record = this.record();
    const detailUrl = this.detailUrl();
    if (!record || !detailUrl) return null;
    const isRemote = record.metadata.resource_type === 'remote';
    if (detailUrl.external) {
      return detailUrl.link.replace('entities', isRemote ? 'entities/remote' : 'entities/local');
    }
    return isRemote
      ? ['/records', 'remote_entities', 'detail', record.metadata.pid]
      : ['/records', 'local_entities', 'detail', record.metadata.pid];
  });

  entityTitle: Signal<string> = computed(() => {
    const record = this.record();
    if (!record) return '';
    return record.metadata.resource_type === 'remote'
      ? this.extractedSourceFieldPipe.transform(record.metadata, 'authorized_access_point')
      : record.metadata.authorized_access_point;
  });

  tags: Signal<BriefViewTag[]> = computed(() => {
    const record = this.record();
    const detailUrl = this.detailUrl();
    if (!record || !detailUrl || detailUrl.external) return [];
    const result: BriefViewTag[] = [{ label: record.metadata.resource_type, type: record.metadata.resource_type }];
    if (record.metadata.resource_type === 'remote') {
      record.metadata.sources?.forEach((source: string) => result.push({ label: source.toUpperCase() }));
    } else if (record.metadata.source_catalog) {
      result.push({ label: record.metadata.source_catalog });
    }
    return result;
  });

  private contentComponent: Signal<Type<unknown> | null> = computed(() => {
    const record = this.record();
    if (!record || record.metadata.resource_type !== 'remote') return null;
    switch (record.metadata.type) {
      case EntityType.ORGANISATION: return EntityBriefViewRemoteOrganisationComponent;
      case EntityType.PERSON: return EntityBriefViewRemotePersonComponent;
      default: return null;
    }
  });

  ngAfterViewInit(): void {
    const component = this.contentComponent();
    if (component) {
      this.entityContent.createComponent(component, {
        bindings: [
          inputBinding('record', () => this.record()),
        ],
      });
    }
  }
}
