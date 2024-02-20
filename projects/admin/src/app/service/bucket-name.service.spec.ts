/*
 * RERO ILS UI
 * Copyright (C) 2021-2023 RERO
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { OrganisationApiService } from '../api/organisation-api.service';
import { BucketNameService } from './bucket-name.service';

describe('BucketNameService', () => {
  let service: BucketNameService;
  let translateService: TranslateService;

  const response = {
    name: 'Organisation name'
  };

  const organisationApiServiceSpy = jasmine.createSpyObj('OrganisationApiService', ['getByPid']);
  organisationApiServiceSpy.getByPid.and.returnValue(of(response));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        { provide: OrganisationApiService, useValue: organisationApiServiceSpy }
      ]
    });
    service = TestBed.inject(BucketNameService);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    translateService.setTranslation('en', {
      bar: 'foo bar',
      lang_fre: 'french',
      'Organisation name': 'Organisation name translated'
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the language key', () => {
    service.transform('language', 'fre').subscribe((name: string) => {
      expect(name).toEqual('french');
    });
  });

  it('should return the name of the untranslated organization', () => {
    service.transform('organisation', '1').subscribe((name: string) => {
      expect(name).toEqual(response.name);
    });
  });

  it('should return the default value', () => {
    service.transform('foo', 'bar').subscribe((name: string) => {
      expect(name).toEqual('bar');
    });
  });
});
