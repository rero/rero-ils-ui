import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MainTitleService } from 'projects/admin/src/app/service/main-title.service';


@Component({
  selector: 'public-search-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @Input() viewcode: string;
  @Input() size: string = undefined;
  @Input() placeholder: string;
  @Input() maxLengthSuggestion = 100;


  get action() {
    return `/${this.viewcode}/search/documents`;
  }

  recordTypes = [];

  static getPersonName(metadata) {
    for (const source of ['rero', 'idref', 'bnf', 'gnd']) {
      if (metadata[source] && metadata[source].preferred_name_for_person) {
        return metadata[source].preferred_name_for_person;
      }
    }
  }

  constructor(
    private translateService: TranslateService,
    private _mainTitleService: MainTitleService
  ) {
      this.placeholder = this.translateService.instant('Search');
   }

  ngOnInit() {
    this.recordTypes = [{
      type: 'documents',
      field: 'autocomplete_title',
      getSuggestions: (query, documents) => this.getDocumentsSuggestions(query, documents),
      preFilters: this.viewcode ? {view: this.viewcode} : {}
    }, {
      type: 'persons',
      field: 'autocomplete_name',
      getSuggestions: (query, persons) => this.getPersonsSuggestions(query, persons),
      component: this,
      preFilters: this.viewcode ? {view: this.viewcode} : {}
    }];
  }

  getPersonsSuggestions(query, persons) {
    const values = [];
    persons.hits.hits.map(hit => {
      let text = SearchBarComponent.getPersonName(hit.metadata);
      text = text.replace(new RegExp(query, 'gi'), `<b>${query}</b>`);
      values.push({
        text,
        query: '',
        index: 'persons',
        category: this.translateService.instant('direct links'),
        href: `/${this.viewcode}/persons/${hit.metadata.pid}`,
        iconCssClass: 'fa fa-user'
      });
    });
    return values;
  }

  getDocumentsSuggestions(query, documents) {
    const values = [];
    documents.hits.hits.map(hit => {
      let text = this.getMainTitle(hit.metadata.title);
      let truncate = false;
      if (text.length > this.maxLengthSuggestion) {
        truncate = true;
        text = this.getMainTitle(hit.metadata.title).substr(0, this.maxLengthSuggestion);
      }
      text = text.replace(new RegExp(query, 'gi'), `<b>${query}</b>`);
      if (truncate) {
        text = text + ' ...';
      }
      values.push({
        text,
        query: this.getMainTitle(hit.metadata.title).replace(/[:\-\[\]()/"]/g, ' ').replace(/\s\s+/g, ' '),
        index: 'documents',
        category: this.translateService.instant('documents')
        // href: `/${this.viewcode}/documents/${hit.metadata.pid}`
      });
    });
    return values;
  }

  /**
   * Get main title (correspondig to 'bf_Title' type, present only once in metadata)
   * @param titleMetadata: title metadata
   */
  getMainTitle(titleMetadata: any): string {
    return this._mainTitleService.getMainTitle(titleMetadata);
  }
}
