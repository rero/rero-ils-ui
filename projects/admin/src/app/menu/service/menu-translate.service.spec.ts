/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { UserService } from '@rero/shared';
import { MenuItem } from 'primeng/api';
import { MenuTranslateService } from './menu-translate.service';

describe('MenuTranslateService', () => {
  let service: MenuTranslateService;
  let translate: TranslateService;

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = {
    currentLibrary: '1',
    currentOrganisation: '2',
    symbolName: 'AM',
    currentBudget: '1'
  };

  const translations = {
    'user': 'utilisateur'
  };

  const menuItems: MenuItem[] = [{
    label: '$symbolName',
    items: [
      {
        label: 'user',
        translateLabel: 'user'
      },
      {
        label: 'my library',
        routerLink: ['/', 'my-library', '$currentLibrary']
      },
      {
        label: 'query params',
        queryParams: {
          id: 1,
          organisation: '$currentOrganisation',
        }
      }
    ]
  }];

  const menuItemsResult: MenuItem[] = [{
    label: 'AM',
    items: [
      {
        label: 'utilisateur',
        translateLabel: 'user'
      },
      {
        label: 'my library',
        routerLink: ['/', 'my-library', '1']
      },
      {
        label: 'query params',
        queryParams: {
          id: 1,
          organisation: '2'
        }
      }
    ]
  }];

  const menuItemDateRange: MenuItem[] = [{
    label: 'date range',
    queryParams: {
      range: '$currentDayRange'
    }
  }];

  const menuLabelError: MenuItem[] = [{
    label: '$fooBar'
  }];

  const menuRouterLinkError: MenuItem[] = [{
    label: 'label',
    routerLink: ['/', '$fooBar']
  }];

  const menuQueryParamsError: MenuItem[] = [{
    label: 'label',
    queryParams: {
      id: '$fooBar'
    }
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        TranslateService
      ]
    });
    service = TestBed.inject(MenuTranslateService);
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('fr', translations);
    translate.use('fr');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the menu lines with the changes', () => {
    expect(service.process(menuItems)).toEqual(menuItemsResult);
  });

  it('should return the date range', () => {
    const { range } = service.process(menuItemDateRange)[0].queryParams;
    expect(range.includes('--')).toBeTrue();
    const [timeA, timeB] = range.split('--');
    expect(/^\d+$/.test(timeA)).toBeTrue();
    expect(/^\d+$/.test(timeB)).toBeTrue();
  });

  it('should have an error if the variable does not exist for the label', () => {
    expect(function() { service.process(menuLabelError) })
      .toThrow(new Error('Label exception: This variable "$fooBar" is not available.'));
  });

  it('should have an error if the variable does not exist for the routerlink', () => {
    expect(function() { service.process(menuRouterLinkError) })
      .toThrow(new Error('RouterLink exception: This variable "$fooBar" is not available.'));
  });

  it('should have an error if the variable does not exist for the queryParams', () => {
    expect(function() { service.process(menuQueryParamsError) })
      .toThrow(new Error('Query Param exception: This variable "$fooBar" is not available.'));
  });
});
