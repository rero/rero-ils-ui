/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule } from '@rero/ng-core';
import { ContributionFormatPipe } from 'projects/admin/src/app/pipe/contribution-format.pipe';
import { AppRoutingModule } from '../app-routing.module';
import { ErrorPageComponent } from '../error/error-page.component';
import { MainComponent } from '../main/main.component';
import { PersonBriefComponent } from '../person-brief/person-brief.component';
import { BioInformationsPipe } from './../pipes/bio-informations.pipe';
import { BirthDatePipe } from './../pipes/birth-date.pipe';
import { MefTitlePipe } from './../pipes/mef-title.pipe';
import { DocumentBriefComponent } from './document-brief.component';


describe('DocumentBriefComponent', () => {
  let component: DocumentBriefComponent;
  let fixture: ComponentFixture<DocumentBriefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentBriefComponent,
        ContributionFormatPipe,
        MefTitlePipe,
        BirthDatePipe,
        BioInformationsPipe,
        PersonBriefComponent,
        MainComponent,
        ErrorPageComponent
      ],
      imports: [
        RecordModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        AppRoutingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
