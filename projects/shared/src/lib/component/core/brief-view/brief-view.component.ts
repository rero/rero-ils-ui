/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
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
import { NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, computed, ContentChildren, inject, input, QueryList, signal, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { map } from 'rxjs';
import { ReroTemplateDirective } from '../../../directive/rero-template.directive';

export type BriefViewTag = {
  label: string
  [key: string]: unknown;
}

@Component({
  selector: 'shared-brief-view',
  templateUrl: './brief-view.component.html',
  imports: [NgTemplateOutlet, RouterLink, Bind, Tag],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BriefViewComponent implements AfterContentInit {

  protected route = inject(ActivatedRoute);

  readonly link = input<string | string[] | null>();
  readonly title = input<string | undefined>(undefined);
  readonly tags = input<BriefViewTag[]>();

  viewcode = toSignal(this.route.params.pipe(map(p => p['viewcode'])));

  readonly detailUrl = computed(() => {
    if (Array.isArray(this.link())) {
      const link = this.link() as string[];
      return link.map((v: string) => v.replace(':viewcode', this.viewcode()))
    }

    const link = this.link() as string;
    return link.replace(':viewcode', this.viewcode());
  });

  @ContentChildren(ReroTemplateDirective) private templates!: QueryList<ReroTemplateDirective>;

  iconTemplate = signal<TemplateRef<any> | null>(null);
  titleTemplate = signal<TemplateRef<any> | null>(null);
  contentTemplate = signal<TemplateRef<any> | null>(null);
  tagsTemplate = signal<TemplateRef<any> | null>(null);

  isArray(link: string | string[] | null): boolean {
    return Array.isArray(link);
  }

  ngAfterContentInit(): void {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'icon': this.iconTemplate.set(item.template); break;
        case 'title': this.titleTemplate.set(item.template); break;
        case 'content': this.contentTemplate.set(item.template); break;
        case 'tags': this.tagsTemplate.set(item.template); break;
      }
    });
  }
}
