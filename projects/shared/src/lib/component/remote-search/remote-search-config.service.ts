// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from "@angular/core";
import { AutoCompleteRecordType, NgCoreTranslateService, TruncateTextPipe } from "@rero/ng-core";
import { MainTitlePipe } from "../../pipe/main-title.pipe";
import { AppStore } from "../../store/app.store";
import { Entity } from "../../classes/entity";

@Injectable({
  providedIn: null
})
export class RemoteSearchConfig {

  protected mainTitlePipe: MainTitlePipe = inject(MainTitlePipe);
  protected truncatePipe: TruncateTextPipe = inject(TruncateTextPipe);
  protected translateService: NgCoreTranslateService = inject(NgCoreTranslateService);
  protected appStore = inject(AppStore);

  private isAdmin = false;

  private viewCode: string | undefined;

  private maxLengthSuggestion: number;

  getConfig(isAdmin: boolean, viewCode?: string, maxLengthSuggestion?: number): AutoCompleteRecordType[] {
    this.isAdmin = isAdmin;
    this.viewCode = viewCode;
    this.maxLengthSuggestion = maxLengthSuggestion || 100;

    return [
      {
        field: 'autocomplete_title',
        index: 'documents',
        maxSuggestions: 10,
        groupLabel: this.translateService.instant('documents'),
        preFilters: viewCode !== undefined ? { view: viewCode } : {},
        processSuggestions: (documents: any, query: any) => this.processDocuments(documents, query)
      },
      {
        field: 'autocomplete_name',
        index: 'entities',
        maxSuggestions: 10,
        groupLabel: this.translateService.instant('authors/subjects'),
        preFilters: viewCode !== undefined ? { view: viewCode } : {},
        processSuggestions: (entities: any, query: any) => this.processEntities(entities, query)
      }
    ]
  }

  private processDocuments(documents: any, query: any): any[] {
    const values = [];
    documents.hits.hits.map((hit: any) => {
      const title = this.mainTitlePipe.transform(hit.metadata.title);
      let text = title;
      if (title.length > this.maxLengthSuggestion) {
        text = this.truncatePipe.transform(title, this.maxLengthSuggestion);
      }

      values.push({
        label: this.highlightSearch(text, query),
        value: text,
        originalLabel: text,
        index: 'documents',
        link: this.generateDocumentLink(title),
        iconClass: 'fa fa-file-o',
      });
    });

    return values;
  }

  private generateDocumentLink(title: string): string {
    const query = `${title}&page=1&size=10&sort=bestmatch`;
    if (this.isAdmin) {
      return `/records/documents?q=${query}&simple=1`;
    } else {
      return `/${this.viewCode}/search/documents?q=${query}`;
    }
  }

  private processEntities(entities: any, query: any): any[] {
    const values = [];
    entities.hits.hits.map((hit: any) => {
      const text = this.getContributionName(hit.metadata);
      values.push({
        label: this.highlightSearch(text, query),
        value: text,
        originalLabel: text,
        index: 'entities',
        link: this.generateEntityLink(hit.metadata),
        iconClass: `fa ${Entity.getIcon(hit.metadata.type)}`
      });
    });

    return values;
  }

  private highlightSearch(text: string, query: string): string {
    return text.replace(new RegExp(
      this.escapeRegExp(query), 'gi'),
      `<b>${query}</b>`
      );
  }

  private escapeRegExp(data: string): string {
    // $& means the whole matched string
    return data.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }

  private getContributionName(metadata: any): string {
    if (metadata.resource_type === 'remote') {
      const language = this.translateService.getCurrentLang();
      const order: any = this.appStore.settings()?.agentLabelOrder;
      const key = (language in order) ? language : 'fallback';
      const agentSources = (key === 'fallback')
        ? order[order[key]]
        : order[key];

      for (const source of agentSources) {
        if (metadata[source] && metadata[source].authorized_access_point) {
          return metadata[source].authorized_access_point;
        }
      }
    } else {
      const key = `authorized_access_point_${this.translateService.getCurrentLang()}`;
      const accessPointKey = Object.keys(metadata).includes(key) ? key : 'authorized_access_point';
      return metadata[accessPointKey];
    }
  }

  private generateEntityLink(metadata: any): string {
    const { pid, resource_type } = metadata;
    if (this.isAdmin) {
      return `/records/${resource_type}_entities/detail/${pid}`;
    } else {
      return `/${this.viewCode}/entities/${resource_type}/${pid}`;
    }
  }
}
