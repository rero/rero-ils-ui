// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CommonModule, formatDate, registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';
import { AppStore, testUserPatronWithSettings } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { ButtonModule } from 'primeng/button';
import { PatronProfilePersonalComponent } from './patron-profile-personal.component';
import localeEnGb from '@angular/common/locales/en-GB';

registerLocaleData(localeEnGb);

@Pipe({ name: 'dateTranslate'})
class MockDateTranslatePipe implements PipeTransform {
  transform(value: any, format = 'mediumDate', timezone?: string): string | null {
    if (value === null || value === undefined) return null;
    try {
      return formatDate(value, format, 'en-GB', timezone);
    } catch {
      return null;
    }
  }
}

describe('PatronProfilePersonalComponent', () => {
  let component: PatronProfilePersonalComponent;
  let fixture: ComponentFixture<PatronProfilePersonalComponent>;
  let translate: TranslateService;

  const catalog = {
    country_it: 'italia',
    country_sw: 'switzerland'
  };

  const appStoreSpy = {
    settings: vi.fn().mockReturnValue({
    userProfile: {
      readOnly: false
    }
  })
  };

  const fakeActivatedRoute = {
    snapshot: { data:{}, paramMap: { get: function(key) { return key; }} }
  } as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        PatronProfilePersonalComponent,
        CommonModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        ButtonModule],
    providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
      { provide: AppStore, useValue: appStoreSpy },
        provideHttpClient(),
        provideHttpClientTesting()
    ]
})
    .overrideComponent(PatronProfilePersonalComponent, {
      remove: { imports: [DateTranslatePipe] },
      add: { imports: [MockDateTranslatePipe] }
    })
    .compileComponents();
  });

  beforeEach(() => {
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', catalog);
    translate.use('en');
    fixture = TestBed.createComponent(PatronProfilePersonalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('patron', testUserPatronWithSettings.patrons[0]);
    fixture.componentRef.setInput('user', testUserPatronWithSettings.user);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user information', () => {
    const section = fixture.nativeElement.querySelector('h4');
    expect(section.textContent).toContain('Personal details');

    const dd = fixture.nativeElement.querySelectorAll('dl > dd');
    expect(dd[0].textContent).toContain('female');
    expect(dd[1].textContent).toContain('simonetta');
    expect(dd[2].textContent).toContain('Via Croix Noire 3 11100 Aosta italia');
    expect(dd[3].textContent).toContain('Rue des Remparts 1950 Sion switzerland');
    expect(dd[4].textContent).toContain('+39324993585');
    expect(dd[5].textContent).toContain('+39324993588');
    expect(dd[6].textContent).toContain('reroilstest+simonetta@gmail.com');
    expect(dd[7].textContent).toContain('2010023488');
    expect(dd[8].textContent).toContain('01/01/2024');
    expect(dd[9].textContent).toContain(
      'The loan history is visible in your patron account.'
    );

    const user = cloneDeep(testUserPatronWithSettings.user);
    user.keep_history = false;
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();
    expect(dd[9].textContent).toContain('The loan history is hidden.');

    const button = fixture.nativeElement.querySelector('#profile-edit');
    expect(button).toBeDefined();
  });
});
