// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
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
