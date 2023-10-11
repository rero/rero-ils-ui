/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { TestBed } from '@angular/core/testing';
import { DocumentApiService } from '@app/admin/api/document-api.service';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { AdvancedSearchService } from './advanced-search.service';

describe('AdvancedSearchService', () => {
  let service: AdvancedSearchService;

  const apiResponse = {
    fieldsConfig: [
      {
        field: "title.*",
        label: "Title",
        value: "title",
        options: {
          search_type: [
            { label: "contains", value: AdvancedSearchService.SEARCH_TYPE_CONTAINS },
            { label: "exact", value: AdvancedSearchService.SEARCH_TYPE_CONTAINS_PHRASE },
          ]},
        },
      {
        field: "provisionActivity.place.country",
        label: "Country",
        value: "country",
        options: {
          search_type: [
            { label: "exact", value: AdvancedSearchService.SEARCH_TYPE_CONTAINS_PHRASE },
          ]
        },
      }
    ],
    fieldsData: {
      canton: [
        { label: "canton_ag", value: "ag" },
        { label: "canton_ai", value: "ai" }
      ],
      country: [
        { label: "country_aa", value: "aa" },
        { label: "country_abc", value: "abc" }
      ],
      rdaCarrierType: [],
      rdaContentType: [],
      rdaMediaType: []
    }
  };

  const documentApiServiceSpy = jasmine.createSpyObj('DocumentApiService', ['getAdvancedSearchConfig']);
  documentApiServiceSpy.getAdvancedSearchConfig.and.returnValue(of(cloneDeep(apiResponse)));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DocumentApiService, useValue: documentApiServiceSpy }
      ]
    });
    service = TestBed.inject(AdvancedSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a boolean when the configuration is loaded', () => {
    service.load().subscribe((loaded: boolean) => {
      expect(loaded).toBeTruthy();
    });
  });

  it('should return the fields configuration', () => {
    const response = [
      { label: "Title", value: "title" },
      { label: "Country", value: "country" },
    ];
    service.load().subscribe(() => {
      expect(service.getFieldsConfig()).toEqual(response);
    });
  });

  it('should return the fields data', () => {
    service.load().subscribe(() => {
      expect(service.getFieldsData()).toEqual(apiResponse.fieldsData);
    });
  });

  it('should return the fields search type data', () => {
    const response = {
      title: [
        { label: "contains", value: AdvancedSearchService.SEARCH_TYPE_CONTAINS },
        { label: "exact", value: AdvancedSearchService.SEARCH_TYPE_CONTAINS_PHRASE },
      ],
      country: [
        { label: "exact", value: AdvancedSearchService.SEARCH_TYPE_CONTAINS_PHRASE },
      ]
    };
    service.load().subscribe(() => {
      expect(service.getFieldsSearchType()).toEqual(response);
    });
  });

  it('should return the operators', () => {
    const response = [
      { label: 'and', value: AdvancedSearchService.OPERATOR_AND },
      { label: 'or', value: AdvancedSearchService.OPERATOR_OR },
      { label: 'and not', value: AdvancedSearchService.OPERATOR_NOT }
    ];
    service.load().subscribe(() => {
      expect(service.getOperators()).toEqual(response);
    });
  });

  it('should return the mapping', () => {
    service.load().subscribe(() => {
      expect(service.fieldMapping('title')).toEqual('title.*');
    });
  });

  it('Should return an error if the field does not exist', () => {
    service.load().subscribe(() => {
      expect(function() { service.fieldMapping('foo') })
      .toThrowError(SyntaxError, 'Field mapping does not exist (foo)');
    });
  });

  it('should return a search string', () => {
    service.load().subscribe((loaded: boolean) => {
      // CONTAINS
      let searchString = 'title.\\*:(flamand)';
      let model = {
        field: 'title',
        term: 'flamand',
        searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS,
        search: [{
          operator: AdvancedSearchService.OPERATOR_AND,
          field: 'title',
          term: '',
          searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS
        }],
      }
      expect(service.generateQueryByModel(model)).toEqual(searchString);

      // CONTAINS: Test protect ( and )
      searchString = 'title.\\*:(\\(flamand\\))';
      model = {
        field: 'title',
        term: '(flamand)',
        searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS,
        search: [{
          operator: AdvancedSearchService.OPERATOR_AND,
          field: 'title',
          term: '',
          searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS
        }],
      }
      expect(service.generateQueryByModel(model)).toEqual(searchString);

      // PHRASE
      searchString = 'title.\\*:"flamand"';
      model = {
        field: 'title',
        term: 'flamand',
        searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS_PHRASE,
        search: [{
          operator: AdvancedSearchService.OPERATOR_AND,
          field: 'title',
          term: '',
          searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS
        }],
      }
      expect(service.generateQueryByModel(model)).toEqual(searchString);

      // PHRASE: Test protect "
      searchString = 'title.\\*:"\\"flamand\\""';
      model = {
        field: 'title',
        term: '"flamand"',
        searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS_PHRASE,
        search: [{
          operator: AdvancedSearchService.OPERATOR_AND,
          field: 'title',
          term: '',
          searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS
        }],
      }
      expect(service.generateQueryByModel(model)).toEqual(searchString);

      // MULTIPLE SEARCH
      searchString = 'title.\\*:(flamand) AND title.\\*:"primitif" OR provisionActivity.place.country:"abc"';
      model = {
        field: 'title',
        term: 'flamand',
        searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS,
        search: [
          {
            operator: AdvancedSearchService.OPERATOR_AND,
            field: 'title',
            term: 'primitif',
            searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS_PHRASE
          },
          {
            operator: AdvancedSearchService.OPERATOR_OR,
            field: 'country',
            term: 'abc',
            searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS_PHRASE
          }
        ],
      }
      expect(service.generateQueryByModel(model)).toEqual(searchString);
    })
  });
});
