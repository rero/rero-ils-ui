/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { AfterContentInit, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { ReroTemplateDirective } from '../../../directive/rero-template.directive';

export interface BriefViewTag {
  label: string
  [key:string]: any;
}

@Component({
    selector: 'shared-brief-view',
    templateUrl: './brief-view.component.html',
    standalone: false
})
export class BriefViewComponent implements AfterContentInit {

  @Input() link: any;
  @Input() title: any;
  @Input() tags: Array<BriefViewTag>;

  @ContentChildren(ReroTemplateDirective) templates: QueryList<ReroTemplateDirective> | null;

  iconTemplate: TemplateRef<any> | null;
  titleTemplate: TemplateRef<any> | null;
  contentTemplate: TemplateRef<any> | null;
  tagsTemplate: TemplateRef<any> | null;

  isArray(link: string|string[]): boolean {
    return Array.isArray(link);
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'icon':
          this.iconTemplate = item.template;
          break;
        case 'title':
          this.titleTemplate = item.template;
          break;
        case 'content':
          this.contentTemplate = item.template;
          break;
        case 'tags':
          this.tagsTemplate = item.template;
          break;
      }
    });
  }
}
