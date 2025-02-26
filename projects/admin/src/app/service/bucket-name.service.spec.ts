/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { OrganisationApiService } from '../api/organisation-api.service';
import { BucketNameService } from './bucket-name.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

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
    imports: [TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })],
    providers: [
        { provide: OrganisationApiService, useValue: organisationApiServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(BucketNameService);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    translateService.setTranslation('en', {
      bar: 'foo bar',
      lang_fre: 'french',
      'Organisation name': 'Organisation name translated',
      '{{count}} claim': '{{count}} claim',
      '{{count}} claims': '{{count}} claims',
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

  it('should return the translated default value', () => {
    service.transform('foo', 'bar').subscribe((name: string) => {
      expect(name).toEqual('foo bar');
    });
  });

  it('should return label for claims', () => {
    service.transform('claims_count', '1').subscribe((name: string) => {
      expect(name).toEqual('1 claim');
    });
    service.transform('claims_count', '2').subscribe((name: string) => {
      expect(name).toEqual('2 claims');
    });
  })
});
