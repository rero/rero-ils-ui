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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreModule, DateTranslatePipe } from '@rero/ng-core';
import { AppSettingsService, testUserPatronWithSettings } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { SharedModule } from '@rero/shared';
import { PatronProfilePersonalComponent } from './patron-profile-personal.component';

describe('PatronProfilePersonalComponent', () => {
  let component: PatronProfilePersonalComponent;
  let fixture: ComponentFixture<PatronProfilePersonalComponent>;
  let translate: TranslateService;

  const catalog = {
    country_it: 'italia',
    country_sw: 'switzerland'
  };

  const appSettingsServiceSpy = jasmine.createSpyObj('AppSettingsService', ['']);
  appSettingsServiceSpy.settings = {
    userProfile: {
      readOnly: false
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatronProfilePersonalComponent,
        DateTranslatePipe
      ],
      imports: [
        CoreModule,
        TranslateModule.forRoot(),
        SharedModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AppSettingsService, useValue: appSettingsServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', catalog);
    translate.use('en');
    fixture = TestBed.createComponent(PatronProfilePersonalComponent);
    component = fixture.componentInstance;
    component.patron = testUserPatronWithSettings.patrons[0];
    component.user = testUserPatronWithSettings;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user information', () => {
    const section = fixture.nativeElement.querySelector('#personal-section');
    expect(section.textContent).toContain('Personal details');

    const dd = fixture.nativeElement.querySelectorAll('#personal-data dl > dd');
    expect(dd[0].textContent).toContain('male');
    expect(dd[1].textContent).toContain('simonetta');
    expect(dd[2].textContent).toContain('Via Croix Noire 3 11100 Aosta italia');
    expect(dd[3].textContent).toContain('Rue des Remparts 1950 Sion switzerland');
    expect(dd[4].textContent).toContain('+39324993585');
    expect(dd[5].textContent).toContain('+39324993588');
    expect(dd[6].textContent).toContain('reroilstest+simonetta@gmail.com');
    expect(dd[7].textContent).toContain('2010023488');
    expect(dd[8].textContent).toContain('01/01/2024');
    expect(dd[9].textContent).toContain(
      'The loan history is saved for a maximum of six months. It is visible to you and the library staff.'
    );

    const user = cloneDeep(testUserPatronWithSettings);
    user.keep_history = false;
    component.user = user;
    fixture.detectChanges();
    expect(dd[9].textContent).toContain('The loan history is not saved.');

    const button = fixture.nativeElement.querySelector('#profile-edit');
    expect(button).toBeDefined();
  });
});
