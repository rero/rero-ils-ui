import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
    for (const source of ['rero', 'bnf', 'gnd']) {
      if (metadata[source] && metadata[source].preferred_name_for_person) {
        return metadata[source].preferred_name_for_person;
      }
    }
  }

  constructor(private translateService: TranslateService) {
      this.placeholder = this.translateService.instant('Search');
   }

  ngOnInit() {
    this.recordTypes = [{
      type: 'documents',
      field: 'autocomplete_title',
      getSuggestions: (query, persons) => this.getDocumentsSuggestions(query, persons),
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
      let text = hit.metadata.title;
      let truncate = false;
      if (text.length > this.maxLengthSuggestion) {
        truncate = true;
        text = hit.metadata.title.substr(0, this.maxLengthSuggestion);
      }
      text = text.replace(new RegExp(query, 'gi'), `<b>${query}</b>`);
      if (truncate) {
        text = text + ' ...';
      }
      values.push({
        text,
        query: hit.metadata.title.replace(/[:\-\[\]()/"]/g, ' ').replace(/\s\s+/g, ' '),
        index: 'documents',
        category: this.translateService.instant('documents')
        // href: `/${this.viewcode}/documents/${hit.metadata.pid}`
      });
    });
    return values;
  }
}
