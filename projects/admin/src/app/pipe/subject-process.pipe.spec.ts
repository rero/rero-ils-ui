/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppSettingsService, SharedModule } from '@rero/shared';
import { SubjectProcessPipe } from './subject-process.pipe';

describe('SubjectProcessPipe', () => {
  const input = [
    {
      $schema: 'https://bib.rero.ch/schemas/contributions/contribution-v0.0.1.json',
      type: 'bf:Person',
      gnd: {
        preferred_name: 'gnd preferred name'
      },
      idref: {
        preferred_name: 'idref preferred name'
      },
      rero: {
        preferred_name: 'rero preferred name'
      }
    },
    {
      term: 'subject vocabulary',
      type: 'bf:Topic'
    },
    {
      preferred_name: 'author',
      type: 'bf:Person'
    },
    {
      title: 'Le dragon du Muveran',
      creator: 'Voltenauer, Marc',
      type: 'bf:Work'
    }
  ];
  const outputFr = [
    { type: 'bf:Person', text: 'idref preferred name' },
    { type: 'bf:Topic', text: 'subject vocabulary' },
    { type: 'bf:Person', text: 'author' },
    { type: 'bf:Work', text: 'Le dragon du Muveran / Voltenauer, Marc' }
  ];
  const outputDe = [
    { type: 'bf:Person', text: 'gnd preferred name' },
    { type: 'bf:Topic', text: 'subject vocabulary' },
    { type: 'bf:Person', text: 'author' },
    { type: 'bf:Work', text: 'Le dragon du Muveran / Voltenauer, Marc' }
  ];

  let pipe: SubjectProcessPipe;
  let appSettings: AppSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        SubjectProcessPipe
      ]
    });
    pipe = TestBed.inject(SubjectProcessPipe);
    appSettings = TestBed.inject(AppSettingsService);
    appSettings.settings = {
      baseUrl: 'https://bib.rero.ch',
      agentSources: [],
      agentAgentTypes: '',
      agentLabelOrder: {
        fallback: 'fr',
        fr: ['idref', 'rero', 'gnd'],
        de: ['gnd', 'idref', 'rero']
      },
      globalView: 'global',
      language: 'fr',
      operationLogs: [],
      userProfile: {
        readOnly: false,
        readOnlyFields: []
      }
    };
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an array with the value (french)', () => {
    expect(pipe.transform(input, 'fr')).toEqual(outputFr);
  });

  it('should return an array with the value (Deutsch)', () => {
    expect(pipe.transform(input, 'de')).toEqual(outputDe);
  });

  it('should return an array with the value (English => Fallback)', () => {
    expect(pipe.transform(input, 'en')).toEqual(outputFr);
  });
});
