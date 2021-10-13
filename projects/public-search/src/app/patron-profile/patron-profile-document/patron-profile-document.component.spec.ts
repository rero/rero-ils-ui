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
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@rero/ng-core';
import { ContributionFilterPipe, testUserPatronLibrarian } from '@rero/shared';
import { PatronProfileMenuService } from '../patron-profile-menu.service';
import { PatronProfileDocumentComponent } from './patron-profile-document.component';


describe('PatronProfileDocumentComponent', () => {
  let component: PatronProfileDocumentComponent;
  let fixture: ComponentFixture<PatronProfileDocumentComponent>;

  const record = {
    metadata: {
      document: {
        pid: '1',
        contribution: [
          {
            agent: {
              authorized_access_point_fr: 'agent1_link_fr',
              authorized_access_point_en: 'agent1_link_en',
              type: 'bf:Person',
              pid: '12'
            },
            role: [
              'cre'
            ]
          },
          {
            agent: {
              authorized_access_point_fr: 'agent2_fr',
              authorized_access_point_en: 'agent2_en',
              type: 'bf:Person'
            },
            role: [
              'ctb'
            ]
          }
        ]
      },
      item: {
        pid: '2',
        call_number: 'A123456',
        enumerationAndChronology: 'item unit'
      }
    }
  };

  const patronProfileMenuServiceSpy = jasmine.createSpyObj('PatronProfileMenuService', ['']);
  patronProfileMenuServiceSpy.currentPatron = testUserPatronLibrarian.patrons[0];

  const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['']);
  translateServiceSpy.currantLang = 'fr';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatronProfileDocumentComponent,
        ContributionFilterPipe
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: PatronProfileMenuService, useValue: patronProfileMenuServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileDocumentComponent);
    component = fixture.componentInstance;
    component.record = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the data from the document and the item', () => {
    const dd = fixture.nativeElement.querySelectorAll('dl > dd');
    const contribFirst = dd[0].querySelector('ul > li:first-child > a');
    expect(contribFirst.textContent).toContain('agent1_link_en');
    const contribLast = dd[0].querySelector('ul > li:last-child');
    expect(contribLast.textContent).toContain('agent2_en');

    expect(dd[1].textContent).toContain('A123456');
    expect(dd[2].textContent).toContain('item unit');
  });
});
