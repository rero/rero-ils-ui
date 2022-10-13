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
import { CoreConfigService, CoreModule, MenuItem } from '@rero/ng-core';

import { MenuLanguageService } from './menu-language.service';

describe('MenuLanguageService', () => {
  let service: MenuLanguageService;
  let translateService: TranslateService;
  let configService: CoreConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ]
    });
    service = TestBed.inject(MenuLanguageService);
    translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('fr', {
      'ui_language_de': 'Allemand',
      'ui_language_en': 'Anglais',
      'ui_language_fr': 'Français'
    });
    translateService.setTranslation('en', {
      'ui_language_de': 'German',
      'ui_language_en': 'English',
      'ui_language_fr': 'French'
    });
    translateService.use('fr');
    configService = TestBed.inject(CoreConfigService);
    configService.languages = ['fr', 'en', 'de'];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should return the languages menu (french)', () => {
    service.generate();
    const menu = service.menu;
    expect(menu).toBeInstanceOf(MenuItem);
    const languageMenu = menu.getChildren()[0];
    expect(languageMenu.getName()).toEqual('Français');
    const languageLines = languageMenu.getChildren();
    expect(languageLines.length).toEqual(3);
    expect(languageLines[0].getName()).toEqual('Allemand');
    expect(languageLines[1].getName()).toEqual('Anglais');
    expect(languageLines[2].getName()).toEqual('Français');
  });

  it('Should return the languages menu (english)', () => {
    translateService.use('en');
    service.generate();
    const menu = service.menu;
    const languageMenu = menu.getChildren()[0];
    expect(languageMenu.getName()).toEqual('English');
    const languageLines = languageMenu.getChildren();
    expect(languageLines[0].getName()).toEqual('German');
  });
});
