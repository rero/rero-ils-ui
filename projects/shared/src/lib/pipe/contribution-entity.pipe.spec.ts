/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../service/app-settings.service';
import { ContributionEntityPipe, EntityInterface } from './contribution-entity.pipe';
import { cloneDeep } from 'lodash-es';

describe('ContributionEntityPipe', () => {

  let contributionEntityPipe: ContributionEntityPipe;
  let translateService: TranslateService;

  const appSettingsServiceSpy = jasmine.createSpyObj('AppSettingsService', ['']);
  appSettingsServiceSpy.settings = {
    'contributionAgentTypes': {
      'bf:Person': 'persons',
      'bf:Organisation': 'corporate-bodies'
    }
  };

  const contributions = [
    {
      entity: {
        authorized_access_point_de: 'Schweizerischer Fischereiverein',
        authorized_access_point_en: 'Swiss Fishing Federation',
        authorized_access_point_fr: 'Fédération suisse de pêche',
        authorized_access_point_it: 'Federazione svizzera della pesca',
        id_gnd: '1086038177',
        id_idref: '184282624',
        id_rero: 'A000153245',
        pid: '4360604',
        primary_source: 'idref',
        type: 'bf:Organisation'
      },
      role: ['ctb']
    },
    {
      entity: {
        authorized_access_point: 'Casas Ros, Antoni, 1972-',
        authorized_access_point_de: 'Casas Ros, Antoni, 1972-',
        authorized_access_point_en: 'Casas Ros, Antoni, 1972-',
        authorized_access_point_fr: 'Casas Ros, Antoni, 1972-',
        authorized_access_point_it: 'Casas Ros, Antoni, 1972-',
        type: 'bf:Person'
      },
      role: ['cre']
    }
  ];

  const contributions_result_en: EntityInterface = {
    count: 2,
    entries: [
      {
        authorizedAccessPoint: 'Swiss Fishing Federation',
        pid: '4360604',
        type: 'bf:Organisation',
        roles: ['contributor'],
        target: 'corporate-bodies'
      },
      {
        authorizedAccessPoint: 'Casas Ros, Antoni, 1972-',
        pid: undefined,
        type: 'bf:Person',
        roles: ['creator'],
        target: 'persons'
      }
    ]
  };

  const contributions_result_fr: EntityInterface = {
    count: 2,
    entries: [
      {
        authorizedAccessPoint: 'Fédération suisse de pêche',
        pid: '4360604',
        type: 'bf:Organisation',
        roles: ['contributeur'],
        target: 'corporate-bodies'
      },
      {
        authorizedAccessPoint: 'Casas Ros, Antoni, 1972-',
        pid: undefined,
        type: 'bf:Person',
        roles: ['créateur'],
        target: 'persons'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        ContributionEntityPipe,
        TranslateService,
        { provide: AppSettingsService, useValue: appSettingsServiceSpy }
      ]
    });
    contributionEntityPipe = TestBed.inject(ContributionEntityPipe);
    translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('fr', {
      'cre': 'créateur',
      'ctb': 'contributeur'
    });
    translateService.setTranslation('en', {
      'cre': 'creator',
      'ctb': 'contributor'
    });
  });

  it('create an instance', () => {
    expect(contributionEntityPipe).toBeTruthy();
  });

  it('Should return 2 converted records (french)', () => {
    translateService.use('fr');
    expect(contributionEntityPipe.transform(contributions)).toEqual(contributions_result_fr);
  });

  it('Should return 2 converted records (english)', () => {
    translateService.use('en');
    expect(contributionEntityPipe.transform(contributions)).toEqual(contributions_result_en);
  });

  it('Should return 1 record converted with the Person filter (english)', () => {
    translateService.use('en');
    const result = cloneDeep(contributions_result_en);
    result.entries.splice(0, 1);
    expect(contributionEntityPipe.transform(contributions, ['bf:Person'])).toEqual(result);
  });

  it('Should return 1 record converted with the limit parameter (english)', () => {
    translateService.use('en');
    const result = cloneDeep(contributions_result_en);
    result.entries.splice(1, 1);
    expect(contributionEntityPipe.transform(contributions, ['bf:Person', 'bf:Organisation'], 1)).toEqual(result);
  });
});
