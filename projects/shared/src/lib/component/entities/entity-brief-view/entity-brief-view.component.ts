/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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

import { AfterViewInit, Component, inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ResultItem } from '@rero/ng-core';
import { Entity, EntityType } from '../../../class/entity';
import { ExtractSourceFieldPipe } from '../../../pipe/extract-source-field.pipe';
import { BriefViewTag } from '../../core/brief-view/brief-view.component';
import { EntityBriefViewRemoteOrganisationComponent } from './entity-brief-view.organisation';
import { EntityBriefViewRemotePersonComponent } from './entity-brief-view.person';

@Component({
  selector: 'shared-entity-brief-view',
  providers: [ExtractSourceFieldPipe],
  styleUrls: ['./entity-brief-view.component.scss'],
  template: `
    <shared-brief-view [title]="entityTitle" [link]="routerLink" [tags]="tags">
      <ng-template rTemplate="icon">
        <i class="fa fa-2x" [class]="entityIcon" [title]="record.metadata.type | translate"></i>
      </ng-template>
      <ng-template rTemplate="content">
        <ng-container #contentTemplate></ng-container>
      </ng-template>
      <ng-template rTemplate="tags" let-tags>
        <ul>
          @for (tag of tags; track tag) {
            <li class="tag-{{ tag?.type }}">{{ tag.label }}</li>
          }
        </ul>
      </ng-template>
    </shared-brief-view>
  `
})
export class EntityBriefViewComponent implements ResultItem, OnInit, AfterViewInit {

  protected extractedSourceFieldPipe: ExtractSourceFieldPipe = inject(ExtractSourceFieldPipe);

  // COMPONENT ATTRIBUTES =====================================================
  /** The entity record to display */
  @Input() record: any;
  /** The entity record type */
  @Input() type: string;
  /** URL to access detail view of the entity. */
  @Input() detailUrl: { link: string, external: boolean };

  /** The entity body content container */
  @ViewChild('contentTemplate', {static: false, read: ViewContainerRef}) entityContent: ViewContainerRef;

  /** Reference to `EntityType` enum. */
  entityIcon: string;
  /** the data used to build the detail view URL link. */
  routerLink: Array<string> | string;
  /** Entity title */
  entityTitle: string;
  /** tags for this entity */
  tags: Array<BriefViewTag> = [];

  /** The component to use to build the entity body content. */
  private contentComponent: any = null;

  /** OnInit hook */
  ngOnInit(): void {
    switch (this.record.metadata.resource_type) {
      case 'remote': this._buildRemoteEntityData(); break;
      case 'local': this._buildLocalEntityData(); break;
      default: throw new Error('Unknown entity resource type !')
    }
    this.entityIcon = Entity.getIcon(this.record.metadata.type);
  }

  /** AfterViewInit hook */
  ngAfterViewInit() {
    if (this.contentComponent) {
      setTimeout(() => {  // To be run at next macro task and avoid `NG100` error into console.
        const componentRef: any = this.entityContent.createComponent(this.contentComponent);
        componentRef.instance.record = this.record;
      });
    }
  }

  // PRIVATE COMPONENT METHODS ================================================
  /** Set data used to display a remote entity. */
  private _buildRemoteEntityData(): void {
    if (this.detailUrl.external) {
      this.routerLink = this.detailUrl.link.replace('entities', 'entities/remote');
    } else {
      this.routerLink = ['/records', 'remote_entities', 'detail', this.record.metadata.pid];
      this.tags = [{label: this.record.metadata.resource_type, type: 'remote'}];
      this.record.metadata.sources.forEach((source: string) => this.tags.push({label: source.toUpperCase()}));
    }
    this.entityTitle = this.extractedSourceFieldPipe.transform(this.record.metadata, 'authorized_access_point');

    switch (this.record.metadata.type) {
      case EntityType.ORGANISATION: this.contentComponent = EntityBriefViewRemoteOrganisationComponent; break;
      case EntityType.PERSON: this.contentComponent = EntityBriefViewRemotePersonComponent; break;
    }
  }

  /** Set data used to display a local entity. */
  private _buildLocalEntityData(): void {
    if (this.detailUrl.external) {
      this.routerLink = this.detailUrl.link.replace('entities', 'entities/local');
    } else {
      this.routerLink = ['/records', 'local_entities', 'detail', this.record.metadata.pid];
      this.tags = [
        {label: this.record.metadata.resource_type, type: 'local'},
        {label: this.record.metadata?.source_catalog}
      ];
    }
    this.entityTitle = this.record.metadata.authorized_access_point;
  }
}
