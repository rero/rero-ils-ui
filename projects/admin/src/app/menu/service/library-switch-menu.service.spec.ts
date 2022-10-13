/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItemInterface, RecordEvent, RecordService } from '@rero/ng-core';
import { testUserLibrarianWithSettings, User, UserService } from '@rero/shared';
import { of } from 'rxjs';
import { LibraryService } from '../../service/library.service';
import { LibrarySwitchMenuService } from './library-switch-menu.service';
import { LibrarySwitchService } from './library-switch.service';

describe('LibrarySwitchMenuService', () => {
  let service: LibrarySwitchMenuService;
  let translateService: TranslateService;
  let librarySwitchService: LibrarySwitchService;

  const librariesResponse = {
    aggregations: {},
    hits: {
      hits: [
        {
          'metadata': {
            pid: '2',
            name: 'Bibliothèque cantonale valdôtaine, site de Pont-saint-Martin',
            code: 'AOSTE-CANT2',
            organisation: {
              pid: 1,
              type: 'org'
            }
          }
        },
        {
          'metadata': {
            pid: '3',
            name: 'Bibliothèque communale et scolaire d\'Avise',
            code: 'AOSTE-AVISE',
            organisation: {
              pid: 1,
              type: 'org'
            }
          }
        },
        {
          'metadata': {
            pid: '4',
            name: 'Bibliothèque du Lycée de la Vallée d\'Aoste',
            code: 'AOSTE-LYCEE',
            organisation: {
              pid: 1,
              type: 'org'
            }
          }
        }
      ],
      total: {
        relation: 'eq',
        value: 3
      }
    }
  };

  const recordEvent: RecordEvent = { resource: 'libraries', data: {} };

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  const user = new User(testUserLibrarianWithSettings);
  user.currentLibrary = '2';
  userServiceSpy.user = user;

  const LibraryServiceSpy = jasmine.createSpyObj('LibraryService', ['findByLibrariesPidAndOrderBy$']);
  LibraryServiceSpy.findByLibrariesPidAndOrderBy$.and.returnValue(of(librariesResponse));

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['totalHits']);
  recordServiceSpy.totalHits.and.returnValue(3);
  recordServiceSpy.onCreate$ = of(recordEvent);
  recordServiceSpy.onUpdate$ = of(recordEvent);
  recordServiceSpy.onDelete$ = of(recordEvent);

  const activeSuffix = '<S>'

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: LibraryService, useValue: LibraryServiceSpy },
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });
    service = TestBed.inject(LibrarySwitchMenuService);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('fr');
    translateService.setTranslation('fr', {
      'active': activeSuffix
    });
    librarySwitchService = TestBed.inject(LibrarySwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the libraries switch menu', () => {
    service.init();
    const menu = service.menu.getChildren();
    const librariesMenu = menu[0].getChildren();
    expect(librariesMenu.length).toEqual(3);
    let libSelect = librariesMenu.filter((libraryMenu: MenuItemInterface) => libraryMenu.getExtra('id') === user.currentLibrary)[0];
    expect(libSelect.getExtra('code')).toEqual('AOSTE-CANT2');
    expect(libSelect.getSuffix().name).toEqual(`(${activeSuffix})`);
    const newActiveLibrary = '3'
    librarySwitchService.switch(newActiveLibrary);
    libSelect = librariesMenu.filter((libraryMenu: MenuItemInterface) => libraryMenu.getExtra('id') === newActiveLibrary)[0];
    expect(libSelect.getExtra('code')).toEqual('AOSTE-AVISE');
    expect(libSelect.getSuffix().name).toEqual(`(${activeSuffix})`);
  });
});
